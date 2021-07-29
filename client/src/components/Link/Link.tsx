import { ReactNode } from "react";
import NextLink from "next/link";

type Props = {
  to: string;
  children?: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent) => void;
};

export const Link = ({ children, to, ...rest }: Props) => {
  return (
    <NextLink href={to}>
      <a {...rest}>{children}</a>
    </NextLink>
  );
};
