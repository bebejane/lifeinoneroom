'use client';

import s from './Navbar.module.scss';
import cn from 'classnames';
import { useStore } from '@lib/store';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { IoAccessibility } from 'react-icons/io5';
import Settings from './Settings';

export default function Navbar() {
	const [showSettings, setShowSettings] = useState(false);
	const [setExpanded, expanded, theme, setShowAbout, showAbout, setShowAboutIntro, showAboutIntro] =
		useStore((state) => [
			state.setExpanded,
			state.expanded,
			state.theme,
			state.setShowAbout,
			state.showAbout,
			state.setShowAboutIntro,
			state.showAboutIntro,
		]);

	useEffect(() => {
		document.querySelector('main').classList.toggle('compressed', !expanded);
	}, [expanded]);

	const handleClick = () => setExpanded(!expanded);
	const handleSettingsClosed = useCallback(() => setShowSettings(false), [setShowSettings]);

	return (
		<>
			<nav className={cn(s.navbar, s[theme])}>
				<button
					aria-label='Accessibility settings'
					data-selected={showSettings}
					data-button-type='icon'
					data-theme={theme}
					className={cn(s.accessibility, showSettings && s.active)}
					onClick={(e) => setShowSettings(!showSettings)}
				>
					<IoAccessibility className={s.settings} />
				</button>
				<button
					data-selected={showAbout && !showAboutIntro}
					className={`button ${s.button}`}
					onClick={() => {
						setShowAbout(true);
						setShowAboutIntro(false);
					}}
				>
					About
				</button>
				{showAbout && (
					<button
						data-selected={showAboutIntro}
						className={`button ${s.button} ${s.intro}`}
						onClick={() => {
							setShowAboutIntro(true);
						}}
					>
						Introduction
					</button>
				)}
			</nav>
			<button className={cn(s.button, s.toggle)} onClick={handleClick}>
				{expanded ? 'Compress' : 'Expand'}
			</button>
			<Settings show={showSettings} onClose={handleSettingsClosed} />
			{showAbout && <div className={s.backdrop} />}
		</>
	);
}
