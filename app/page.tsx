import { DraftMode } from 'next-dato-utils/components';
import ImagePost from './components/posts/ImagePost';
import TextPost from './components/posts/TextPost';
import PublishTimeline from './components/PublishTimeline';
import { getAllPosts } from '@lib/posts';
import Intro from './components/Intro';

export default async function Home() {

  const startIndex = 3;
  const { allPosts, draftUrl } = await getAllPosts()

  return (
    <>
      <Intro />
      {allPosts.map((post, idx) => (
        post.__typename === 'ImageRecord' ?
          <ImagePost key={post.id} data={post as ImageRecord} tabIndex={idx + 1 + startIndex} />
          : post.__typename === 'TextRecord' ?
            <TextPost key={post.id} data={post as TextRecord} tabIndex={idx + 1 + startIndex} />
            : null
      ))}
      <PublishTimeline posts={allPosts} />
      <DraftMode url={draftUrl} tag={['image', 'text', 'about']} />
    </>
  )
}