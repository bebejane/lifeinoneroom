import { create } from "zustand";
import { shallow } from 'zustand/shallow';
import { persist, createJSONStorage } from 'zustand/middleware'

export type Settings = {
  readingline: boolean,
  dyslexic: boolean,
  colors: boolean,
  theme: 'light' | 'dark'
}

const defaultSettings: Settings = {
  readingline: true,
  dyslexic: true,
  colors: true,
  theme: 'dark'
}

export interface StoreState {
  desktop: boolean,
  showAbout: boolean,
  showAboutIntro: boolean,
  expanded: boolean,
  theme: 'light' | 'dark',
  open: string[]
  playing: string,
  settings: Settings
  setSettings: (settings: any) => void
  setTheme: (theme: 'light' | 'dark') => void,
  setOpen: (open: string[]) => void,
  setPlaying: (playing: string) => void,
  setExpanded: (expanded: boolean) => void,
  setShowAbout: (showAbout: boolean) => void,
  setShowAboutIntro: (showAboutIntro: boolean) => void,
  setDesktop: (desktop: boolean) => void
}

const useStore = create(persist<StoreState>((set, get) => ({
  desktop: false,
  showAbout: false,
  showAboutIntro: false,
  expanded: true,
  theme: 'dark',
  playing: null,
  open: [],
  settings: defaultSettings,
  setSettings: (settings) => {
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
  setShowAboutIntro: (showAboutIntro: boolean) => {
    set((state) => ({ showAboutIntro }))
  },
  setDesktop: (desktop: boolean) => {
    set((state) => ({ desktop }))
  },
}), {
  name: 'lifeinoneroom',
  storage: createJSONStorage(() => localStorage)
}));

export { shallow, useStore };
export default useStore
