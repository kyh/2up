import { ReactNode } from "react";
import { classed, deriveClassed, ComponentProps } from "@tw-classed/react";
import { useHomeStore } from "~/lib/home/homeStore";
import { createOrGetFx } from "~/styles/sound";
import { Link } from "../Link/Link";

const StyledButton = classed.button(
  "border-2 border-black dark:border-white min-w-[100px]",
  "animate-[bounce-contract_1s] hover:animate-[bounce-expand_1s_forwards]",
  "active:animate-[bounce-contract_1s]",
  "disabled:brightness-50 disabled:cursor-not-allowed disabled:animate-none",
  "disabled:hover:animate-none", {
  variants: {
    variant: {
      default: "p-4",
      fab: "p-1"
    },
    fullWidth: {
      true: "w-full",
      false: "w-auto"
    }
  },
  defaultVariants: {
    variant: "default",
    fullWidth: "false"
  }
});


type Props = ComponentProps<typeof StyledButton> & {
  onClick?: () => void;
  children?: ReactNode;
};

export const Button = deriveClassed<typeof StyledButton, Props>(({ onClick = () => { }, ...rest }: Props) => {
  const isSFXOn = useHomeStore((state) => state.isSFXOn);

  const onButtonClick = () => {
    const clickSound = createOrGetFx("click");
    if (clickSound && isSFXOn) clickSound.play();
    onClick();
  };

  return <StyledButton type="button" onClick={onButtonClick} {...rest} />;
});

export const ButtonLink = classed.a(StyledButton, "text-center");

export const ButtonLinkNative = classed(Link, StyledButton);
