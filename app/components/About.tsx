'use client'

import s from './About.module.scss'
import cn from 'classnames'
import { useStore } from '@lib/store'
import Content from '@components/Content'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import AudioPlayer from './AudioPlayer'

export type Props = {
  about: AboutQuery['about']
  introduction: AboutQuery['introduction']
  modal: boolean
}

export default function About({ modal, about, introduction }: Props) {

  const [setShowAbout] = useStore(state => [state.setShowAbout])
  const [mode, setMode] = useState<'about' | 'intro'>('about')
  const router = useRouter()

  const handleClose = () => {
    router.back()
    setShowAbout(false)
  }

  const audio = mode === 'about' ? about.audio : introduction.audio
  const text = mode === 'about' ? about.text : introduction.text

  return (
    <article className={s.about}>
      {modal &&
        <nav className={s.nav}>
          <button data-selected={mode === 'about'} onClick={() => setMode('about')}>About</button>
          <button data-selected={mode === 'intro'} onClick={() => setMode('intro')}>Introduction</button>
        </nav>
      }
      <Content content={text} />
      {modal &&
        <button className={s.close} onClick={handleClose}>Close</button>
      }
      {audio &&
        <AudioPlayer audio={audio as FileField} open={true} show={true} className={s.audio} />
      }
    </article>
  );
}