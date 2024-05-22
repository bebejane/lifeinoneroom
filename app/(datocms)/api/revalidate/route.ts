import { revalidate } from 'next-dato-utils/route-handlers';
import { buildRoute } from '@lib/routes';

export const runtime = "edge"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {

  return await revalidate(req, async (payload, revalidate) => {

    const { api_key, entity } = payload;
    const { id } = entity
    const paths: string[] = []
    const tags: string[] = [api_key, id].filter(t => t)
    const routes = await buildRoute(api_key, entity.attributes)
    if (routes)
      paths.push(...routes)

    return await revalidate(paths, tags, true)
  })
}