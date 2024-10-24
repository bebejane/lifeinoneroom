'use client'

import { useEffect, useState } from 'react'
import s from './Intro.module.scss'
import cn from 'classnames'

export default function Intro() {

  const [hide, setHide] = useState(false)

  useEffect(() => {
    const to = setTimeout(() => setHide(true), 2000)
    return () => clearTimeout(to)
  }, [])

  return (
    <div id="intro" className={cn(s.intro, hide && s.hide)}>
      <span>Life</span>
      <span>In</span>
      <span>One</span>
      <span>Room</span>
    </div>
  )
}
