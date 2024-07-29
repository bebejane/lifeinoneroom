import { revalidatePath, revalidateTag } from 'next/cache'
import { generate } from '../tts'
import { buildClient } from '@datocms/cma-client-browser'

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function GET(request: Request) {
  return Response.json({ success: false, error: 'Method not allowed' }, { status: 405 })

  console.log('Regenerating all posts')
  const posts = []
  const client = buildClient({ apiToken: process.env.DATOCMS_API_TOKEN })
  const itemTypes = await client.itemTypes.list()

  for await (const record of client.items.listPagedIterator({ filter: { type: 'text,image' } }))
    posts.push(record);

  for (const post of posts) {
    console.log(`${post.slug}`)
    const api_key = itemTypes.find(({ id }) => id === post.item_type.id)?.api_key
    await generate({ ...post }, api_key)
    revalidatePath(`/posts/${post.slug}`)
  }

  revalidatePath('/')

  return Response.json({ success: true })
}
