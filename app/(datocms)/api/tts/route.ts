import { revalidatePath, revalidateTag } from 'next/cache'
import { generate } from './tts'

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function POST(request: Request) {

  const res = await request.json()
  const { event_type, related_entities, entity } = res
  const api_key = related_entities?.find(({ id }) => id === entity.relationships?.item_type?.data?.id)?.attributes?.api_key

  if (event_type === 'publish') {
    try {
      await generate({ ...entity.attributes, id: entity.id }, api_key)
      revalidatePath('/')
      revalidatePath(`/posts/${entity.attributes.slug}`)
      revalidateTag(entity.id)
    } catch (e) {
      return Response.json({ success: false, error: e.message })
    }
  }

  return Response.json({ success: true })
}