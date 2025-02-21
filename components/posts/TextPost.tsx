'use client';

import s from './TextPost.module.scss';
import cn from 'classnames';
import Content from '@components/Content';
import { useContext, useEffect, useRef, useState } from 'react';
import { useStore } from '@lib/store';
import PublishDate from '../PublishDate';
import AudioPlayer from '../AudioPlayer';
import { Theme, ThemeContext } from '@components/theme/ThemeContext';

export type LayoutProps = {
	data: TextRecord;
	tabIndex: number;
	postId: string;
};

export default function TextPost({
	data: { id, slug, title, text, audio, textColor, backgroundColor, _firstPublishedAt },
	tabIndex,
	postId,
}: LayoutProps) {
	const { theme } = useContext(ThemeContext) as Theme;
	const [expanded, settings] = useStore((state) => [state.expanded, state.settings]);
	const [open, setOpen] = useState(true);
	const [lineStyles, setLineStyles] = useState<{
		top: React.CSSProperties;
		bottom: React.CSSProperties;
		line: React.CSSProperties;
	} | null>(null);
	const ref = useRef<HTMLDivElement>(null);

	const handleClick = () => {
		!expanded && setOpen(!open);
		!expanded &&
			!open &&
			setTimeout(() => {
				document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}, 100);
	};
	const sectionStyle =
		theme !== 'dark' && settings.colors
			? { backgroundColor: backgroundColor?.hex, color: textColor?.hex }
			: undefined;

	useEffect(() => {
		setOpen(expanded);
		!expanded && setLineStyles(null);
	}, [expanded]);

	return (
		<section
			id={slug}
			key={id}
			ref={ref}
			data-post-type='text'
			className={cn(s.text, open && s.open)}
			onClick={handleClick}
			style={sectionStyle}
		>
			{!open ? (
				<header>
					<h2>
						<span>{title}</span>
					</h2>
				</header>
			) : (
				<>
					<h2 className={s.title}>{title}</h2>
					<div className={s.wrapper}>
						<AudioPlayer audio={audio} open={open} show={open} fullMargin={false} postId={postId} />
						<Content content={text} />
					</div>
				</>
			)}
			<PublishDate date={_firstPublishedAt} align={open ? 'top' : 'center'} />
		</section>
	);
}
