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
  const [lineStyles, setLineStyles] = useState<React.CSSProperties | null>(null)

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget as HTMLDivElement
    const height = ((window.scrollY + e.clientY) - target.offsetTop) / target.offsetTop
    setLineStyles({ height: `${(1 - height) * 100}%` })
  }

  return (
    <section
      id={'post-' + id}
      key={id}
      className={cn(s.text, open && s.open)}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setLineStyles(null)}
    >
      {open ?
        <>
          <Content content={text} />
          <div className={cn(s.line, lineStyles && s.show)}>
            <div style={lineStyles} />
          </div>
        </>
        :
        <h2>{title}</h2>
      }
      <AudioPlayer audio={audio} open={open} />
      <PublishDate date={_firstPublishedAt} />
    </section>
  );
}