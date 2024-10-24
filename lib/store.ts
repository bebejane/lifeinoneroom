import { create } from "zustand";
import { shallow } from 'zustand/shallow';

const defaultSettings = {
  readingline: true,
  dyslexic: true,
  colors: true
}

export interface StoreState {
  desktop: boolean,
  showAbout: boolean,
  expanded: boolean,
  theme: 'light' | 'dark',
  open: string[]
  playing: string,
  settings: any
  setSettings: (settings: any) => void
  setTheme: (theme: 'light' | 'dark') => void,
  setOpen: (open: string[]) => void,
  setPlaying: (playing: string) => void,
  setExpanded: (expanded: boolean) => void,
  setShowAbout: (showAbout: boolean) => void,
  setDesktop: (desktop: boolean) => void
}

const useStore = create<StoreState>((set) => ({
  desktop: false,
  showAbout: false,
  expanded: true,
  theme: 'light',
  playing: null,
  open: [],
  settings: typeof window === 'undefined' ? defaultSettings : localStorage?.getItem('settings') ? JSON.parse(localStorage?.getItem('settings')) : defaultSettings,
  setSettings: (settings) => {
    localStorage.setItem('settings', JSON.stringify(settings))
    set((state) => ({ settings }))
  },
  setOpen: (open: string[]) => {
    set((state) => ({ open }))
  },
  setPlaying: (playing: string) => {
    set((state) => ({ playing }))
  },
  setExpanded: (expanded: boolean) => {
    set((state) => ({ expanded }))
  },
  setTheme: (theme: 'light' | 'dark') => {
    set((state) => ({ theme }))
  },
  setShowAbout: (showAbout: boolean) => {
    set((state) => ({ showAbout }))
  },
  setDesktop: (desktop: boolean) => {
    set((state) => ({ desktop }))
  },
}));

export { shallow, useStore };
