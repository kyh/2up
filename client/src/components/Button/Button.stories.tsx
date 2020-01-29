import React from 'react';
import { action } from '@storybook/addon-actions';
import { withContainer } from 'components/Storybook/utils';
import { Button } from 'components';

export default {
  title: 'Button',
  component: Button,
  decorators: [withContainer]
};

export const base = () => (
  <Button onClick={action('clicked')}>Hello Button</Button>
);
