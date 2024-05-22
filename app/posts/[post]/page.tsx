import s from './page.module.scss';
import cn from 'classnames';
import { DraftMode } from "next-dato-utils/components";
import { notFound } from 'next/navigation';
import { Metadata } from "next";
import ImagePost from '@app/components/posts/ImagePost';
import TextPost from '@app/components/posts/TextPost';
import React from 'react';
import { getAllPosts, getPost } from '@lib/posts';

export type Props = {
  params: { post: string },
  modal: boolean
}

export default async function Post(props: Props) {

  const { post, draftUrl } = await getPost(props.params.post)

  if (!post) return notFound()

  return (
    <>
      <article className={s.post}>
        {post.__typename === 'ImageRecord' && <ImagePost data={post as ImageRecord} />}
        {post.__typename === 'TextRecord' && <TextPost data={post as TextRecord} />}
      </article >
      <DraftMode url={draftUrl} tag={post.id} />
    </>
  );
}

export async function generateStaticParams() {
  const { allPosts } = await getAllPosts()
  return allPosts.map(({ slug: post }) => ({ post }))
}

export async function generateMetadata({ params }) {

  const { post } = await getPost(params.post)

  if (!post) return notFound()

  return {
    title: post.__typename === 'ImageRecord' ? post.textToVoice : '',
  } as Metadata
}
