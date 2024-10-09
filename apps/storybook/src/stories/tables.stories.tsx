import { Table } from "@2up/ui/ui/table";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Tables",
  parameters: {
    layout: "centered",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const tabledata = {
  head: [
    "Table.is-bordered",
    "Table.is-centered",
    "Table.is-centered",
    "Table.is-centered",
  ],
  body: [
    [
      "Thou hast had a good morning",
      "Thou hast had a good afternoon",
      "Thou hast had a good evening",
      "Thou hast had a good night",
    ],
    [
      "Thou hast had a good morning",
      "Thou hast had a good afternoon",
      "Thou hast had a good evening",
      "Thou hast had a good night",
    ],
  ],
};

const tabledata2 = {
  head: ["Table.is-dark", "Table.is-bordered"],
  body: [
    ["Thou hast had a good morning", "Thou hast had a good morning"],
    ["Thou hast had a good afternon", "Thou hast had a good afternon"],
  ],
};

export const Tables: Story = {
  render: () => (
    <div className="relative flex max-w-[100%] flex-col flex-wrap gap-5 border-4 border-black p-10">
      <span className="absolute left-10 top-[-12px] bg-white px-2 text-black">
        Tables
      </span>

      <Table variant="normal" data={tabledata} centered bordered />
      <Table variant="dark" data={tabledata2} bordered />
    </div>
  ),
};
