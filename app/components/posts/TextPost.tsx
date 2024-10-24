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
  const [expanded, settings] = useStore(state => [state.expanded, state.settings])
  const [open, setOpen] = useState(true)
  const [lineStyles, setLineStyles] = useState<{ top: React.CSSProperties, bottom: React.CSSProperties, line: React.CSSProperties } | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setOpen(expanded)
    !expanded && setLineStyles(null)
  }, [expanded])

  const handleClick = () => {
    !expanded && setOpen(!open)
    const shouldScroll = !expanded && !open
    shouldScroll && setTimeout(() => {
      document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!settings.readingline) return

    const { clientY } = e
    const { y, height } = ref.current.getBoundingClientRect()
    const yPercent = (clientY - y) / height * 100
    const lineHeight = '8rem'

    setLineStyles({
      top: { flexBasis: `calc(${yPercent}% - ${lineHeight})` },
      bottom: { flexBasis: `calc(${100 - yPercent}% - ${lineHeight})` },
      line: { flexBasis: `${lineHeight}` }
    })
  }
  const sectionStyle = (theme !== 'dark' && settings.colors) ? { backgroundColor: backgroundColor?.hex, color: textColor?.hex } : undefined

  return (
    <section
      id={id}
      key={id}
      ref={ref}
      className={cn(s.text, open && s.open)}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setLineStyles(null)}
      style={sectionStyle}
    >
      {open ?
        <>
          <h3 className={s.title}>{title}</h3>
          <AudioPlayer audio={audio} open={open} show={lineStyles && open} fullMargin={true} />
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