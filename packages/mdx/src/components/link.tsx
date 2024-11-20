import clsx from "clsx";

type LinkProps = {
  text?: string;
  underline?: boolean;
  className?: string;
} & React.HTMLProps<HTMLAnchorElement>;

export const Link = ({
  text,
  href,
  underline,
  className,
  children,
}: LinkProps) => {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={clsx(className, {
        "decoration-gray-a4 underline decoration-1 underline-offset-2":
          underline,
      })}
      href={href}
    >
      {text || children}
    </a>
  );
};
