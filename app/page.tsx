import { DraftMode } from 'next-dato-utils/components';
import ImagePost from './components/posts/ImagePost';
import TextPost from './components/posts/TextPost';
import PublishTimeline from './components/PublishTimeline';
import { getAllPosts } from '@lib/posts';
import Intro from './components/Intro';
import generateRssFeed from '../lib/rss';

export default async function Home() {

  const { allPosts, draftUrl } = await getAllPosts()
  await generateRssFeed();

  return (
    <>
      <Intro />
      {allPosts.map(post => (
        post.__typename === 'ImageRecord' ?
          <ImagePost key={post.id} data={post as ImageRecord} />
          : post.__typename === 'TextRecord' ?
            <TextPost key={post.id} data={post as TextRecord} />
            : null
      ))}
      <PublishTimeline posts={allPosts} />
      <DraftMode url={draftUrl} tag={['image', 'text', 'about']} />
    </>
  )
}