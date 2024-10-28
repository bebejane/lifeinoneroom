'use client'

import s from './Readingline.module.scss'
import cn from 'classnames'
import Content from '@components/Content';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useStore } from '@lib/store';
import { Theme, ThemeContext } from '@components/theme/ThemeContext';

export type Props = {

}

export default function Readingline({ }: Props) {

  const [expanded, settings] = useStore(state => [state.expanded, state.settings])
  const [lineStyles, setLineStyles] = useState<{ top: React.CSSProperties, bottom: React.CSSProperties, line: React.CSSProperties } | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const clientY = useRef<number>(0)

  const handleMouseMove = useCallback((e?: MouseEvent) => {

    if (!settings.readingline) return setLineStyles(null)

    clientY.current = e?.clientY ?? clientY.current

    const { y, height } = ref.current.getBoundingClientRect()
    const yPercent = (clientY.current - y) / height * 100
    const lineHeight = '8rem'

    setLineStyles({
      top: { flexBasis: `calc(${yPercent}% - ${lineHeight})` },
      bottom: { flexBasis: `calc(${100 - yPercent}% - ${lineHeight})` },
      line: { flexBasis: `${lineHeight}` }
    })

  }, [settings.readingline])

  useEffect(() => {
    const handleScroll = () => {
      handleMouseMove();
    }
    const handleLeave = () => {
      setLineStyles(null)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('mouseleave', handleLeave)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mouseleave', handleLeave)
    }
  }, [handleMouseMove])

  return (
    <div ref={ref} className={cn(s.readingline, lineStyles && s.show)}>
      <div className={s.top} style={lineStyles?.top} />
      <div className={s.line} style={lineStyles?.line} />
      <div className={s.bottom} style={lineStyles?.bottom} />
    </div>
  );
}