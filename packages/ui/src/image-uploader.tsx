"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@init/ui/button";
import { ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import { ImageUploadInput } from "./image-upload-input";

export const ImageUploader = (
  props: React.PropsWithChildren<{
    value: string | null | undefined;
    onValueChange: (value: File | null) => unknown;
  }>,
) => {
  const [image, setImage] = useState(props.value);

  const { setValue, register } = useForm<{
    value: string | null | FileList;
  }>({
    defaultValues: {
      value: props.value,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const control = register("value");

  const onClear = useCallback(() => {
    props.onValueChange(null);
    setValue("value", null);
    setImage("");
  }, [props, setValue]);

  const onValueChange = useCallback(
    ({ image, file }: { image: string; file: File }) => {
      props.onValueChange(file);

      setImage(image);
    },
    [props],
  );

  const Input = () => (
    <ImageUploadInput
      {...control}
      accept={"image/*"}
      className={"absolute h-full w-full"}
      visible={false}
      multiple={false}
      onValueChange={onValueChange}
    />
  );

  useEffect(() => {
    setImage(props.value);
  }, [props.value]);

  if (!image) {
    return (
      <FallbackImage descriptionSection={props.children}>
        <Input />
      </FallbackImage>
    );
  }

  return (
    <div className={"flex items-center space-x-4"}>
      <label className={"relative h-20 w-20 animate-in fade-in zoom-in-50"}>
        <Image fill className={"h-20 w-20 rounded-full"} src={image} alt={""} />

        <Input />
      </label>

      <div>
        <Button onClick={onClear} size={"sm"} variant={"ghost"}>
          Clear
        </Button>
      </div>
    </div>
  );
};

const FallbackImage = (
  props: React.PropsWithChildren<{
    descriptionSection?: React.ReactNode;
  }>,
) => (
  <div className={"flex items-center space-x-4"}>
    <label
      className={
        "relative flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-full border border-border animate-in fade-in zoom-in-50 hover:border-primary"
      }
    >
      <ImageIcon className={"h-8 text-primary"} />

      {props.children}
    </label>

    {props.descriptionSection}
  </div>
);
