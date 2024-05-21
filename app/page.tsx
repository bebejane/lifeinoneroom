import { apiQuery } from 'next-dato-utils/api';
import { AllPostsDocument } from '@graphql';
import { DraftMode } from 'next-dato-utils/components';
import ImagePost from './components/posts/ImagePost';
import TextPost from './components/posts/TextPost';
import PublishTimeline from './components/PublishTimeline';

export default async function Home() {

  const { allImages, allTexts, draftUrl } = await apiQuery<AllPostsQuery, AllPostsQueryVariables>(AllPostsDocument, {
    all: true,
    tags: ['image', 'text']
  })

  const allPosts = allImages.concat(allTexts as any).sort((a, b) => a._firstPublishedAt > b._firstPublishedAt ? 1 : -1) as (ImageRecord | TextRecord)[]

  return (
    <>
      {allPosts.map(post => (
        post.__typename === 'ImageRecord' ?
          <ImagePost key={post.id} data={post as ImageRecord} />
          : post.__typename === 'TextRecord' ?
            <TextPost key={post.id} data={post as TextRecord} />
            : null
      ))}
      <PublishTimeline posts={allPosts} />
      <DraftMode url={draftUrl} />
    </>
  )
}