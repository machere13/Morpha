import type { Preview } from '@storybook/react-vite';
import '@dreadnought/themes/default.css';
import styles from './preview.module.css';

const preview: Preview = {
  decorators: [
    (Story, { globals }) => (
      <div className={`${styles.canvas} ${globals.backgrounds?.value === 'white' ? styles.light : styles.dark}`}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    controls: { expanded: true },
    backgrounds: {
      options: {
        graphite: { name: 'Графит', value: 'var(--dreadnought-color-action-primary)' },
        gray: { name: 'Серый', value: 'var(--dreadnought-color-action-secondary)' },
        white: { name: 'Белый', value: 'var(--dreadnought-color-surface-default)' },
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: 'graphite' },
  },
};

export default preview;
