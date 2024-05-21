'use client'

import s from './Navbar.module.scss'
import cn from 'classnames'
import { useStore } from '@lib/store'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type Props = {

}

export default function Navbar({ }: Props) {

  const pathname = usePathname()
  const [setShowAbout, showAbout, setExpanded, expanded] = useStore(state => [state.setShowAbout, state.showAbout, state.setExpanded, state.expanded])

  if (pathname === '/about') return null

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