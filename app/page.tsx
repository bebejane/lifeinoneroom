import { DraftMode } from 'next-dato-utils/components';
import ImagePost from '@/components/posts/ImagePost';
import TextPost from '@/components/posts/TextPost';
import PublishTimeline from '@/components/PublishTimeline';
import { getAllPosts } from '@lib/posts';
import Intro from '@/components/Intro';

export type Props = {
	params: { post: string };
};

export default async function Home({ params }: Props) {
	const startIndex = 3;
	const { allPosts, draftUrl } = await getAllPosts();

	return (
		<>
			<h1 style={{ position: 'absolute', top: '-100px', left: '-100px', zIndex: -1 }}>
				Life In One Room
			</h1>
			<Intro />
			{allPosts.map((post, idx) =>
				post.__typename === 'ImageRecord' ? (
					<ImagePost
						key={post.id}
						data={post as ImageRecord}
						tabIndex={idx + 1 + startIndex}
						postId={post.id}
					/>
				) : post.__typename === 'TextRecord' ? (
					<TextPost
						key={post.id}
						data={post as TextRecord}
						tabIndex={idx + 1 + startIndex}
						postId={post.id}
					/>
				) : null
			)}
			<PublishTimeline posts={allPosts} selected={params?.post} />
			<DraftMode url={draftUrl} tag={['image', 'text', 'about']} />
		</>
	);
}
