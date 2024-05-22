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
      <button className={cn(s.button, s.toggle)} onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Compress' : 'Expand'}
      </button>
      <div className={s.about}>
        <figure>
          <img className={s.settings} src="/images/crip-symbol.svg"></img>
        </figure>
        <Link href="/about">
          <button className={cn(s.button)}>About</button>
        </Link>
      </div>
    </>
  );
}