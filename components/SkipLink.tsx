'use client';

import s from './SkipLink.module.scss';

export default function SkipLink() {
	return (
		<div className={s.skiplink}>
			<a href='#main'>Skip to main content</a>
		</div>
	);
}
