'use client';

import s from './Navbar.module.scss';
import cn from 'classnames';
import { useStore } from '@lib/store';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { IoAccessibility } from 'react-icons/io5';
import Settings from './Settings';

export default function Navbar() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [setExpanded, expanded, theme, setShowAbout] = useStore((state) => [
		state.setExpanded,
		state.expanded,
		state.theme,
		state.setShowAbout,
	]);
	const [showSettings, setShowSettings] = useState(false);

	useEffect(() => {
		document.querySelector('main').classList.toggle('compressed', !expanded);
	}, [expanded]);

	const handleClick = () => setExpanded(!expanded);
	const handleSettingsClosed = useCallback(() => setShowSettings(false), [setShowSettings]);

	const modal = {
		open: pathname.startsWith('/about'),
		intro: searchParams.get('intro') === '1',
	};

	return (
		<>
			<nav className={cn(s.navbar, s[theme])}>
				<button
					tabIndex={1}
					data-selected={showSettings}
					data-button-type='icon'
					data-theme={theme}
					className={cn(s.accessibility, showSettings && s.active)}
					onClick={(e) => setShowSettings(!showSettings)}
				>
					<IoAccessibility
						className={s.settings}
						aria-label='Accessibility settings'
						role='button'
					/>
				</button>
				<button
					data-selected={modal.open}
					className={`button ${s.button}`}
					tabIndex={2}
					onClick={() => setShowAbout(true)}
				>
					About
				</button>
				{modal.open && (
					<button data-selected={modal.intro} className={`button ${s.button}`} tabIndex={2}>
						Introduction
					</button>
				)}
			</nav>
			<button className={cn(s.button, s.toggle)} onClick={handleClick} tabIndex={3}>
				{expanded ? 'Compress' : 'Expand'}
			</button>
			<Settings show={showSettings} onClose={handleSettingsClosed} />
		</>
	);
}
