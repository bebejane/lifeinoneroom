'use client'

import { useStore } from '@lib/store'
import s from './PublishTimeline.module.scss'
import cn from 'classnames'
import { format } from 'date-fns'
import { useWindowSize } from 'react-use'
import { useEffect, useRef, useState } from 'react'
import { useScrollInfo } from 'next-dato-utils/hooks'

export type Props = {
  posts: (ImageRecord | TextRecord)[]
}

export default function PublishTimeline({ posts }: Props) {

  const [expanded, settings, theme] = useStore(state => [state.expanded, state.settings, state.theme])
  const { width, height } = useWindowSize()
  const [timeline, setTimeline] = useState<{ id: string, y: number, slug: string, date: string, textColor?: string, backgroundColor?: string }[] | null>(null)
  const [active, setActive] = useState<string | null>(null)
  const { scrolledPosition, isScrolling } = useScrollInfo()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!posts) return

    const maxDate = new Date(posts[posts.length - 1]._firstPublishedAt).getTime()
    const minDate = new Date(posts[0]._firstPublishedAt).getTime()
    const range = maxDate - minDate
    const labelHeight = ref.current?.querySelector('a')?.clientHeight ?? 0
    const h = (ref.current?.offsetHeight ?? 0) - labelHeight

    const timeline = posts.map((item) => ({
      id: item.id,
      y: ((new Date(item._firstPublishedAt).getTime() - minDate) / range) * h,
      date: item._firstPublishedAt,
      slug: item.slug,
      textColor: item.__typename === 'TextRecord' ? item.textColor?.hex : undefined,
      backgroundColor: item.__typename === 'TextRecord' ? item.backgroundColor?.hex : undefined
    }))

    setTimeline(timeline)

  }, [width, height, posts])

  useEffect(() => {

    const sections = document.body.querySelectorAll('section');
    let mostVisible = sections[0];
    let ratio = 0;

    sections.forEach((section, i) => {
      const rect = section.getBoundingClientRect();
      const visibleRatio = Math.max(0, Math.min(rect.bottom, height) - Math.max(rect.top, 0)) / height
      if (visibleRatio > ratio) {
        mostVisible = section;
        ratio = visibleRatio;
      }
    });
    setActive(mostVisible.id ?? null);

  }, [height, scrolledPosition, isScrolling])

  useEffect(() => {
    if (!active)
      window.history.replaceState(null, '', `/`)
    else {
      window.history.replaceState(null, '', `/posts/${active}`)
      document.getElementById(active)?.scrollIntoView({ behavior: 'instant', block: 'start' })
    }
  }, [active])

  if (!expanded) return null

  return (
    <nav id="timeline" className={s.timeline} ref={ref}>
      {timeline?.map(({ id, y, slug, date, textColor }, i) => (
        <div
          key={id}
          onClick={(e) => { e.stopPropagation(); setActive(slug); }}
          style={{
            top: `${y}px`,
            color: (settings.colors && settings.theme !== 'dark') ? textColor : 'var(--white)',
            zIndex: i,
          }}>
          <span className={cn(slug === active && s.active)}>
            {format(new Date(date), 'MMM dd yyyy')}
          </span> ■
        </div>
      ))}
    </nav>
  );
}