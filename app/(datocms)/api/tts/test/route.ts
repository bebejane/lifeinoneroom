import { createAudioFileFromTextOpenAI } from '../tts';
import os from 'os';
import fs from "fs";
import dotenv from 'dotenv'; dotenv.config();

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(request: Request) {
  //return Response.json({ success: false, error: 'Method not allowed' }, { status: 405 })
  const { searchParams } = new URL(request.url)
  const speed = parseFloat(searchParams.get('s') ?? '1.0')
  const text = searchParams.get('t') ?? 'hello there'
  const instructions = searchParams.get('i') ?? undefined
  const fileName = `temp.mp3`;
  const filePath = `${os.tmpdir}/${fileName}`;
  await createAudioFileFromTextOpenAI(text, filePath, speed, instructions);
  const buffer = fs.readFileSync(filePath);
  return new Response(buffer, { status: 200, headers: { 'Content-Type': 'audio/mpeg' } });
}


