'use client'

import s from './Settings.module.scss'
import cn from 'classnames'
import { useStore } from '@lib/store'
import { useEffect, useRef, useState } from 'react'
import Checkbox from '@components/Checkbox';
import { Form } from 'react-aria-components';
import { useClickAway } from 'react-use'
import { useScrollInfo } from 'next-dato-utils/hooks'

export type Props = {
  show: boolean
  onClose: () => void
}

const options = [{
  id: 'readingline',
  label: 'Horizon'
},
{
  id: 'dyslexic',
  label: 'Fog'
},
{
  id: 'colors',
  label: 'Rainbow'
},
{
  id: 'theme',
  label: 'Night'
}
]

export default function Settings({ show, onClose }: Props) {

  const ref = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [settings, setSettings] = useStore(state => [state.settings, state.setSettings])
  const { isScrolling } = useScrollInfo()

  useEffect(() => {
    onClose()
  }, [isScrolling, onClose])

  const updateSettings = (key: string, value: string | boolean) => setSettings({ ...settings, [key]: value })

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('dyslexic', settings.dyslexic)
  }, [settings.dyslexic])


  if (!isMounted) return null

  return (
    <>
      <div className={cn(s.settings, show && s.show)} ref={ref}>
        <Form >
          {options.map(({ id, label }, idx) => {
            return (
              <Checkbox
                id={id}
                key={idx}
                onChange={(isSelected) => updateSettings(id, id === 'theme' ? isSelected ? 'dark' : 'light' : isSelected)}
                isSelected={id === 'theme' ? settings.theme === 'dark' : settings[id]}
              >
                {label}
              </Checkbox>
            )
          })}
        </Form>
      </div>
      {show && <div className={s.backdrop} onClick={() => onClose()} />}
    </>
  );
}