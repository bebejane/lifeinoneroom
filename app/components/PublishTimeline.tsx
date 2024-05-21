'use client'

import { useStore } from '@lib/store'
import s from './PublishTimeline.module.scss'
import { format } from 'date-fns'
import { useWindowSize } from 'react-use'
import { useEffect, useRef, useState } from 'react'
import { useScrollInfo } from 'next-dato-utils/hooks'

export type Props = {
  posts: (ImageRecord | TextRecord)[]
}

export default function PublishTimeline({ posts }: Props) {

  const [expanded] = useStore(state => [state.expanded])
  const { width, height } = useWindowSize()
  const [timeline, setTimeline] = useState<{ id: string, y: number, date: string }[] | null>(null)
  const [active, setActive] = useState<string | null>(null)
  const { scrolledPosition, isScrolling } = useScrollInfo()

  useEffect(() => {
    if (!posts) return

    const sortedPosts = posts.sort((a, b) => new Date(a._firstPublishedAt).getTime() > new Date(b._firstPublishedAt).getTime() ? 1 : -1)
    const maxDate = new Date(sortedPosts[sortedPosts.length - 1]._firstPublishedAt).getTime()
    const minDate = new Date(sortedPosts[0]._firstPublishedAt).getTime()
    const range = maxDate - minDate

    const timeline = posts.map(({ id, _firstPublishedAt }) => ({
      id,
      y: ((new Date(_firstPublishedAt).getTime() - minDate) / range) * (height - 20),
      date: _firstPublishedAt
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

  if (!expanded) return null

  return (
    <nav id="timeline" className={s.timeline}>
      {timeline?.map(({ id, y, date }) => (
        <a key={id} href={`#${id}`} style={{ top: `${y}px` }}>
          {id === active && format(new Date(date), 'MMM dd yyyy')} ·
        </a>
      ))}
    </nav>
  );
}