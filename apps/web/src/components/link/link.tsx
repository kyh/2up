import type { LinkProps } from "next/link";
import NextLink from "next/link";

type Props = {
  className?: string;
  children?: React.ReactNode;
} & LinkProps;

export const Link = ({ children, href, ...rest }: Props) => {
  return (
    <NextLink href={href} {...rest}>
      {children}
    </NextLink>
  );
};
