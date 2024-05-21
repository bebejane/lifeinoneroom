import os from 'os';
import dotenv from 'dotenv'; dotenv.config();
import { ElevenLabsClient } from "elevenlabs";
import { createWriteStream } from "fs";
import { buildClient, uploadLocalFileAndReturnPath } from '@datocms/cma-client-node';
import { render } from 'datocms-structured-text-to-plain-text';

const client = buildClient({
	apiToken: process.env.DATOCMS_API_TOKEN,
	environment: process.env.DATOCMS_ENVIRONMENT,
});

const elevenlabs = new ElevenLabsClient({
	apiKey: process.env.ELEVENLABS_API_KEY,
});

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

export const generate = async (item: any, item_type: string) => {

	const { id } = item;
	const { field, type } = postTypeMap[item_type];
	const textInput = type === 'string' ? item[field] : type === 'structured_text' ? render(item[field]) : null;
	const fileName = `${id}.mp3`;

	if (!textInput) throw new Error('No text found');

	try {
		console.log('generating audio', textInput.length)
		console.time('generate')

		const { filePath, alignment } = await createAudioFileFromText(textInput, `${os.tmpdir}/${fileName}`);

		console.timeEnd('generate')

		const u = await upload(filePath, fileName, item.audio?.upload_id, alignment);
		await client.items.update(id, { audio: { upload_id: u.id } });
		await client.items.publish(id);

	} catch (e) {
		console.error(e);
		throw new Error('Failed to generate audio');
	}
}

async function createAudioFileFromText(text: string, filePath: string): Promise<any> {
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
			resolve({ filePath, alignment })
		} catch (error) {
			console.log(error)
			reject(error);
		}
	});
};


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