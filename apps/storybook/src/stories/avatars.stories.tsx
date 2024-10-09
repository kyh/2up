import { Avatar } from "@2up/ui/ui/avatar";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Avatars",
  parameters: {
    layout: "centered",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Avatars: Story = {
  render: () => (
    <div className="relative box-border flex max-w-full flex-wrap gap-5 border-4 border-black p-10">
      <span className="absolute left-10 top-[-12px] bg-white px-2 text-black">
        Avatars
      </span>

      <Avatar alt="" size="normal" src="https://avatar.iran.liara.run/public" />
      <Avatar alt="" size="small" src="https://avatar.iran.liara.run/public" />
      <Avatar alt="" size="medium" src="https://avatar.iran.liara.run/public" />
      <Avatar alt="" size="large" src="https://avatar.iran.liara.run/public" />

      <Avatar
        alt=""
        size="normal"
        src="https://avatar.iran.liara.run/public"
        rounded
      />
      <Avatar
        alt=""
        size="small"
        src="https://avatar.iran.liara.run/public"
        rounded
      />
      <Avatar
        alt=""
        size="medium"
        src="https://avatar.iran.liara.run/public"
        rounded
      />
      <Avatar
        alt=""
        size="large"
        src="https://avatar.iran.liara.run/public"
        rounded
      />
    </div>
  ),
};
