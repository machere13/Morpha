import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '@dreadnought/ui/react';

const meta = { title: 'DataDisplay/Icon', component: Icon, args: { name: 'eye', 'aria-label': 'Показать' } } satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Eye: Story = {};
export const Search: Story = { args: { name: 'search', 'aria-label': 'Поиск' } };
export const Check: Story = { args: { name: 'check', 'aria-label': 'Готово' } };
