import s from './page.module.scss';
import cn from 'classnames';
import { AboutDocument } from "@graphql";
import { apiQuery, } from "next-dato-utils/api";
import { DraftMode } from "next-dato-utils/components";
import { notFound } from 'next/navigation';
import { Metadata } from "next";
import About from '../components/About';

type Props = {
  modal?: boolean
}

export default async function AboutPage({ modal = false }: Props) {

  const { about, introduction, draftUrl } = await apiQuery<AboutQuery, AboutQueryVariables>(AboutDocument)

  if (!about) return notFound()

  return (
    <>
      <About about={about} modal={modal} introduction={introduction} />
      <DraftMode url={draftUrl} tag={about.id} />
    </>
  );
}

export async function generateMetadata() {

  const { about } = await apiQuery<AboutQuery, AboutQueryVariables>(AboutDocument)

  return {
    title: 'About',
  } as Metadata
}
