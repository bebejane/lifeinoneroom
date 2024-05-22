'use client'
import { useEffect, useRef, useState } from 'react'
import s from './AudioPlayer.module.scss'
import cn from 'classnames'

type Props = {
  audio: FileField
}

export default function AudioPlayer({ audio }: Props) {
  const ref = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  const handleClick = () => {
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

  return (
    <>
      <img
        aria-label="Play button"
        className={cn(s.icon, playing && s.playing)}
        src="/images/sound-symbol.svg"
        alt="Audio player"
        onClick={handleClick}
      />
      <audio className={s.audio} ref={ref} aria-hidden={true}>
        <source src={audio.url} type="audio/mpeg" />
      </audio>
    </>
  )
}