'use client'

import s from './About.module.scss'
import cn from 'classnames'
import { useStore } from '@lib/store'
import Content from '@components/Content'
import { useRouter } from 'next/navigation'

export type Props = {
  about: AboutQuery['about']
  modal: boolean
}

export default function About({ modal, about }: Props) {

  const [setShowAbout] = useStore(state => [state.setShowAbout])
  const router = useRouter()

  const handleClose = () => {
    router.back()
    setShowAbout(false)
  }

  return (
    <article className={s.about}>
      <Content content={about.text} />
      {modal &&
        <button className={s.close} onClick={handleClose}>Close</button>
      }
    </article>
  );
}