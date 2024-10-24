'use client'

import s from './Settings.module.scss'
import cn from 'classnames'
import { useStore } from '@lib/store'
import ThemeToggle from '@components/theme/ThemeToggle'
import { useEffect, useRef } from 'react'
import Checkbox from './Checkbox';

export type Props = {
  show: boolean
}

export default function Settings({ show }: Props) {

  const ref = useRef<HTMLDivElement>(null)
  const [settings, setSettings] = useStore(state => [state.settings, state.setSettings])

  useEffect(() => {
    const body = document.body
    body.classList.toggle('dyslexic', settings.dyslexic)
  }, [settings])

  const updateSettings = (key: string, value) => setSettings({ ...settings, [key]: value })

  return (
    <div className={cn(s.settings, show && s.show)} ref={ref}>
      <div>
        <Checkbox defaultSelected={true} id="readingline" onChange={(isSelected) => updateSettings('readingline', isSelected)}>
          Reading line
        </Checkbox>
        <Checkbox defaultSelected={true} id="dyslexic" onChange={(isSelected) => updateSettings('dyslexic', isSelected)}>
          Dyslexic typeface
        </Checkbox>
        <Checkbox defaultSelected={true} id="color" onChange={(isSelected) => updateSettings('colors', isSelected)}>
          Colors
        </Checkbox>
        <ThemeToggle />

      </div>
    </div>
  );
}