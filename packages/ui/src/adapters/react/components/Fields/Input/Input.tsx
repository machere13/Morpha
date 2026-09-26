import { inputPresentation } from '#presentation/Fields/Input/inputPresentation.ts';
import type { ComponentPropsWithRef } from 'react';
import { InputAdapter } from '@dreadnought/react/unstyled';
import { Icon } from '../../DataDisplay/Icon/Icon.tsx';

export type InputProps = ComponentPropsWithRef<typeof InputAdapter>;

export function Input({ className, ...props }: InputProps) {
  const classes = [inputPresentation.root, className].filter(Boolean).join(' ');
  return <InputAdapter {...props} passwordVisibilityContent={props.passwordVisibilityContent ?? {
    show: <Icon name="eye" />,
    hide: <Icon name="eye-off" />,
  }} className={classes} />;
}
