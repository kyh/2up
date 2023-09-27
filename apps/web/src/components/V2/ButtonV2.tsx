import { ReactNode } from "react";
import { classed, deriveClassed, ComponentProps } from "~/utils/classed";
import { useHomeStore } from "~/lib/home/homeStore";
import { createOrGetFx } from "~/styles/sound";
import { Link } from "../Link/Link";

type PropsV2 = {
  onClick?: () => void;
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "link"; // Represents the color of the button
  size?: "small" | "medium";
};
// eightbit-btn {
//   background: #4AA52E;
//   display: inline-block;
//   position: relative;
//   text-align: center;
//   font-size: 30px;
//   padding: 20px;
//   font-family: 'Press Start 2P', cursive;
//   text-decoration: none;
//   color: white;
//   box-shadow: inset -4px -4px 0px 0px #4AA52E;
// }

// .eightbit-btn:hover,
// .eightbit-btn:focus {
//   background: #4AA52E;
//   box-shadow: inset -6px -6px 0px 0px #4AA52E;
// }

// .eightbit-btn:active {
//   box-shadow: inset 4px 4px 0px 0px #4AA52E;
// }

// .eightbit-btn:before,
// .eightbit-btn:after {
//   content: '';
//   position: absolute;
//   width: 100%;
//   height: 100%;
//   box-sizing: content-box;
// }

// .eightbit-btn:before {
//   top: -6px;
//   left: 0;
//   border-top: 6px #4AA52E solid;
//   border-bottom: 6px #4AA52E solid;
// }

// .eightbit-btn:after {
//   left: -6px;
//   top: 0;
//   border-left: 6px #4AA52E solid;
//   border-right: 6px #4AA52E solid;
// }
// text-white mb-7 inline-block relative text-center text-xs shadow-[inset 4px 4px 0px 0px #4AA52E] after:content-[''] before:content-[''] after:absolute after:w-full after:h-full after:box-sizing-[content-box] after:top-[-6px] after:left-[0] after:border-top-[6px #4AA52E solid] after:border-bottom-[6px #4AA52E solid] before:absolute before:w-full before:h-full before:box-sizing-[content-box] before:left-[-6px] before:top-[0] before:border-left-[6px #4AA52E solid] before:border-right-[6px #4AA52E solid] hover:shadow-[inset -6px -6px 0px 0px #4AA52E] focus:shadow-[inset -6px -6px 0px 0px #4AA52E] active:shadow-[inset 4px 4px 0px 0px #4AA52E]

const StyledButtonV2 = classed.button(
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
  }
);

export const ButtonV2 = deriveClassed<typeof StyledButtonV2, PropsV2>(
  ({ onClick = () => {}, ...rest }: PropsV2) => {
    const isSFXOn = useHomeStore((state) => state.isSFXOn);

    const onButtonClick = () => {
      const clickSound = createOrGetFx("click");
      if (clickSound && isSFXOn) clickSound.play();
      onClick();
    };

    return <StyledButtonV2 type="button" onClick={onButtonClick} {...rest} />;
  }
);
