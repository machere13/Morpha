# Component Variants and Replaceable Icons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add pill-shaped Button/Badge/Tabs variants, replaceable named icons, reusable Mark, and a single-border password Input.

**Architecture:** Existing core behavior stays unchanged. React layer 2 owns unstyled semantics and password state; UI layer 3 owns appearance, the named Ant Design icon mapping, CSS Modules and theme tokens. The public `IconName` contract is framework-neutral so another web adapter can map the same names later.

**Tech Stack:** TypeScript, React 19, `@ant-design/icons`, CSS Modules, CSS custom properties, Vitest, Testing Library, Storybook.

**Spec:** `docs/superpowers/specs/2026-09-26-component-variants-icons-design.md`

## Global Constraints

- Preserve the existing Button/Badge/Input/Tabs behavior, public props, layer boundaries and barrel exports.
- Component directories use PascalCase; functions and hooks use camelCase; tests mirror `src` under sibling `tests`.
- Layer 2 imports neither UI, theme CSS nor Ant Design; only `@dreadnought/ui/react` depends on `@ant-design/icons`.
- Ready-component styles stay in CSS Modules; values come from `--dreadnought-*` theme tokens; colors use `rgb(R G B / A%)`.
- Keep `packages/core/src/behaviors/.keep` out of every commit: its deletion is unrelated user work.
- Each task ends with a local commit on `main`; do not push.

## Review Focus

- Badge without `icon` must not render an empty marker; Task 2 tests this.
- Overlay Badge must not steal its target's click or focus; Task 2 tests this.
- Outlined/ghosted Button must work for both `<button>` and `href` link without submitting forms; Task 3 tests this.
- Non-password and disabled Input must not gain an active visibility control; Task 4 tests this.
- Decorative Icon must be hidden from accessibility APIs while labelled standalone Icon has a name; Task 1 tests this.

---

### Task 1: Mark and named Icon

**Files:**
- Create: `packages/adapters/react/src/DataDisplay/Mark/{MarkAdapter.tsx,index.ts}` and `packages/adapters/react/src/DataDisplay/Icon/{IconAdapter.tsx,index.ts}`; tests at `packages/adapters/react/tests/DataDisplay/Mark/MarkAdapter.test.tsx` and `packages/adapters/react/tests/DataDisplay/Icon/IconAdapter.test.tsx`.
- Create: `packages/ui/src/presentation/DataDisplay/Mark/{Mark.module.css,markPresentation.ts,index.ts}` and `packages/ui/src/presentation/DataDisplay/Icon/{Icon.module.css,iconPresentation.ts,iconNames.ts,index.ts}`.
- Create: `packages/ui/src/adapters/react/components/DataDisplay/Mark/{Mark.tsx,index.ts}` and `packages/ui/src/adapters/react/components/DataDisplay/Icon/{Icon.tsx,index.ts}`; tests at `packages/ui/tests/adapters/react/components/DataDisplay/Mark/Mark.test.tsx` and `packages/ui/tests/adapters/react/components/DataDisplay/Icon/Icon.test.tsx`.
- Create: `packages/themes/src/default/tokens/components/DataDisplay/Mark/{colors.tokens.css,sizing.tokens.css,index.css}`, `packages/themes/src/default/tokens/components/DataDisplay/Icon/{colors.tokens.css,sizing.tokens.css,index.css}`, and `packages/themes/src/default/components/DataDisplay/{Mark,Icon}/index.css`.
- Modify: `packages/adapters/react/src/unstyled.ts`, `packages/ui/src/index.ts`, `packages/ui/src/adapters/react/components/index.ts`, `packages/ui/src/presentation/index.ts`, `packages/themes/src/default/index.css`, `packages/ui/package.json`, `pnpm-lock.yaml`; create `apps/storybook/stories/Mark.stories.tsx` and `apps/storybook/stories/Icon.stories.tsx`.

**Interfaces:** `MarkAdapterProps` contains `shape?: 'circle' | 'square'`; `MarkProps` adds `color?: string`. `IconAdapterProps` contains `children: ReactNode` and optional `aria-label`; `IconProps` adds `name: IconName`. `IconName = 'eye' | 'eye-off' | 'search' | 'check' | 'close'` is exported by `@dreadnought/ui`.

- [ ] **Step 1: Write failing adapter and UI tests.** In the new mirrored test files, assert circle/square `data-shape`, no text for Mark, `--dreadnought-mark-color` on a colored Mark, every icon name renders one SVG, decorative Icon has `aria-hidden="true"`, labelled Icon has `role="img"` and `aria-label`.

```tsx
render(<><Mark shape="square" color="rgb(118 211 160 / 100%)" /><Icon name="eye" /><Icon name="check" aria-label="Готово" /></>);
expect(document.querySelector('[data-ui="mark"]')).toHaveAttribute('data-shape', 'square');
expect(document.querySelector('[data-ui="mark"]')).toHaveStyle('--dreadnought-mark-color: rgb(118 211 160 / 100%)');
expect(screen.getByRole('img', { name: 'Готово' }).querySelector('svg')).not.toBeNull();
expect(document.querySelector('[data-ui="icon"][aria-hidden="true"]')).not.toBeNull();
```

- [ ] **Step 2: Run focused tests and confirm missing exports/components fail.** Run `node_modules/.bin/vitest.CMD run packages/adapters/react/tests/DataDisplay/Mark packages/adapters/react/tests/DataDisplay/Icon packages/ui/tests/adapters/react/components/DataDisplay/Mark packages/ui/tests/adapters/react/components/DataDisplay/Icon`.
- [ ] **Step 3: Implement minimal adapters and themed components.** Install `@ant-design/icons` as a direct UI dependency. `Icon.tsx` uses a private map of named Ant Design components (EyeOutlined, EyeInvisibleOutlined, SearchOutlined, CheckOutlined, CloseOutlined) and passes the selected SVG into `IconAdapter`; no vendor type appears in public props. `Mark` forwards `shape` to `MarkAdapter` and only sets an inline custom property when `color` is supplied.

```tsx
const icons = { eye: EyeOutlined, 'eye-off': EyeInvisibleOutlined, search: SearchOutlined, check: CheckOutlined, close: CloseOutlined } satisfies Record<IconName, ComponentType>;
const Graphic = icons[name];
return <IconAdapter {...rest} className={classes}><Graphic /></IconAdapter>;
```

- [ ] **Step 4: Run focused tests, `pnpm typecheck` and UI build.** Fix only issues found in this task; verify the UI package entry exposes `IconName`, Mark and Icon without loading React from the framework-neutral import.
- [ ] **Step 5: Commit only Task 1 files.** Message: `feat: add replaceable Icon and Mark components`.

### Task 2: Badge ghosted and pill geometry

**Files:** Modify `packages/ui/src/adapters/react/components/DataDisplay/Badge/Badge.tsx`, `packages/ui/src/presentation/DataDisplay/Badge/{Badge.module.css,badgePresentation.ts}`, `packages/themes/src/default/tokens/components/DataDisplay/Badge/{colors.tokens.css,sizing.tokens.css}`, `packages/themes/src/default/tokens/global/sizing.tokens.css`, mirrored UI/theme tests, `apps/storybook/stories/Badge.stories.tsx`, `examples/react/src/main.tsx`.

**Interfaces:** `BadgeProps.appearance?: 'solid' | 'outline' | 'ghosted'`; existing `icon?: ReactNode` accepts `<Mark />` or `<Icon />` unchanged. Global `--dreadnought-border-radius-pill` is shared by later tasks.

- [ ] **Step 1: Write failing tests** for `ghosted`, equal `border-radius` token on solid/outline/ghosted, no icon slot when `icon` omitted, Mark/Icon in the existing `icon` slot, and target click/focus in overlay mode.

```tsx
render(<Badge appearance="ghosted" icon={<Mark shape="circle" color="rgb(118 211 160 / 100%)" />}>Online</Badge>);
expect(screen.getByText('Online').closest('[data-ui="badge"]')).toHaveAttribute('data-appearance', 'ghosted');
expect(document.querySelector('[data-slot="icon"] [data-ui="mark"]')).not.toBeNull();
```

- [ ] **Step 2: Run focused Badge tests and confirm the new appearance fails.** Run `node_modules/.bin/vitest.CMD run packages/ui/tests/adapters/react/components/DataDisplay/Badge packages/themes/tests/default`.
- [ ] **Step 3: Implement** a `ghosted` class with transparent background, no border and normal text; put `--dreadnought-border-radius-pill: 9999px` in global sizing and reference it from Badge. Preserve overlay selector behavior and `aria-hidden` on its badge portion. Add Storybook stories for Mark, Icon and ghosted Badge.

```ts
export type BadgeProps = BadgeAdapterProps & { appearance?: 'solid' | 'outline' | 'ghosted' };
export const badgePresentation = {
  root: `dreadnought-text-badge ${styles.root}`,
  appearances: { solid: styles.solid, outline: styles.outline, ghosted: styles.ghosted },
} as const;
```

- [ ] **Step 4: Run focused tests, `pnpm typecheck` and Storybook build.** Compare all three appearances on graphite, including overlay.
- [ ] **Step 5: Commit only Task 2 files.** Message: `feat: add ghosted pill Badge`.

### Task 3: Button variants and pill geometry

**Files:** Modify `packages/ui/src/adapters/react/components/Controls/Button/Button.tsx`, `packages/ui/src/presentation/Controls/Button/{Button.module.css,buttonPresentation.ts}`, `packages/themes/src/default/tokens/components/Controls/Button/{colors.tokens.css,sizing.tokens.css}`, `packages/themes/src/default/tokens/global/colors.tokens.css`, `packages/themes/tests/default/{theme.test.ts,colorContrast.test.ts}`, `packages/ui/tests/adapters/react/components/Controls/Button/Button.test.tsx`, `apps/storybook/stories/Button.stories.tsx`, `examples/react/src/main.tsx`.

**Interfaces:** `ButtonProps.variant?: 'primary' | 'secondary' | 'outlined' | 'ghosted'`; first layer and `ButtonAdapterProps` do not change.

- [ ] **Step 1: Write failing tests** for two new variants on native button and `href` link, native `type="button"`, disabled/loading behavior, white primary token, darker secondary token, all variants using pill radius, and visible focus. In `colorContrast.test.ts` distinguish secondary/outlined controls by their border contrast against canvas (at least 3:1), since their dark/transparent fill is intentionally not 3:1 against canvas; keep text contrast at least 4.5:1.

```tsx
render(<><Button variant="outlined">Edit</Button><Button href="/docs" variant="ghosted">Docs</Button></>);
expect(screen.getByRole('button', { name: 'Edit' })).toHaveAttribute('data-variant', 'outlined');
expect(screen.getByRole('button', { name: 'Edit' })).toHaveAttribute('type', 'button');
expect(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('data-variant', 'ghosted');
```

- [ ] **Step 2: Run focused Button/theme tests and confirm failure.** Run `node_modules/.bin/vitest.CMD run packages/ui/tests/adapters/react/components/Controls/Button packages/themes/tests/default`.
- [ ] **Step 3: Implement** variant classes/tokens for background, foreground, border and hover. Set primary background to `rgb(255 255 255 / 100%)`, primary hover to `rgb(232 232 232 / 100%)`, secondary to `rgb(70 70 70 / 100%)` and secondary hover to `rgb(88 88 88 / 100%)`. Outlined has transparent background and `color-border-default` border; ghosted has transparent background and border, with `color-surface-default` hover. Give each variant its own border-color token, removing the old shared `button-border-color` after checking references. Keep the revised border/text contrast checks passing. Set Button radius to the shared pill token, with no hard-coded numeric value in the CSS Module.

```ts
export type ButtonProps = ButtonAdapterProps & { variant?: 'primary' | 'secondary' | 'outlined' | 'ghosted' };
export const buttonPresentation = {
  root: `dreadnought-text-button ${styles.button}`,
  variants: { primary: styles.primary, secondary: styles.secondary, outlined: styles.outlined, ghosted: styles.ghosted },
} as const;
```

- [ ] **Step 4: Run focused tests, `pnpm typecheck` and Storybook build.** Inspect normal/hover/focus/disabled/loading on graphite and confirm primary still has a visible outline on Storybook's white test background.
- [ ] **Step 5: Commit only Task 3 files.** Message: `feat: add outlined and ghosted pill Buttons`.

### Task 4: Password Input icon and single focus border

**Files:** Modify `packages/adapters/react/src/Fields/Input/{InputAdapter.tsx,useInput.ts}`, `packages/ui/src/adapters/react/components/Fields/Input/Input.tsx`, `packages/ui/src/presentation/Fields/Input/Input.module.css`, `packages/themes/src/default/tokens/components/Fields/Input/{colors.tokens.css,sizing.tokens.css,spacing.tokens.css}`, mirrored adapter/UI/theme tests and `apps/storybook/stories/Input.stories.tsx`.

**Interfaces:** `InputAdapterProps.passwordVisibilityContent?: { show: ReactNode; hide: ReactNode }`; `show` renders when password is hidden, `hide` when visible. `passwordVisibilityLabels` remains the accessible label source. `InputProps` may override the icon content, but its default comes from named UI Icon.

- [ ] **Step 1: Write failing tests** for the unstyled adapter's text fallback, styled Input's eye/eye-off SVG switching, retained `aria-label`, no toggle for normal input, disabled toggle when input disabled, and focused/invalid CSS contract.

```tsx
render(<Input type="password" passwordVisibilityLabels={{ show: 'Показать пароль', hide: 'Скрыть пароль' }} />);
const toggle = screen.getByRole('button', { name: 'Показать пароль' });
expect(toggle).toContainElement(toggle.querySelector('svg'));
await userEvent.click(toggle);
expect(screen.getByRole('button', { name: 'Скрыть пароль' })).toContainElement(toggle.querySelector('svg'));
expect(toggle).not.toHaveTextContent('Скрыть пароль');
```

- [ ] **Step 2: Run focused Input tests and confirm missing icon/focus behavior fails.** Run `node_modules/.bin/vitest.CMD run packages/adapters/react/tests/Fields/Input packages/ui/tests/adapters/react/components/Fields/Input packages/themes/tests/default`.
- [ ] **Step 3: Implement** optional `passwordVisibilityContent` in InputAdapter without passing it to the native input; preserve `useInput` state and labels. UI Input supplies `<Icon name="eye" />` and `<Icon name="eye-off" />` by default. Replace the `:focus-within` outline with `border-color`, and let `[data-invalid]` keep its error border during focus. Remove unused Input focus-width/offset tokens after checking references.

```tsx
const { passwordVisibilityContent, ...options } = props;
const { visibilityButtonProps, isPasswordVisible } = useInput(options);
const content = passwordVisibilityContent?.[isPasswordVisible ? 'hide' : 'show'] ?? visibilityButtonProps?.children;
return visibilityButtonProps && <button {...visibilityButtonProps}>{content}</button>;
```

- [ ] **Step 4: Run focused tests, `pnpm typecheck` and Storybook build.** Visually inspect focused, invalid and password states on graphite.
- [ ] **Step 5: Commit only Task 4 files.** Message: `feat: use named icons for password Input`.

### Task 5: Pill Tabs and end-to-end verification

**Files:** Modify `packages/themes/src/default/tokens/components/Navigation/Tabs/sizing.tokens.css`, `packages/themes/tests/default/Navigation/Tabs/theme.test.ts`, `apps/storybook/stories/Tabs.stories.tsx`, `docs/conventions.md`.

**Interfaces:** No Tabs TypeScript API change; only `--dreadnought-tabs-list-radius` and `--dreadnought-tabs-tab-radius` point to `--dreadnought-border-radius-pill`.

- [ ] **Step 1: Write a failing Tabs theme test** that resolves both radius aliases to the same pill token and confirms the selected/unselected styles use the same radius.

```ts
expect(tabsSizing).toContain('--dreadnought-tabs-list-radius: var(--dreadnought-border-radius-pill)');
expect(tabsSizing).toContain('--dreadnought-tabs-tab-radius: var(--dreadnought-border-radius-pill)');
```

- [ ] **Step 2: Run the focused test and confirm the 10px radius fails.** Run `node_modules/.bin/vitest.CMD run packages/themes/tests/default/Navigation/Tabs/theme.test.ts`.
- [ ] **Step 3: Map both Tabs radii to the pill token; update the Storybook examples and conventions** to show the complete Button/Badge/Mark/Icon/Input/Tabs visual language and the replaceable icon registry. Do not change Tabs behavior.

```css
:root {
  --dreadnought-tabs-list-radius: var(--dreadnought-border-radius-pill);
  --dreadnought-tabs-tab-radius: var(--dreadnought-border-radius-pill);
}
```
- [ ] **Step 4: Run `pnpm test`, `pnpm typecheck`, `pnpm build` and `pnpm --filter @dreadnought/storybook build:storybook`.** Open local Storybook and inspect all variants, disabled/loading, password visibility, invalid/focus, Badge overlay, both Mark shapes and Tabs on graphite. Report any build warning separately from failures.
- [ ] **Step 5: Check `git diff --check` and `git status --short`, then commit only Task 5 files.** Message: `style: align Tabs and component showcase with pill theme`. Preserve the unrelated `.keep` deletion.
