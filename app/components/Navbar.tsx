'use client'

import s from './Navbar.module.scss'
import cn from 'classnames'
import { useStore } from '@lib/store'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { IoAccessibility } from "react-icons/io5";
import Settings from './Settings'

export default function Navbar() {

  const pathname = usePathname()
  const [setExpanded, expanded, theme] = useStore(state => [state.setExpanded, state.expanded, state.theme])
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    document.querySelector('main').classList.toggle('compressed', !expanded)
  }, [expanded])

  if (pathname === '/about')
    return null

  const handleClick = () => setExpanded(!expanded)

  return (
    <>
      <button className={cn(s.button, s.toggle)} onClick={handleClick}>
        {expanded ? 'Compress' : 'Expand'}
      </button>
      <nav className={cn(s.navbar, s[theme])}>
        <button className={cn(s.accessibility, showSettings && s.active, s[theme])} onClick={() => setShowSettings(!showSettings)}>
          <IoAccessibility
            className={s.settings}
            aria-label="Enable accessibility"
            role="button"
          />
        </button>
        <Link href="/about" prefetch={true}>
          <button role="link" className={s.button}>About</button>
        </Link>
      </nav>
      <Settings show={showSettings} />
    </>
  );
}