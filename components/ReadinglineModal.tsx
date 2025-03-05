'use client';

import s from './ReadinglineModal.module.scss';
import cn from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '@lib/store';
import { useWindowSize } from 'react-use';
import useIsDesktop from '../lib/hooks/useIsDesktop';
import { he } from 'date-fns/locale';

export default function ReadinglineModal() {
	const [settings] = useStore((state) => [state.settings]);
	const [lineStyles, setLineStyles] = useState<{
		top: React.CSSProperties;
		bottom: React.CSSProperties;
		line: React.CSSProperties;
	} | null>(null);
	const [containeHeight, setContainerHeight] = useState(0);
	const ref = useRef<HTMLDivElement>(null);
	const clientY = useRef<number>(0);
	const isDesktop = useIsDesktop();
	const { width, height } = useWindowSize();

	const handleMouseMove = useCallback(
		(e?: MouseEvent) => {
			if (!settings.readingline || !ref.current) return setLineStyles(null);

			clientY.current = e?.clientY ?? clientY.current;

			const line = document.querySelector<HTMLDivElement>(`.${s.line}`);
			const { y } = ref.current.getBoundingClientRect();
			const lineHeight = getComputedStyle(line).height;
			const yPercent = ((clientY.current - y) / containeHeight) * 100;

			setLineStyles({
				top: { flexBasis: isDesktop ? `calc(${yPercent}% - ${lineHeight})` : '10%' },
				line: { flexBasis: `${lineHeight}` },
				bottom: { flexBasis: isDesktop ? `calc(${100 - yPercent}% - ${lineHeight})` : '80%' },
			});
		},
		[containeHeight, isDesktop, settings.readingline]
	);

	useEffect(() => {
		const aboutModal = document.getElementById('about-modal');
		setContainerHeight(aboutModal.scrollHeight);
	}, [width, height]);

	useEffect(() => {
		if (!settings.readingline) setLineStyles(null);
		else handleMouseMove();
	}, [settings.readingline, handleMouseMove, width, height]);

	useEffect(() => {
		const container = ref.current;
		const handleScroll = () => {
			handleMouseMove();
		};
		const handleLeave = () => {
			setLineStyles(null);
		};

		container.addEventListener('mousemove', handleMouseMove);
		container.addEventListener('scroll', handleScroll, { passive: true });
		container.addEventListener('mouseleave', handleLeave);

		return () => {
			container.removeEventListener('mousemove', handleMouseMove);
			container.removeEventListener('scroll', handleScroll);
			container.removeEventListener('mouseleave', handleLeave);
		};
	}, [handleMouseMove]);

	return (
		<div
			ref={ref}
			className={cn(s.readingline, lineStyles && isDesktop && s.show)}
			style={{ height: containeHeight }}
		>
			<div className={s.top} style={lineStyles?.top} />
			<div className={s.line} style={lineStyles?.line} />
			<div className={s.bottom} style={lineStyles?.bottom} />
		</div>
	);
}
