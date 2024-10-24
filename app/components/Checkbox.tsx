import { useStore } from '../../lib/store';
import s from './Checkbox.module.scss'
import cn from 'classnames'

import { Checkbox, CheckboxProps } from 'react-aria-components';

export default function MyCheckbox({ children, ...props }: CheckboxProps) {

  const { expanded, theme } = useStore((state) => ({ expanded: state.expanded, theme: state.theme }))

  return (
    <Checkbox {...props} className={cn(s.container, theme === 'dark' && s.dark)}>
      {({ isIndeterminate }) => <>
        <div className={s.checkbox}>
          <svg viewBox="0 0 18 18" aria-hidden="true">
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