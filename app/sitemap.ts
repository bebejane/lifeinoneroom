import { MetadataRoute } from 'next'
import { getAllPosts } from '@lib/posts';

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  },
  {
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/about`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1,
  }
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const { allPosts } = await getAllPosts()

  return staticRoutes.concat(allPosts.map(({ slug }) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  })))
}