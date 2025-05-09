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
	},
	"about": {
		field: "text",
		type: 'structured_text'
	},
	"introduction": {
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

	const audio = item?.audio?.upload_id ? await client.uploads.find(item.audio.upload_id) : null
	const speed = item?.audio_speed ? parseFloat(item.audio_speed) : 1.0;
	const instructions = item?.audio_instructions ?? undefined
	const currentInstructions = audio?.default_field_metadata.en.custom_data?.instructions ?? null;
	const currentText = audio?.default_field_metadata.en.custom_data?.text ?? null;
	const currentSpeed = audio?.default_field_metadata.en.custom_data?.speed ? parseFloat(audio.default_field_metadata.en.custom_data?.speed as string) : null;


	if ((currentText && textInput === currentText) && currentSpeed === speed && currentInstructions === instructions)
		return console.log('Already generated');

	const fileName = `${id}.mp3`;

	if (!textInput) throw new Error('No text found');

	try {
		console.log('generating audio', textInput.length + ' characters')
		console.time('generate')

		const { filePath, customData } = await createAudioFileFromTextOpenAI(textInput, `${os.tmpdir}/${fileName}`, speed, instructions);

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
		console.log(e)
		throw new Error(`Failed to generate audio. ${e.message}`);
	}
}

export async function createAudioFileFromTextOpenAI(text: string, filePath: string, s: number = 1.0, instructions?: string): Promise<any> {
	const speed = Math.min(Math.max(s, 0.3), 2.0)
	const mp3 = await openai.audio.speech.create({
		//model: "tts-1",
		model: "gpt-4o-mini-tts",
		voice: voices[Math.floor(Math.random() * voices.length)],
		input: text,
		instructions,
		speed
	});
	console.log({
		model: "gpt-4o-mini-tts",
		voice: voices[Math.floor(Math.random() * voices.length)],
		input: text,
		instructions,
		speed
	})
	const buffer = Buffer.from(await mp3.arrayBuffer());
	await fs.promises.writeFile(filePath, buffer);

	//@ts-ignore
	return { filePath, customData: { text, speed: `${speed}` } };
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