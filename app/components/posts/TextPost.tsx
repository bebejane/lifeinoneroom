'use client'

import s from './TextPost.module.scss'
import cn from 'classnames'
import Content from '@components/Content';
import { useContext, useEffect, useRef, useState } from 'react';
import { useStore } from '@lib/store';
import PublishDate from '../PublishDate';
import AudioPlayer from '../AudioPlayer';
import { Theme, ThemeContext } from '@components/theme/ThemeContext';

export type LayoutProps = {
  data: TextRecord
}

export default function TextPost({ data: { id, title, text, audio, textColor, backgroundColor, _firstPublishedAt } }: LayoutProps) {

  const { theme } = useContext(ThemeContext) as Theme
  const [expanded] = useStore(state => [state.expanded])
  const [open, setOpen] = useState(true)
  const [lineStyles, setLineStyles] = useState<React.CSSProperties | null>(null)
  const ref = useRef<HTMLDivElement>(null)

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
    const { clientY } = e
    const { y, height } = ref.current.getBoundingClientRect()
    const yPercent = (clientY - y) / height * 100
    setLineStyles({ height: (100 - yPercent) + '%' })
  }

  return (
    <section
      id={id}
      key={id}
      ref={ref}
      className={cn(s.text, open && s.open)}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setLineStyles(null)}
      style={theme !== 'dark' ? { backgroundColor: backgroundColor?.hex, color: textColor?.hex } : undefined}
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