'use client'

import s from './Navbar.module.scss'
import cn from 'classnames'
import { useStore } from '@lib/store'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { IoAccessibility } from "react-icons/io5";
import Settings from './Settings'

export default function Navbar() {

  const pathname = usePathname()
  const [setExpanded, expanded, theme] = useStore(state => [state.setExpanded, state.expanded, state.theme])
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    document.querySelector('main').classList.toggle('compressed', !expanded)
  }, [expanded])

  const handleClick = () => setExpanded(!expanded)
  const handleSettingsClosed = useCallback(() => setShowSettings(false), [setShowSettings])

  if (pathname === '/about') return null

  return (
    <>
      <nav className={cn(s.navbar, s[theme])}>
        <button
          tabIndex={1}
          data-selected={showSettings}
          className={cn(s.accessibility, showSettings && s.active, s[theme])}
          onClick={(e) => setShowSettings(!showSettings)}
        >
          <IoAccessibility
            className={s.settings}
            aria-label="Accessibility settings"
            role="button"
          />
        </button>
        <Link href="/about" prefetch={true} className={`button ${s.button}`} tabIndex={2}>
          About
        </Link>
      </nav>
      <button className={cn(s.button, s.toggle)} onClick={handleClick} tabIndex={3}>
        {expanded ? 'Compress' : 'Expand'}
      </button>
      <Settings show={showSettings} onClose={handleSettingsClosed} />
    </>
  );
}