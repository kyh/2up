import { classed, deriveClassed } from "~/utils/classed";

export const Card = classed.div(
  "flex flex-col p-8 border-2 border-grey-dark dark:border-grey-light rounded-wavy",
  {
    variants: {
      background: {
        true: "bg-white dark:bg-black",
        false: "bg-transparent",
      },
    },
    defaultVariants: {
      background: "false",
    },
  }
);

type PropsV2 = {
  onClick?: () => void;
  children?: React.ReactNode;
  CardBackground?:
    | "accent-black"
    | "accent-white"
    | "accent-grey-1"
    | "accent-grey-2"
    | "accent-grey-3"
    | "accent-grey-4"
    | "accent-yellow-dark"
    | "accent-yellow-regular"
    | "accent-blue-dark"
    | "accent-blue-regular"
    | "accent-green-dark"
    | "accent-green-regular"
    | "accent-red-dark"
    | "accent-red-regular"
    | "accent-beige-dark"
    | "accent-beige-regular";
};
const StyledCardV2 = classed.div(
  "border-2 mx-2 rounded-md shadow-m px-[25px] py-[35px] mb-[20px] ${area}",

  {
    variants: {
      background: {
        black: "",
        white: "bg",
        "grey-1": "bg",
        "grey-2": "bg",
        "grey-3": "bg",
        "grey-4": "",
        "yellow-dark": "bg",
        "yellow-regular": "bg",
        "blue-dark": "bg",
        "blue-regular": "bg",
        "green-dark": "bg",
        "green-regular": "bg",
        "red-dark": "bg",
        "red-regular": "bg",
        "beige-dark": "bg",
        "beige-regular": "bg",
      },
    },
    defaultVariants: {
      background: "grey-4",
    },
  }
);
export const CardV2 = deriveClassed<typeof StyledCardV2, PropsV2>(
  ({ children }) => {
    return <StyledCardV2>{children}</StyledCardV2>;
  }
);
