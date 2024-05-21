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

    const sortedPosts = posts.sort((a, b) => new Date(a._createdAt).getTime() > new Date(b._createdAt).getTime() ? 1 : -1)
    const maxDate = new Date(sortedPosts[sortedPosts.length - 1]._createdAt).getTime()
    const minDate = new Date(sortedPosts[0]._createdAt).getTime()
    const range = maxDate - minDate

    const timeline = posts.map(({ id, _createdAt }) => ({
      id,
      y: ((new Date(_createdAt).getTime() - minDate) / range) * (height - 20),
      date: _createdAt
    }))

    setTimeline(timeline)

  }, [width, height, posts])

  useEffect(() => {

    //if (isScrolling) return

    const sections = document.body.querySelectorAll('section');
    let mostVisible = sections[0];
    let ratio = 0;
    // find most visible section based on scrolledPosition
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const visibleArea = scrolledPosition - rect.bottom
      const visibleRatio = height / visibleArea;
      if (visibleRatio > ratio) {
        mostVisible = section;
        ratio = visibleRatio;
      }
    });
    mostVisible && setActive(mostVisible.id);

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