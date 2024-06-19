'use client';

import { useContext } from 'react';
import s from './ThemeToggle.module.scss';
import { ThemeContext } from './ThemeContext';

const ThemeToggle = () => {
  const { toggle, theme } = useContext(ThemeContext)

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