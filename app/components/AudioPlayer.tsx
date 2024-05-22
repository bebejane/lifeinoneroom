'use client'
import { useEffect, useRef, useState } from 'react'
import s from './AudioPlayer.module.scss'
import cn from 'classnames'
import { useStore } from '../../lib/store'

type Props = {
  audio: FileField
}

export default function AudioPlayer({ audio }: Props) {

  const [expanded] = useStore((state) => [state.expanded])
  const ref = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    ref.current.paused ? ref.current?.play() : ref.current?.pause()
  }

  useEffect(() => {
    const player = ref.current
    const onEnd = () => setPlaying(false)
    const onPlay = () => setPlaying(true)
    const onPaused = () => setPlaying(false)

    player.addEventListener('ended', onEnd)
    player.addEventListener('play', onPlay)
    player.addEventListener('pause', onPaused)


    return () => {
      player?.removeEventListener('ended', onEnd)
      player?.removeEventListener('play', onPlay)
      player?.removeEventListener('pause', onPaused)
    }
  }, [])

  useEffect(() => {
    if (!playing) return
    document.querySelectorAll('audio').forEach((audio) => {
      if (audio.id !== ref.current.id)
        audio.pause()
    })
  }, [playing])

  return (
    <>
      <img
        aria-label="Play button"
        className={cn(s.icon, playing && s.playing, !expanded && s.compressed)}
        src="/images/sound-symbol.svg"
        alt="Audio player"
        onClick={handleClick}
      />
      <audio id={audio.id} className={s.audio} ref={ref} aria-hidden={true}>
        <source src={audio.url} type="audio/mpeg" />
      </audio>
    </>
  )
}