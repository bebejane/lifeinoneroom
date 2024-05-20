'use client'

import s from './PublishDate.module.scss'
import { format } from 'date-fns'

export type Props = {
  date: string
}

export default function PublishDate({ date }: Props) {

  return (
    <div className={s.date}>
      {format(new Date(date), 'MMM dd yyyy')}
    </div>
  );
}