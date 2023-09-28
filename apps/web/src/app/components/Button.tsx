import { classed, deriveClassed, ComponentProps } from "~/utils/classed";
import { useHomeStore } from "~/lib/home/home-store";
import { createOrGetFx } from "~/styles/sound";

type PropsV2 = {
  onClick?: () => void;
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "link"; // Represents the color of the button
  size?: "small" | "medium";
};

const StyledButton = classed.button(
  "rounded-md border-2  text-white mb-7 inline-block relative text-center",

  {
    variants: {
      variant: {
        primary: "bg-accent-yellow-regular",
        secondary: "bg-accent-gray-regular",
        link: "bg-transparent",
      },
      size: {
        small: "w-[150px] h-[27px]",
        medium: "w-[180px] h-[38px]",
      },
    },
    compoundVariants: [
      {
        variant: "primary",
        class: "border-accent-yellow-regular",
      },
      {
        variant: "secondary",
        class: "border-white",
      },
      {
        variant: "link",
        class: "border-transparent",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "small",
    },
  },
);

export const Button = deriveClassed<typeof StyledButton, PropsV2>(
  ({ onClick = () => {}, ...rest }: PropsV2) => {
    const isSFXOn = useHomeStore((state) => state.isSFXOn);

    const onButtonClick = () => {
      const clickSound = createOrGetFx("click");
      if (clickSound && isSFXOn) clickSound.play();
      onClick();
    };

    return <StyledButton type="button" onClick={onButtonClick} {...rest} />;
  },
);
