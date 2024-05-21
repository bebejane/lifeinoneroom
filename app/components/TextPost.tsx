'use client'

import s from './TextPost.module.scss'
import cn from 'classnames'
import { Content } from '@components';
import { useEffect, useState } from 'react';
import { useStore } from '../../lib/store';

export type LayoutProps = {
  data: TextRecord
}

export default function TextPost({ data: { id, text } }: LayoutProps) {
  const [expanded] = useStore(state => [state.expanded])
  const [open, setOpen] = useState(true)

  useEffect(() => {
    setOpen(expanded)
  }, [expanded])

  return (
    <section
      id={id}
      key={id}
      className={cn(s.text, open && s.open)}
      onClick={() => !expanded && setOpen(!open)}
    >
      <Content content={text} />
    </section>
  );
}