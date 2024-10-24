'use client'

import s from './AudioPlayer.module.scss'
import cn from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { useStore } from '@lib/store'
import { IoVolumeHighSharp } from "react-icons/io5";
import { IoVolumeMuteSharp } from "react-icons/io5";




type Props = {
  audio: FileField
  open: boolean
  show: boolean
}

export default function AudioPlayer({ audio, open, show }: Props) {


  const { expanded, theme } = useStore((state) => ({ expanded: state.expanded, theme: state.theme }))
  const ref = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    ref.current.paused ? ref.current?.play() : ref.current?.pause()
  }

  useEffect(() => {
    if (!ref.current) return
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

  if (!audio) return null

  return (
    <>
      <figure
        aria-label="Play"
        className={cn(s.icon, s[theme], playing && s.playing, !expanded && !open && s.compressed, show && s.show)}
        onClick={handleClick}
      >
        {playing ?
          <IoVolumeMuteSharp />
          :
          <IoVolumeHighSharp />
        }
      </figure>
      <audio id={audio.id} className={s.audio} ref={ref} aria-hidden={true}>
        <source src={audio.url} type="audio/mpeg" />
      </audio>
    </>
  )
}