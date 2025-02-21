import HomePage from '@app/page';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllPosts, getPost } from '@lib/posts';

export type Props = {
	params: { post: string };
};

export default async function PostPage(params: Props) {
	return HomePage(params);
}

export async function generateStaticParams() {
	const { allPosts } = await getAllPosts();
	return allPosts.map(({ slug: post }) => ({ post }));
}

export async function generateMetadata({ params }) {
	const { post } = await getPost(params.post);

	if (!post) return notFound();

	return {
		title: post.__typename === 'ImageRecord' ? post.textToVoice : '',
	} as Metadata;
}
