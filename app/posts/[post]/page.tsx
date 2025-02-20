import s from './page.module.scss';
import HomePage from '@app/page';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAllPosts, getPost } from '@lib/posts';

export type Props = {
	params: Promise<{ post: string }>;
};

export default async function PostPage(params: Props) {
	return HomePage(params);
}

export async function generateStaticParams() {
	const { allPosts } = await getAllPosts();
	return allPosts.map(({ slug: post }) => ({ post }));
}

export async function generateMetadata({ params }) {
	const { post } = await getPost((await params).post);

	if (!post) return notFound();

	return {
		title: post.__typename === 'ImageRecord' ? post.textToVoice : '',
	} as Metadata;
}
