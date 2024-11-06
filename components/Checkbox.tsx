import { useStore } from '@lib/store';
import s from './Checkbox.module.scss'
import cn from 'classnames'

import { Checkbox, CheckboxProps } from 'react-aria-components';

export default function MyCheckbox({ children, ...props }: CheckboxProps) {

  const { settings } = useStore((state) => ({ settings: state.settings }))

  return (
    <Checkbox {...props} className={cn(s.container, settings.theme === 'dark' && s.dark)}>
      {({ isIndeterminate }) => <>
        <div className={s.checkbox}>
          <svg viewBox="0 0 18 18">
            {isIndeterminate
              ? <rect x={1} y={7.5} width={15} height={3} />
              : <polyline points="3 9 7 14 15 4" />
            }
          </svg>
        </div>
        {children}
      </>}
    </Checkbox>
  );
}