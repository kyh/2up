import { ReactNode } from "react";
import NextLink, { LinkProps } from "next/link";

type Props = {
  className?: string;
  children?: ReactNode;
} & LinkProps;

export const Link = ({ children, href, ...rest }: Props) => {
  return (
    <NextLink href={href}>
      <a {...rest}>{children}</a>
    </NextLink>
  );
};
