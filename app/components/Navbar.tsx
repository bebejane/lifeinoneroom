'use client'

import s from './Navbar.module.scss'
import cn from 'classnames'
import { useStore } from '@lib/store'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Settings from './Settings'

export type Props = {

}

export default function Navbar({ }: Props) {

  const pathname = usePathname()
  const [setExpanded, expanded] = useStore(state => [state.setExpanded, state.expanded])
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    document.querySelector('main').classList.toggle('compressed', !expanded)
  }, [expanded])

  if (pathname === '/about')
    return null

  const handleClick = () => {
    setExpanded(!expanded)
  }

  return (
    <>
      <button className={cn(s.button, s.toggle)} onClick={handleClick}>
        {expanded ? 'Compress' : 'Expand'}
      </button>
      <nav className={s.about}>
        <figure className={cn(showSettings && s.active)}>
          <img
            src="/images/crip-symbol.svg"
            className={s.settings}
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Enable accessibility"
            role="button"
          />
        </figure>
        <Link href="/about" prefetch={true}>
          <button role="link" className={s.button}>About</button>
        </Link>
      </nav>
      <Settings show={showSettings} />
    </>
  );
}