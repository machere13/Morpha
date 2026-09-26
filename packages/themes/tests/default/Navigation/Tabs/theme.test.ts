import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const themeRoot = 'packages/themes/src/default';
const tokenRoot = `${themeRoot}/tokens/components/Navigation/Tabs`;
const read = (path: string) => readFileSync(resolve(path), 'utf8');

describe('default Tabs theme', () => {
  it('defines every variable used by Tabs CSS or component tokens', () => {
    const global = readdirSync(resolve(`${themeRoot}/tokens/global`))
      .filter((file) => file.endsWith('.tokens.css'))
      .map((file) => read(`${themeRoot}/tokens/global/${file}`));
    const local = readdirSync(resolve(tokenRoot))
      .filter((file) => file.endsWith('.tokens.css'))
      .map((file) => read(`${tokenRoot}/${file}`));
    const cssModule = read('packages/ui/src/presentation/Navigation/Tabs/Tabs.module.css');
    const typography = read(`${themeRoot}/components/Navigation/Tabs/typography.css`);
    const sources = [...global, ...local, cssModule, typography];
    const names = new Set(sources.flatMap((source) =>
      [...source.matchAll(/(--dreadnought-[\w-]+)\s*:/g)].map((match) => match[1]),
    ));
    for (const source of sources) {
      for (const [, reference] of source.matchAll(/var\((--dreadnought-[\w-]+)\)/g)) {
        expect(names.has(reference), `undefined ${reference}`).toBe(true);
      }
    }
  });

  it('connects the Tabs theme to the default entry once', () => {
    const entry = read(`${themeRoot}/index.css`);
    expect(entry.match(/@import '\.\/components\/Navigation\/Tabs\/index\.css';/g)).toHaveLength(1);
    expect(read(`${themeRoot}/components/Navigation/Tabs/index.css`)).toContain("@import '../../../tokens/components/Navigation/Tabs/index.css'");
  });
});
