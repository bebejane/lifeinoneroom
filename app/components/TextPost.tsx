'use client'

import s from './TextPost.module.scss'
import cn from 'classnames'
import { Content } from '@components';
import { useState } from 'react';

export type LayoutProps = {
  data: TextRecord
}

export default function TextPost({ data: { id, text } }: LayoutProps) {
  const [open, setOpen] = useState(false)

  return (
    <section id={id} key={id} className={cn(s.text, open && s.open)} onClick={() => setOpen(!open)}>
      <Content content={text} />
    </section>
  );
}