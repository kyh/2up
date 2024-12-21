import { Button } from "@init/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@init/ui/dialog";

import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Dialogs",
  parameters: {
    layout: "centered",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Dialogs: Story = {
  render: () => (
    <div className="relative box-border flex max-w-full flex-col flex-wrap border-4 border-black p-10">
      <span className="absolute left-10 top-[-12px] bg-white px-2 text-black">
        Dialogs
      </span>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="primary">Open dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]" block>
          <DialogHeader>
            <DialogTitle>Hey!</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div>
            <p>This is a dialog.</p>
          </div>
          <DialogFooter>
            <Button variant="normal">Cancel</Button>
            <Button variant="primary">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="primary">Open dark dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]" variant="dark" block>
          <DialogHeader>
            <DialogTitle>Hey!</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div>
            <p>This is a dark dialog.</p>
          </div>
          <DialogFooter>
            <Button variant="normal">Cancel</Button>
            <Button variant="primary">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="primary">Open rounded dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]" block rounded>
          <DialogHeader>
            <DialogTitle>Hey!</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div>
            <p>This is a rounded dialog.</p>
          </div>
          <DialogFooter>
            <Button variant="normal">Cancel</Button>
            <Button variant="primary">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="primary">Open dark and rounded dialog</Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[425px]"
          variant="dark"
          block
          rounded
        >
          <DialogHeader>
            <DialogTitle>Hey!</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div>
            <p>This is a rounded and dark dialog.</p>
          </div>
          <DialogFooter>
            <Button variant="normal">Cancel</Button>
            <Button variant="primary">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ),
};
