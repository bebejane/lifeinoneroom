import os from 'os';
import dotenv from 'dotenv'; dotenv.config();
import ElevenLabs from 'elevenlabs-node';
import { buildClient, uploadLocalFileAndReturnPath } from '@datocms/cma-client-node';
import { render } from 'datocms-structured-text-to-plain-text';

const client = buildClient({
	apiToken: process.env.DATOCMS_API_TOKEN,
	environment: process.env.DATOCMS_ENVIRONMENT,
});

const voice = new ElevenLabs({
	apiKey: process.env.ELEVENLABS_API_KEY,
	voiceId: 'pNInz6obpgDQGcFmaJgB', // A Voice ID from Elevenlabs
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
	const textInput = type === 'string' ? item[field] : type === 'structured_text' ? render(item[field].value) : null;
	const fileName = `${id}.mp3`;
	const localPath = `${os.tmpdir}/${fileName}`;

	if (!textInput) throw new Error('No text found');

	try {
		const res = await voice.textToSpeech({
			// Required Parameters
			fileName: localPath, // The name of your audio file
			textInput, // The text you wish to convert to speech
			voiceId: '21m00Tcm4TlvDq8ikWAM', // A different Voice ID from the default
			stability: 0.5, // The stability for the converted speech
			similarityBoost: 0.5, // The similarity boost for the converted speech
			modelId: 'eleven_multilingual_v2', // The ElevenLabs Model ID
			style: 1, // The style exaggeration for the converted speech
			speakerBoost: true, // The speaker boost for the converted speech
			withTimestamps: true
		})

		const u = await upload(localPath, fileName, item.audio?.upload_id);
		await client.items.update(id, { audio: { upload_id: u.id } });
		await client.items.publish(id);

	} catch (e) {
		console.error(e);
		throw new Error('Failed to generate audio');
	}
}

async function upload(localPath: string, filename: string, upload_id?: string) {

	console.log('uploading', upload_id)
	console.time('upload')

	const upload = upload_id ?
		await client.uploads.update(upload_id, {
			path: await uploadLocalFileAndReturnPath(client, localPath, { filename })
		})
		:
		await client.uploads.createFromLocalFile({
			localPath,
			filename,
			skipCreationIfAlreadyExists: true,
			id: upload_id
		});
	console.timeEnd('upload')
	return upload;
}