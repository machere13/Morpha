# Tabs

Составной компонент для переключения заранее доступных разделов. Для лендинга и документации можно класть в панель любой React-контент: текст, код или другие компоненты.

```tsx
import { Tabs } from '@dreadnought/ui/react';

<Tabs defaultValue="ready">
  <Tabs.List aria-label="Способ использования">
    <Tabs.Tab value="ready">Готовый компонент</Tabs.Tab>
    <Tabs.Tab value="adapter">Адаптер</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="ready">Пример готового компонента</Tabs.Panel>
  <Tabs.Panel value="adapter">Пример адаптера</Tabs.Panel>
</Tabs>;
```

`Tabs` хранит выбор самостоятельно с `defaultValue` либо получает его снаружи через `value` и `onValueChange`. Эти режимы не смешиваются. Каждая `Tabs.Tab` должна иметь ровно одну `Tabs.Panel` с тем же непустым `value`; значения внутри набора уникальны. Выбранная вкладка должна существовать и не быть `disabled`. Для группы задайте понятное имя через `aria-label` или `aria-labelledby` у `Tabs.List`.

```tsx
import { useState } from 'react';
import { Tabs } from '@dreadnought/ui/react';

function Example() {
  const [value, setValue] = useState('preview');
  return <Tabs value={value} onValueChange={setValue}>
    <Tabs.List aria-label="Представление">
      <Tabs.Tab value="preview">Превью</Tabs.Tab>
      <Tabs.Tab value="code">Код</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value="preview">Предпросмотр</Tabs.Panel>
    <Tabs.Panel value="code">Исходный код</Tabs.Panel>
  </Tabs>;
}
```

Стрелки влево/вправо выбирают предыдущую/следующую доступную вкладку с переходом через край; Home/End выбирают первую/последнюю. Отключённые вкладки пропускаются. Неактивные панели остаются в DOM с `hidden`, поэтому их локальное состояние сохраняется. При переходе стрелками фокус и выбор меняются вместе. Для панелей с медленной загрузкой текущий режим не подходит — сначала нужно предусмотреть ручную активацию.

`Tabs` из `@dreadnought/ui/react` подключает стандартное оформление. Поменять тему можно через токены `--dreadnought-tabs-*`; отдельную часть — через её `className` (`Tabs.List`, `Tabs.Tab`, `Tabs.Panel`) без обращения к внутренней DOM-вложенности. Для собственного оформления без библиотечных стилей используйте те же части `TabsAdapter` из `@dreadnought/react/unstyled`. Чистая функция `getNextTabValue` доступна в `@dreadnought/core`, а состояние `useTabs` — в `@dreadnought/react/logic`.
