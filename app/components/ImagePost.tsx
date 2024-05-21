'use client'

import s from './ImagePost.module.scss'
import cn from 'classnames'
import { Image } from 'react-datocms'
import PublishDate from './PublishDate'
import { useState } from 'react'

export type LayoutProps = {
  data: ImageRecord
}

export default function ImagePost({ data: { id, image, textToVoice, background, colorBackground, _publishedAt } }: LayoutProps) {

  const [open, setOpen] = useState(false)

  return (
    <section
      id={id}
      key={id}
      className={cn(s.image, open && s.open)}
      style={{ backgroundColor: background?.hex }}
      onClick={() => setOpen(!open)}
    >
      {image.responsiveImage &&
        <figure>
          <Image data={image.responsiveImage} />
        </figure>
      }
      {textToVoice}
      <PublishDate date={_publishedAt} />
    </section>
  );
}