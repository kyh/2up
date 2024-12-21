import React from "react";
import { Checkbox } from "@init/ui/checkbox";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Checkboxes",
  parameters: {
    layout: "centered",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Checkboxes: Story = {
  render: () => (
    <div className="relative box-border flex max-w-full flex-col flex-wrap gap-5 border-4 border-black p-10">
      <span className="absolute left-10 top-[-12px] bg-white px-2 text-black">
        Checkboxs
      </span>

      <Checkbox name="passw" variant="normal" label="Enable" />

      <div className="bg-dark py-5">
        <Checkbox name="failww" variant="dark" label="Dark" />
      </div>
    </div>
  ),
};
