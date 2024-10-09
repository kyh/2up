import { Cursor } from "@2up/ui/ui/cursor";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Cursors",
  parameters: {
    layout: "centered",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Cursors: Story = {
  render: () => (
    <div className="relative box-border flex max-w-full flex-col flex-wrap gap-5 border-4 border-black p-10">
      <span className="absolute left-10 top-[-12px] bg-white px-2 text-black">
        Cursors
      </span>

      <Cursor type="normal" from="left">
        This is not a clickable element, but it's an area of the pointer.
      </Cursor>
    </div>
  ),
};
