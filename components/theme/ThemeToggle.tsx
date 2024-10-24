'use client';

import { useContext, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';
import { useStore } from '@lib/store';
import Checkbox from '@app/components/Checkbox';

const ThemeToggle = () => {
  const { toggle, theme } = useContext(ThemeContext)
  const { setTheme } = useStore((state) => ({ setTheme: state.setTheme }))

  useEffect(() => {
    setTheme(theme as 'light' | 'dark')
  }, [setTheme, theme])

  return (
    <Checkbox defaultSelected={theme === 'light'} id="toggle-theme" onChange={toggle}>
      Light theme
    </Checkbox>
  )
}

export default ThemeToggle