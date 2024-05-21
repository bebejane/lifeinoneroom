'use client'

import { useStore } from '@lib/store'
import s from './PublishDate.module.scss'
import { format } from 'date-fns'

export type Props = {
  date: string
}

export default function PublishDate({ date }: Props) {

  const [expanded] = useStore(state => [state.expanded])

  if (expanded) return null

  return (
    <div className={s.date}>
      {format(new Date(date), 'MMM dd yyyy')}
    </div>
  );
}