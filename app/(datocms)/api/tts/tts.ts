import os from 'os';
import dotenv from 'dotenv'; dotenv.config();
import fs from "fs";
import OpenAI from "openai";
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
type Voice = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer"

const client = buildClient({ apiToken: process.env.DATOCMS_API_TOKEN, environment: process.env.DATOCMS_ENVIRONMENT });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const voices: Voice[] = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];

export const generate = async (item: any, item_type: string) => {

	const { id } = item;
	const { field, type } = postTypeMap[item_type];
	const textInput = type === 'string' ? item[field] : type === 'structured_text' ? render(item[field]) : null;

	if (!textInput)
		throw new Error('No text found');

	console.log(item.audio?.custom_data?.text)

	if (item.audio?.custom_data?.text && textInput === item.audio?.custom_data?.text)
		return console.log('Already generated');

	const fileName = `${id}.mp3`;

	if (!textInput) throw new Error('No text found');

	try {
		console.log('generating audio', textInput.length + ' characters')
		console.time('generate')

		const { filePath, customData } = await createAudioFileFromTextOpenAI(textInput, `${os.tmpdir}/${fileName}`);

		console.timeEnd('generate')

		const u = await upload(filePath, fileName, item.audio?.upload_id, customData);
		await client.items.update(id, { audio: { upload_id: u.id } });
		await client.items.publish(id);

		try {
			fs.unlinkSync(filePath);
		} catch (e) {
			console.error('Failed to delete file', filePath)
		}

	} catch (e) {
		throw new Error(`Failed to generate audio. ${e.message}`);
	}
}

async function createAudioFileFromTextOpenAI(text: string, filePath: string): Promise<any> {

	const mp3 = await openai.audio.speech.create({
		model: "tts-1",
		voice: voices[Math.floor(Math.random() * voices.length)],
		input: text,
	});

	const buffer = Buffer.from(await mp3.arrayBuffer());
	await fs.promises.writeFile(filePath, buffer);
	/*
	const transcription = await openai.audio.transcriptions.create({
		file: fs.createReadStream(filePath),
		model: "whisper-1",
		response_format: "verbose_json",
		timestamp_granularities: ["word"],
	});
	*/
	//@ts-ignore
	return { filePath, customData: { text } };
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