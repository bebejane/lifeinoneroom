"use client";


import { createContext, useEffect, useState } from "react";

export type Theme = {
	theme: string
	toggle: () => void
}

export const ThemeContext = createContext({ theme: 'light', toggle: null })

const getFromLocalStorage = (): string => {
	return typeof window !== "undefined" ? localStorage.getItem("theme") ?? 'light' : "light";
}

export const ThemeContextProvider = ({ children }) => {
	const [theme, setTheme] = useState(() => getFromLocalStorage());

	const toggle = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};

	useEffect(() => {
		localStorage.setItem("theme", theme);
	}, [theme]);
	console.log(theme)
	return (
		<ThemeContext.Provider value={{ theme, toggle }}>
			{children}
		</ThemeContext.Provider>
	)
}