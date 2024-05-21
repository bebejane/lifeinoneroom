import s from './page.module.scss';
import cn from 'classnames'
import AboutPage from '@app/about/page';
import { Suspense } from 'react';

export default function AboutModalPage() {

  return (
    <div id="modal" className={cn(s.modal, s.show)}>
      <Suspense fallback={<div className={s.loading}></div>}>
        <AboutPage modal={true} />
      </Suspense>
    </div>
  )
}
