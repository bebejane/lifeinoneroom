'use client';

import s from './Readingline.module.scss';
import cn from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '@/lib/store';
import { usePathname } from 'next/navigation';
import useIsDesktop from '../lib/hooks/useIsDesktop';

export default function Readingline() {
	const pathname = usePathname();
	const [expanded, settings, showAbout] = useStore((state) => [state.expanded, state.settings, state.showAbout]);
	const [lineStyles, setLineStyles] = useState<{
		top: React.CSSProperties;
		bottom: React.CSSProperties;
		line: React.CSSProperties;
	} | null>(null);
	const ref = useRef<HTMLDivElement>(null);
	const clientY = useRef<number>(0);
	const isStartPage = pathname !== '/about';
	const isDesktop = useIsDesktop();

	const handleMouseMove = useCallback(
		(e?: MouseEvent) => {
			if (!settings.readingline || !isStartPage || !ref.current) return setLineStyles(null);

			clientY.current = e?.clientY ?? clientY.current;

			const line = document.querySelector<HTMLDivElement>(`.${s.line}`);
			const { y, height } = ref.current.getBoundingClientRect();
			const yPercent = ((clientY.current - y) / height) * 100;
			const lineHeight = getComputedStyle(line).height;

			setLineStyles({
				top: { flexBasis: isDesktop ? `calc(${yPercent}% - ${lineHeight})` : '10%' },
				line: { flexBasis: `${lineHeight}` },
				bottom: { flexBasis: isDesktop ? `calc(${100 - yPercent}% - ${lineHeight})` : '80%' },
			});
		},
		[isStartPage, isDesktop, settings.readingline]
	);

	useEffect(() => {
		if (!settings.readingline) setLineStyles(null);
		else handleMouseMove();
	}, [settings.readingline, handleMouseMove]);

	useEffect(() => {
		const handleScroll = () => {
			handleMouseMove();
		};
		const handleLeave = () => {
			setLineStyles(null);
		};

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('scroll', handleScroll, { passive: true });
		document.addEventListener('mouseleave', handleLeave);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('scroll', handleScroll);
			document.removeEventListener('mouseleave', handleLeave);
		};
	}, [handleMouseMove]);

	if (showAbout) return null;

	return (
		<div ref={ref} className={cn(s.readingline, lineStyles && s.show)}>
			<div className={s.top} style={lineStyles?.top} />
			<div className={s.line} style={lineStyles?.line} />
			<div className={s.bottom} style={lineStyles?.bottom} />
		</div>
	);
}
