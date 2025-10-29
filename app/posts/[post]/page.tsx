import HomePage from '@/app/page';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllPosts, getPost } from '@/lib/posts';

export default async function PostPage(params: { params: Promise<{ post: string }> }) {
	return HomePage(params);
}

export async function generateStaticParams() {
	const { allPosts } = await getAllPosts();
	return allPosts.map(({ slug: post }) => ({ post }));
}

export async function generateMetadata({ params }): Promise<Metadata> {
	const slug = (await params)?.post;
	const { post } = await getPost(slug);

	if (!post) return notFound();

	return {
		title: post.__typename === 'ImageRecord' ? post.textToVoice : '',
	} as Metadata;
}
