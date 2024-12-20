import { Progress } from "@init/ui/ui/progress";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Progresses",
  parameters: {
    layout: "centered",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Progresses: Story = {
  render: () => (
    <div className="relative box-border flex max-w-full flex-wrap gap-5 border-4 border-black p-10">
      <span className="absolute left-10 top-[-12px] bg-white px-2 text-black">
        Progress
      </span>

      <Progress variant="normal" percent={80} />
      <Progress variant="primary" percent={65} />
      <Progress variant="success" percent={50} />
      <Progress variant="warning" percent={35} />
      <Progress variant="error" percent={20} />
      <Progress variant="pattern" percent={50} />
    </div>
  ),
};
