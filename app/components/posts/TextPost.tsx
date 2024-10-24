'use client'

import s from './TextPost.module.scss'
import cn from 'classnames'
import Content from '@components/Content';
import { use, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useStore } from '@lib/store';
import PublishDate from '../PublishDate';
import AudioPlayer from '../AudioPlayer';
import { Theme, ThemeContext } from '@components/theme/ThemeContext';
import { useScrollInfo } from 'next-dato-utils/hooks';

export type LayoutProps = {
  data: TextRecord
}

export default function TextPost({ data: { id, title, text, audio, textColor, backgroundColor, _firstPublishedAt } }: LayoutProps) {

  const { theme } = useContext(ThemeContext) as Theme
  const [expanded, settings] = useStore(state => [state.expanded, state.settings])
  const [open, setOpen] = useState(true)
  const [lineStyles, setLineStyles] = useState<{ top: React.CSSProperties, bottom: React.CSSProperties, line: React.CSSProperties } | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const clientY = useRef<number>(0)

  const handleClick = () => {
    !expanded && setOpen(!open)
    !expanded && !open && setTimeout(() => {
      document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handleMouseMove = useCallback((e?: React.MouseEvent<HTMLDivElement>) => {

    if (!settings.readingline) return

    clientY.current = e?.clientY ?? clientY.current
    const { y, height } = ref.current.getBoundingClientRect()
    const yPercent = (clientY.current - y) / height * 100
    const lineHeight = '8rem'

    setLineStyles({
      top: { flexBasis: `calc(${yPercent}% - ${lineHeight})` },
      bottom: { flexBasis: `calc(${100 - yPercent}% - ${lineHeight})` },
      line: { flexBasis: `${lineHeight}` }
    })
  }, [settings.readingline])

  const sectionStyle = (theme !== 'dark' && settings.colors) ? { backgroundColor: backgroundColor?.hex, color: textColor?.hex } : undefined

  useEffect(() => {
    setOpen(expanded)
    !expanded && setLineStyles(null)
  }, [expanded])

  useEffect(() => {
    const handleScroll = () => handleMouseMove()
    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [handleMouseMove])

  return (
    <section
      id={id}
      key={id}
      ref={ref}
      className={cn(s.text, open && s.open)}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onScroll={handleMouseMove}
      onMouseLeave={() => setLineStyles(null)}
      style={sectionStyle}
    >
      {open ?
        <>
          <h3 className={s.title}>{title}</h3>
          <AudioPlayer audio={audio} open={open} show={lineStyles && open} fullMargin={false} />
          <Content content={text} />
          {lineStyles &&
            <div className={cn(s.readingline, lineStyles && s.show)}>
              <div className={s.top} style={lineStyles?.top} />
              <div className={s.line} style={lineStyles?.line} />
              <div className={s.bottom} style={lineStyles?.bottom} />
            </div>
          }
        </>
        :
        <h2>{title}</h2>
      }
      <PublishDate date={_firstPublishedAt} />
    </section>
  );
}