import s from './page.module.scss';
import HomePage from '@app/page';
import { DraftMode } from "next-dato-utils/components";
import { notFound } from 'next/navigation';
import { Metadata } from "next";
import ImagePost from '@app/components/posts/ImagePost';
import TextPost from '@app/components/posts/TextPost';
import React from 'react';
import { getAllPosts, getPost } from '@lib/posts';
import Home from '@app/page';

export type Props = {
  params: { post: string }
}

export default async function PostPage(params: Props) {
  return HomePage(params)
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
