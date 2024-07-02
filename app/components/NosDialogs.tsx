import React from "react";

import { NosBtn } from "./ui/NosBtn";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/NosDialog";

export default function Dialogs() {
  return (
    <div className="relative box-border flex max-w-full flex-col flex-wrap border-4 border-black p-10">
      <span className="absolute left-10 top-[-12px] bg-white px-2 text-black">
        Dialogs
      </span>

      <Dialog>
        <DialogTrigger asChild>
          <NosBtn variant="primary">Open dialog</NosBtn>
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
            <NosBtn variant="normal">Cancel</NosBtn>
            <NosBtn variant="primary">Confirm</NosBtn>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <NosBtn variant="primary">Open dark dialog</NosBtn>
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
            <NosBtn variant="normal">Cancel</NosBtn>
            <NosBtn variant="primary">Confirm</NosBtn>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <NosBtn variant="primary">Open rounded dialog</NosBtn>
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
            <NosBtn variant="normal">Cancel</NosBtn>
            <NosBtn variant="primary">Confirm</NosBtn>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <NosBtn variant="primary">Open dark and rounded dialog</NosBtn>
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
            <NosBtn variant="normal">Cancel</NosBtn>
            <NosBtn variant="primary">Confirm</NosBtn>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
