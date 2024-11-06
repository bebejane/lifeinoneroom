"use client";


import { createContext, useEffect, useState } from "react";
import { useStore } from '@lib/store';

export type Theme = {
	theme: 'light' | 'dark'
	toggle: () => void | null
}

export const ThemeContext = createContext({ theme: 'light', toggle: null })

const getFromLocalStorage = (): string => {
	return typeof window !== "undefined" ? localStorage.getItem("theme") ?? 'dark' : "light";
}

export const ThemeContextProvider = ({ children }) => {
	const [settings, setSettings] = useStore(state => [state.settings, state.setSettings])

	const toggle = () => {
		setSettings({ ...settings, theme: settings.theme === "light" ? "dark" : "light" });
	};

	return (
		<ThemeContext.Provider value={{ theme: settings.theme, toggle }}>
			{children}
		</ThemeContext.Provider>
	)
}