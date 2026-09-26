import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from '@dreadnought/ui/react';

const meta = {
  title: 'Navigation/Tabs',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Layers: Story = {
  render: () => <Tabs defaultValue="ready">
    <Tabs.List aria-label="Уровень библиотеки">
      <Tabs.Tab value="ready">Компонент</Tabs.Tab>
      <Tabs.Tab value="adapter">Адаптер</Tabs.Tab>
      <Tabs.Tab value="core">Логика</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value="ready">Готовый компонент с темой.</Tabs.Panel>
    <Tabs.Panel value="adapter">Структура без оформления.</Tabs.Panel>
    <Tabs.Panel value="core">Правила выбора и навигации.</Tabs.Panel>
  </Tabs>,
};

export const Disabled: Story = {
  render: () => <Tabs defaultValue="first">
    <Tabs.List aria-label="Разделы">
      <Tabs.Tab value="first">Доступен</Tabs.Tab>
      <Tabs.Tab value="second" disabled>Недоступен</Tabs.Tab>
      <Tabs.Tab value="third">Следующий</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value="first">Первый раздел.</Tabs.Panel>
    <Tabs.Panel value="second">Недоступный раздел.</Tabs.Panel>
    <Tabs.Panel value="third">Третий раздел.</Tabs.Panel>
  </Tabs>,
};

function ControlledExample() {
  const [value, setValue] = useState('first');
  return <Tabs value={value} onValueChange={setValue}>
    <Tabs.List aria-label="Управляемые вкладки">
      <Tabs.Tab value="first">Первый</Tabs.Tab>
      <Tabs.Tab value="second">Второй</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value="first">Текущее значение: {value}</Tabs.Panel>
    <Tabs.Panel value="second">Текущее значение: {value}</Tabs.Panel>
  </Tabs>;
}

export const Controlled: Story = { render: () => <ControlledExample /> };
