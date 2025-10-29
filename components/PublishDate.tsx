'use client';

import { useStore } from '@/lib/store';
import s from './PublishDate.module.scss';
import cn from 'classnames';
import { format } from 'date-fns';

export type Props = {
	date: string;
	align: 'top' | 'center';
};

export default function PublishDate({ date, align = 'center' }: Props) {
	const [expanded] = useStore((state) => [state.expanded]);

	if (expanded) return null;

	return <div className={cn(s.date, align === 'top' && s.top)}>{format(new Date(date), 'MMM dd yyyy')}</div>;
}
