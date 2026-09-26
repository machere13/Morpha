import styles from './Tabs.module.css';

export const tabsPresentation = {
  root: styles.root,
  list: styles.list,
  tab: `dreadnought-text-tabs-tab ${styles.tab}`,
  panel: `dreadnought-text-tabs-panel ${styles.panel}`,
} as const;
