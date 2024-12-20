import { List } from "@init/ui/ui/list";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Lists",
  parameters: {
    layout: "centered",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const listdata = [
  "Good morning.",
  "Thou hast had a good night's sleep, I hope.",
  "Thou hast had a good afternoon",
  "Good night.",
];

export const Lists: Story = {
  render: () => (
    <div className="relative box-border flex max-w-full flex-wrap gap-5 border-4 border-black p-10">
      <span className="absolute left-10 top-[-12px] bg-white px-2 text-black">
        Lists
      </span>

      <List variant="normal" data={listdata} />
      <List variant="dark" data={listdata} />
    </div>
  ),
};
