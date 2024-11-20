"use client";

import type { ImageProps } from "next/image";
import React from "react";
import Image from "next/image";

type MDXImageProps = {
  alt: string;
  caption?: string;
} & ImageProps;

export function MDXImage({ caption, alt, ...props }: MDXImageProps) {
  const [isImageLoading, setImageLoading] = React.useState(true);
  const href = props.src.toString();

  return (
    <a
      className="my-6 flex cursor-pointer flex-col justify-end gap-2"
      href={href}
    >
      <div className="rounded-large border-border relative max-h-96 w-full overflow-hidden border">
        <Image
          unoptimized
          alt={alt}
          width={1000}
          height={1000}
          sizes="100vw"
          style={{
            objectFit: "contain",
            width: "100%",
            height: "auto",
            objectPosition: "center",
            WebkitFilter: isImageLoading ? "blur(8px)" : "none",
            transition: "all 0.5s ease",
          }}
          onLoad={() => setImageLoading(false)}
          {...props}
        />
      </div>
      {caption && <sub className="pt-2 text-center">{caption}</sub>}
    </a>
  );
}
