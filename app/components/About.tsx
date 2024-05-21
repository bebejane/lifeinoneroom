'use client'

import s from './About.module.scss'
import cn from 'classnames'
import { useStore } from '@lib/store'
import { Content } from '@components'
import { useRouter } from 'next/navigation'

export type Props = {
  about: AboutQuery['about']
  modal: boolean
}

export default function About({ modal, about }: Props) {

  const [setShowAbout, showAbout, setExpanded, expanded] = useStore(state => [state.setShowAbout, state.showAbout, state.setExpanded, state.expanded])
  const router = useRouter()

  const handleClose = () => {
    router.back()
    setShowAbout(false)
  }

  return (
    <div className={s.about}>
      <Content content={about.text} />
      {modal && <button className={cn(s.close)} onClick={handleClose}>Close</button>}
    </div>
  );
}