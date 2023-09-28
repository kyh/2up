import { ReactNode } from "react";
import { classed, deriveClassed, ComponentProps } from "~/utils/classed";
import { useHomeStore } from "~/lib/home/home-store";
import { createOrGetFx } from "~/styles/sound";
import { Link } from "../link/link";

const StyledButton = classed.button(
  "border-2 border-grey-dark dark:border-grey-light",
  "animate-[bounce-contract_1s] hover:animate-[bounce-expand_1s_forwards]",
  "active:animate-[bounce-contract_1s]",
  "disabled:brightness-50 disabled:cursor-not-allowed disabled:animate-none",
  "disabled:hover:animate-none",
  {
    variants: {
      variant: {
        default: "p-2 rounded-wavy",
        fab: "p-1 rounded-full",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

type Props = ComponentProps<typeof StyledButton> & {
  onClick?: () => void;
  children?: ReactNode;
};

export const Button = deriveClassed<typeof StyledButton, Props>(
  ({ onClick = () => {}, ...rest }: Props) => {
    const isSFXOn = useHomeStore((state) => state.isSFXOn);

    const onButtonClick = () => {
      const clickSound = createOrGetFx("click");
      if (clickSound && isSFXOn) clickSound.play();
      onClick();
    };

    return <StyledButton type="button" onClick={onButtonClick} {...rest} />;
  }
);

export const ButtonLink = classed.a(StyledButton, "text-center");

export const ButtonLinkNative = classed(Link, StyledButton);
