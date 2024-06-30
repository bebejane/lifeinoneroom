'use client';

import { useContext, useEffect } from 'react';
import s from './ThemeToggle.module.scss';
import { ThemeContext } from './ThemeContext';
import { useStore } from '@lib/store';
import { set } from 'date-fns';

const ThemeToggle = () => {
  const { toggle, theme } = useContext(ThemeContext)
  const { setTheme } = useStore((state) => ({ setTheme: state.setTheme }))

  useEffect(() => {
    setTheme(theme)
  }, [setTheme, theme])

  return (
    <>
      <input
        type='checkbox'
        id='toggle-theme'
        className={s.toggle}
        checked={theme === 'dark'}
        onChange={toggle}
      />
      <label>Dark theme</label>
    </>
  )
}

export default ThemeToggle