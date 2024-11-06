'use client'

import s from './Settings.module.scss'
import cn from 'classnames'
import { useStore } from '@lib/store'
import { useEffect, useRef } from 'react'
import Checkbox from './Checkbox';
import { Form } from 'react-aria-components';

export type Props = {
  show: boolean
}

const options = [{
  id: 'readingline',
  label: 'Reading line'
},
{
  id: 'dyslexic',
  label: 'Dyslexic typeface'
},
{
  id: 'colors',
  label: 'Colors'
},
{
  id: 'theme',
  label: 'Dark theme'
}
]

export default function Settings({ show }: Props) {

  const ref = useRef<HTMLDivElement>(null)
  const [settings, setSettings] = useStore(state => [state.settings, state.setSettings])
  const updateSettings = (key: string, value: string | boolean) => setSettings({ ...settings, [key]: value })

  useEffect(() => {
    document.body.classList.toggle('dyslexic', settings.dyslexic)
  }, [settings.dyslexic])

  return (
    <div className={cn(s.settings, show && s.show)} ref={ref} >
      <Form>
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
  );
}