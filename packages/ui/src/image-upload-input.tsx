"use client";

import type { FormEvent, MouseEventHandler } from "react";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@init/ui/button";
import { If } from "@init/ui/if";
import { Label } from "@init/ui/label";
import { cn } from "@init/ui/utils";
import { UploadIcon, XIcon } from "lucide-react";

type Props = Omit<React.InputHTMLAttributes<unknown>, "value"> & {
  image?: string | null;
  onClear?: () => void;
  onValueChange?: (props: { image: string; file: File }) => void;
  visible?: boolean;
};

const IMAGE_SIZE = 22;

export const ImageUploadInput = forwardRef<React.ElementRef<"input">, Props>(
  (
    {
      children,
      image,
      onClear,
      onInput,
      onValueChange,
      visible = true,
      ...props
    },
    forwardedRef,
  ) => {
    const localRef = useRef<HTMLInputElement>();

    const [state, setState] = useState({
      image,
      fileName: "",
    });

    const onInputChange = useCallback(
      (e: FormEvent<HTMLInputElement>) => {
        e.preventDefault();

        const files = e.currentTarget.files;

        if (files?.length) {
          const file = files[0];

          if (!file) {
            return;
          }

          const data = URL.createObjectURL(file);

          setState({
            image: data,
            fileName: file.name,
          });

          if (onValueChange) {
            onValueChange({
              image: data,
              file,
            });
          }
        }

        if (onInput) {
          onInput(e);
        }
      },
      [onInput, onValueChange],
    );

    const onRemove = useCallback(() => {
      setState({
        image: "",
        fileName: "",
      });

      if (localRef.current) {
        localRef.current.value = "";
      }

      if (onClear) {
        onClear();
      }
    }, [onClear]);

    const imageRemoved: MouseEventHandler = useCallback(
      (e) => {
        e.preventDefault();

        onRemove();
      },
      [onRemove],
    );

    const setRef = useCallback(
      (input: HTMLInputElement) => {
        localRef.current = input;

        if (typeof forwardedRef === "function") {
          forwardedRef(localRef.current);
        }
      },
      [forwardedRef],
    );

    useEffect(() => {
      setState((state) => ({ ...state, image }));
    }, [image]);

    useEffect(() => {
      if (!image) {
        onRemove();
      }
    }, [image, onRemove]);

    const Input = () => (
      <input
        {...props}
        className={cn("hidden", props.className)}
        ref={setRef}
        type={"file"}
        onInput={onInputChange}
        accept="image/*"
        aria-labelledby={"image-upload-input"}
      />
    );

    if (!visible) {
      return <Input />;
    }

    return (
      <label
        id={"image-upload-input"}
        className={`relative flex h-10 w-full cursor-pointer rounded-md border border-dashed border-input
         bg-background px-3 py-2 text-sm outline-none ring-primary ring-offset-2 ring-offset-background transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus:ring-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <Input />

        <div className={"flex items-center space-x-4"}>
          <div className={"flex"}>
            <If condition={!state.image}>
              <UploadIcon className={"h-5 text-muted-foreground"} />
            </If>

            <If condition={state.image}>
              <Image
                loading={"lazy"}
                style={{
                  width: IMAGE_SIZE,
                  height: IMAGE_SIZE,
                }}
                className={"object-contain"}
                width={IMAGE_SIZE}
                height={IMAGE_SIZE}
                src={state.image!}
                alt={props.alt ?? ""}
              />
            </If>
          </div>

          <If condition={!state.image}>
            <div className={"flex flex-auto"}>
              <Label className={"cursor-pointer text-xs"}>{children}</Label>
            </div>
          </If>

          <If condition={state.image}>
            <div className={"flex flex-auto"}>
              <If
                condition={state.fileName}
                fallback={
                  <Label className={"cursor-pointer truncate text-xs"}>
                    {children}
                  </Label>
                }
              >
                <Label className={"truncate text-xs"}>{state.fileName}</Label>
              </If>
            </div>
          </If>

          <If condition={state.image}>
            <Button
              size={"icon"}
              className={"!h-5 !w-5"}
              onClick={imageRemoved}
            >
              <XIcon className="h-4" />
            </Button>
          </If>
        </div>
      </label>
    );
  },
);

ImageUploadInput.displayName = "ImageUploadInput";
