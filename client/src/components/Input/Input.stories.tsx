import React from 'react';
import { withContainer } from 'components/Storybook/utils';
import { Box, Input } from 'components';

export default {
  title: 'Input',
  component: Input,
  decorators: [withContainer]
};

export const variants = () => (
  <>
    <Box mb={3}>
      <Input />
    </Box>
    <Input variant="round" />
  </>
);
