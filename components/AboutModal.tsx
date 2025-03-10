'use client';

import s from './AboutModal.module.scss';
import cn from 'classnames';
import useStore from '@/lib/store';
import { Content } from '@/components';
import AudioPlayer from './AudioPlayer';
import ReadinglineModal from '@components/ReadinglineModal';

export type Props = {
	about: AboutQuery['about'];
	introduction: AboutQuery['introduction'];
};

export default function AboutModal({ about, introduction }: Props) {
	const [setShowAbout, showAbout, setShowAboutIntro, showAboutIntro, settings] = useStore(
		(state) => [
			state.setShowAbout,
			state.showAbout,
			state.setShowAboutIntro,
			state.showAboutIntro,
			state.settings,
		]
	);
	const mode = showAboutIntro ? 'intro' : 'about';

	const handleClose = () => {
		setShowAbout(false);
		setShowAboutIntro(false);
	};

	const audio = mode === 'about' ? about.audio : introduction.audio;
	const text = mode === 'about' ? about.text : introduction.text;

	if (!showAbout) return null;

	return (
		<div className={cn(s.about, s.modal, s[settings.theme])}>
			<div id='about-modal' className={cn(s.wrap)}>
				<ReadinglineModal />
				<Content content={text} />
				<figure className={s.logos}>
					<img src='/images/logos.png' />
				</figure>
				<nav>
					{audio && (
						<AudioPlayer
							key={mode}
							audio={audio as FileField}
							open={true}
							show={true}
							postId={'about'}
							className={s.audio}
						/>
					)}
					<button className={s.close} onClick={handleClose}>
						Close
					</button>
				</nav>
			</div>
		</div>
	);
}
