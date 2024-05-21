import { generate } from './tts'

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {

  const res = await request.json()
  const { event_type, related_entities, entity } = res
  const api_key = related_entities?.find(({ id }) => id === entity.relationships?.item_type?.data?.id)?.attributes?.api_key

  if (event_type === 'publish')
    await generate({ ...entity.attributes, id: entity.id }, api_key)

  return Response.json({ ok: true })
}