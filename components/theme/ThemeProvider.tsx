"use client";

import React, { useContext, useEffect } from 'react'
import { ThemeContext, Theme } from "./ThemeContext";

const ThemeProvider = ({ children }) => {

  const { theme } = useContext(ThemeContext) as Theme
  const [mounted, setMounted] = React.useState(false)

  useEffect(() => {
    setMounted(true)
  }, []);

  console.log(theme)

  if (mounted) {
    return <body data-theme={theme}>{children}</body>
  }

  return (
    <body data-theme={theme}>
      {children}
    </body>
  )
}

export default ThemeProvider