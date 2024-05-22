'use client'

import s from './Navbar.module.scss'
import cn from 'classnames'
import { useStore } from '@lib/store'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export type Props = {

}

export default function Navbar({ }: Props) {

  const pathname = usePathname()
  const [setExpanded, expanded] = useStore(state => [state.setExpanded, state.expanded])

  useEffect(() => {
    document.querySelector('main').classList.toggle('compressed', !expanded)
  }, [expanded])

  if (pathname === '/about')
    return null

  return (
    <>
      <button
        className={cn(s.button, s.toggle)}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'Compress' : 'Expand'}
      </button>
      <nav className={s.about}>
        <figure>
          <img aria-label="Enable accessibility" role="button" className={s.settings} src="/images/crip-symbol.svg" />
        </figure>
        <Link href="/about">
          <button role="link" className={s.button}>About</button>
        </Link>
      </nav>
    </>
  );
}