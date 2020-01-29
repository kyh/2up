import { addons } from '@storybook/addons';
import { create } from '@storybook/theming';

export const storyTheme = create({
  base: 'light',
  brandTitle: 'Blankverse Design System',
  brandUrl: 'https://github.com/tehkaiyu/remote-company',
  colorPrimary: '#3B475F',
  colorSecondary: '#3B475F'
});

addons.setConfig({
  theme: storyTheme,
  isFullscreen: false,
  panelPosition: 'bottom',
  isToolshown: true
});
