'use client'

import s from './TextPost.module.scss'
import cn from 'classnames'
import Content from '@components/Content';
import { useEffect, useState } from 'react';
import { useStore } from '@lib/store';
import PublishDate from '../PublishDate';
import AudioPlayer from '../AudioPlayer';

export type LayoutProps = {
  data: TextRecord
}

export default function TextPost({ data: { id, title, text, audio, _firstPublishedAt } }: LayoutProps) {
  const [expanded] = useStore(state => [state.expanded])
  const [open, setOpen] = useState(true)

  useEffect(() => {
    setOpen(expanded)
  }, [expanded])

  const handleClick = () => {
    !expanded && setOpen(!open)
    const shouldScroll = !expanded && !open
    shouldScroll && setTimeout(() => {
      document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <section
      id={id}
      key={id}
      className={cn(s.text, open && s.open)}
      onClick={handleClick}
    >
      {open ?
        <Content content={text} />
        :
        <h2>{title}</h2>
      }
      {audio && <AudioPlayer audio={audio} />}
      <PublishDate date={_firstPublishedAt} />
    </section>
  );
}