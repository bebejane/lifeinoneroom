import { DatoCmsConfig, getUploadReferenceRoutes, getItemReferenceRoutes } from 'next-dato-utils/config';
import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';

export default {
	routes: {
		image: async ({ slug }) => [`/posts/${slug}`, '/'],
		text: async ({ slug }) => [`/posts/${slug}`, '/'],
		about: async () => ['/'],
		introduction: async () => ['/'],
		upload: async (record) => getUploadReferenceRoutes(record),
	},
	sitemap: async () => {
		const { allPosts } = await getAllPosts();

		return [
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
			},
		].concat(
			allPosts.map(({ slug }) => ({
				url: `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${slug}`,
				lastModified: new Date(),
				changeFrequency: 'weekly',
				priority: 1,
			}))
		) as MetadataRoute.Sitemap;
	},
	manifest: async () => {
		return {
			name: 'Life in one room',
			short_name: 'Life in one room',
			description: 'Life in one room',
			start_url: '/',
			display: 'standalone',
			background_color: '#ffffff',
			theme_color: '#000000',
			icons: [
				{
					src: '/favicon.ico',
					sizes: 'any',
					type: 'image/x-icon',
				},
			],
		} satisfies MetadataRoute.Manifest;
	},
	robots: async () => {
		return {
			rules: {
				userAgent: '*',
				allow: '/',
			},
		};
	},
} satisfies DatoCmsConfig;
