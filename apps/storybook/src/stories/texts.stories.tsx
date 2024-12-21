import { Text } from "@init/ui/text";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Texts",
  parameters: {
    layout: "centered",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Texts: Story = {
  render: () => (
    <div className="relative box-border flex max-w-full flex-wrap gap-5 border-4 border-black p-10">
      <span className="absolute left-10 top-[-12px] bg-white px-2 text-black">
        Texts
      </span>
      <Text variant="primary">Primary</Text>
      <Text variant="success">Success</Text>
      <Text variant="warning">Warning</Text>
      <Text variant="error">Error</Text>
      <Text variant="disabled">Disabled</Text>
    </div>
  ),
};
