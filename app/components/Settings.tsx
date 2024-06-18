'use client'

import s from './Settings.module.scss'
import cn from 'classnames'
import { useStore } from '@lib/store'
import { useRouter } from 'next/navigation'

export type Props = {
  show: boolean
}

export default function Settings({ show }: Props) {

  const [setShowAbout, showAbout, setExpanded, expanded] = useStore(state => [state.setShowAbout, state.showAbout, state.setExpanded, state.expanded])
  const router = useRouter()

  return (
    <div className={cn(s.settings, show && s.show)}>
      <h3>Settings</h3>
      <p>
        <input id="setting1" type="checkbox" />
        <label htmlFor="expanded">Setting 1</label>
      </p>
    </div>
  );
}