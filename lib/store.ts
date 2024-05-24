import { create } from "zustand";
import { shallow } from 'zustand/shallow';

export interface StoreState {
  desktop: boolean,
  showAbout: boolean,
  expanded: boolean,
  open: string[]
  playing: string,
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
  playing: null,
  open: [],
  setOpen: (open: string[]) => {
    set((state) => ({ open }))
  },
  setPlaying: (playing: string) => {
    set((state) => ({ playing }))
  },
  setExpanded: (expanded: boolean) => {
    set((state) => ({ expanded }))
  },
  setShowAbout: (showAbout: boolean) => {
    set((state) => ({ showAbout }))
  },
  setDesktop: (desktop: boolean) => {
    set((state) => ({ desktop }))
  },
}));

export { shallow, useStore };
