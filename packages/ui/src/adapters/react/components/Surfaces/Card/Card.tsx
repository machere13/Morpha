import { CardAdapter } from '@dreadnought/react/unstyled';
import type { CardAdapterProps } from '@dreadnought/react/unstyled';
import { cardPresentation } from '#presentation/Surfaces/Card/cardPresentation.ts';

export type CardProps = CardAdapterProps;

export function Card({ className, ...props }: CardProps) {
  const classes = [cardPresentation.root, className].filter(Boolean).join(' ');
  return <CardAdapter {...props} className={classes} />;
}
