import { AppConfig } from '@/config';
import { Page } from './types';

export const Pages: Page[] = AppConfig.Group.reduce(
  (acc, group) => acc.concat(group.Pages),
  [] as Page[]
);

export const getPageByPath = (path: string): Page | null =>
  Pages.find((page) => page.Href === path) ?? null;
