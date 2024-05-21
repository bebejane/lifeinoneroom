import { revalidate } from 'next-dato-utils/route-handlers';

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {

  return await revalidate(req, async (payload, revalidate) => {

    const { api_key, entity } = payload;
    const { id } = entity
    const paths: string[] = []
    const tags: string[] = [api_key, id].filter(t => t)

    switch (api_key) {
      case 'post': case 'image':
        paths.push(`/`)
        break
      case 'about':
        paths.push(`/`)
        paths.push(`/about`)
        break
      default:
        break
    }

    return await revalidate(paths, tags, true)
  })
}