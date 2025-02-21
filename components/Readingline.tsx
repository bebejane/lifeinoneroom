'use client';

import s from './Readingline.module.scss';
import cn from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '@lib/store';
import { usePathname } from 'next/navigation';

export default function Readingline() {
	const pathname = usePathname();
	const [expanded, settings] = useStore((state) => [state.expanded, state.settings]);
	const [lineStyles, setLineStyles] = useState<{
		top: React.CSSProperties;
		bottom: React.CSSProperties;
		line: React.CSSProperties;
	} | null>(null);
	const ref = useRef<HTMLDivElement>(null);
	const clientY = useRef<number>(0);
	const isStartPage = pathname !== '/about';

	const handleMouseMove = useCallback(
		(e?: MouseEvent) => {
			if (!settings.readingline || !isStartPage || !ref.current) return setLineStyles(null);

			clientY.current = e?.clientY ?? clientY.current;

			const { y, height } = ref.current.getBoundingClientRect();
			const yPercent = ((clientY.current - y) / height) * 100;
			const lineHeight = '8rem';

			setLineStyles({
				top: { flexBasis: `calc(${yPercent}% - ${lineHeight})` },
				bottom: { flexBasis: `calc(${100 - yPercent}% - ${lineHeight})` },
				line: { flexBasis: `${lineHeight}` },
			});
		},
		[isStartPage, settings.readingline]
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

	//if (!expanded) return null;

	return (
		<div ref={ref} className={cn(s.readingline, lineStyles && s.show)}>
			<div className={s.top} style={lineStyles?.top} />
			<div className={s.line} style={lineStyles?.line} />
			<div className={s.bottom} style={lineStyles?.bottom} />
		</div>
	);
}
