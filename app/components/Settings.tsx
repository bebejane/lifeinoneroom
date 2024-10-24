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

    const container = ref.current

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLInputElement
      const id = target.id
      console.log(id, target.checked)
      setSettings((settings: any) => ({ ...settings, [id]: target.checked }))
    }

    container.querySelectorAll('input[type=checkbox]').forEach((checkbox) => {
      console.log(checkbox)
      checkbox.addEventListener('click', handleClick)
    })

    return () => {
      container.querySelectorAll('input[type=checkbox]').forEach((checkbox) => {
        checkbox.removeEventListener('click', handleClick)
      })
    }
  }, [setSettings])

  useEffect(() => {
    const body = document.body
    body.classList.toggle('dyslexic', settings.dyslexic)
  }, [settings])

  const updateSettings = (key: string, value) => {
    setSettings({ ...settings, [key]: value })
  }

  return (
    <div className={cn(s.settings, show && s.show)} ref={ref}>
      <div>
        <ThemeToggle />
        <Checkbox defaultSelected={true} id="readingline" onChange={(isSelected) => updateSettings('readingline', isSelected)}>
          Reading line
        </Checkbox>
        <Checkbox defaultSelected={true} id="dyslexic" onChange={(isSelected) => updateSettings('dyslexic', isSelected)}>
          Dyslexic typeface
        </Checkbox>
      </div>
    </div>
  );
}