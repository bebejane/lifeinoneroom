import os from 'os';
import dotenv from 'dotenv'; dotenv.config();
import fs from "fs";
import OpenAI from "openai";
import { ElevenLabsClient } from "elevenlabs";
import { createWriteStream } from "fs";
import { buildClient, uploadLocalFileAndReturnPath } from '@datocms/cma-client-node';
import { render } from 'datocms-structured-text-to-plain-text';

const postTypeMap = {
  "image": {
    field: "text_to_voice",
    type: 'string'
  },
  "text": {
    field: "text",
    type: 'structured_text'
  }
}

const elevenlabs = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
const client = buildClient({ apiToken: process.env.DATOCMS_API_TOKEN, environment: process.env.DATOCMS_ENVIRONMENT });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const voices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];

export const generate = async (item: any, item_type: string) => {

  const { id } = item;
  const { field, type } = postTypeMap[item_type];
  const textInput = type === 'string' ? item[field] : type === 'structured_text' ? render(item[field]) : null;
  const fileName = `${id}.mp3`;

  if (!textInput) throw new Error('No text found');

  try {
    console.log('generating audio', textInput.length + ' characters')
    console.time('generate')

    const { filePath, transcription } = await createAudioFileFromTextOpenAI(textInput, `${os.tmpdir}/${fileName}`);

    console.timeEnd('generate')

    const u = await upload(filePath, fileName, item.audio?.upload_id, transcription);
    await client.items.update(id, { audio: { upload_id: u.id } });
    await client.items.publish(id);

    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      console.error('Failed to delete file', filePath)
    }

  } catch (e) {
    console.error(e);
    throw new Error('Failed to generate audio');
  }
}

async function createAudioFileFromTextOpenAI(text: string, filePath: string): Promise<any> {

  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: text,
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(filePath, buffer);
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: "whisper-1",
    response_format: "verbose_json",
    timestamp_granularities: ["word"],
  });
  //@ts-ignore
  return { filePath, transcription: { words: JSON.stringify(transcription.words) } };
}


async function upload(localPath: string, filename: string, upload_id?: string, custom_data: any = {}) {

  console.log('uploading', upload_id ? 'update' : 'create')
  console.time('upload')

  let upload = null
  const default_field_metadata = { en: { alt: '', title: '', custom_data } }

  if (upload_id) {
    await client.uploads.update(upload_id, {
      path: await uploadLocalFileAndReturnPath(client, localPath, { filename })
    })
    upload = await client.uploads.update(upload_id, { default_field_metadata });
  } else {
    upload = await client.uploads.createFromLocalFile({
      localPath,
      filename,
      skipCreationIfAlreadyExists: true,
      default_field_metadata
    });
  }
  console.timeEnd('upload')
  return upload;
}

function b64toBlob(data: string): Blob {

  var byteString = atob(data);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);

  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: 'audio/mpeg' });
}

async function createAudioFileFromTextElvenLabs(text: string, filePath: string): Promise<any> {
  return new Promise<any>(async (resolve, reject) => {
    try {

      const voice_id = "pNInz6obpgDQGcFmaJgB"
      const body = {
        text,
        voice: "pNInz6obpgDQGcFmaJgB",
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          similarity_boost: 0.5,
          stability: 0.5,
          use_speaker_boost: true,
          style: 1
        }
      }

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}/with-timestamps`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify(body),
      })

      const json = await response.json()
      const blob = b64toBlob(json.audio_base64)
      const alignment = json.alignment;

      let buffer = await blob.arrayBuffer();
      buffer = Buffer.from(buffer)
      const fileStream = createWriteStream(filePath)
      fileStream.write(buffer);
      resolve({ filePath, transcription: alignment })
    } catch (error) {
      console.log(error)
      reject(error);
    }
  });
};

