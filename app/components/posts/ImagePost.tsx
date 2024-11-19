'use client'

import s from './ImagePost.module.scss'
import cn from 'classnames'
import { Image } from 'react-datocms'
import PublishDate from '../PublishDate'
import { useEffect, useState } from 'react'
import { useStore } from '@lib/store'
import AudioPlayer from '../AudioPlayer'

export type Props = {
  data: ImageRecord
  tabIndex: number
}

export default function ImagePost({ data: { id, slug, image, audio, textToVoice, background, colorBackground, _firstPublishedAt }, tabIndex }: Props) {

  const [expanded, settings] = useStore(state => [state.expanded, state.settings])
  const [open, setOpen] = useState(true)
  const [hover, setHover] = useState(false)

  const sectionStyle = (settings.theme !== 'dark' && settings.colors) ? { backgroundColor: colorBackground?.hex } : undefined

  useEffect(() => {
    setOpen(expanded)
  }, [expanded])

  const handleClick = () => {
    !expanded && setOpen(!open)
    const shouldScroll = !expanded && !open
    shouldScroll && setTimeout(() => {
      document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <section
      id={slug}
      key={id}
      className={cn(s.post, open && s.open)}
      style={sectionStyle}
      tabIndex={tabIndex}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleClick}
    >
      {image.responsiveImage &&
        <figure >
          <Image
            data={{ ...image.responsiveImage, alt: textToVoice }}
            pictureClassName={s.image}
            placeholderClassName={s.image}
          />
        </figure>
      }
      <AudioPlayer audio={audio} open={open} show={hover && open} fullMargin={true} />
      <PublishDate date={_firstPublishedAt} align={open ? 'top' : 'center'} />
    </section>
  );
}