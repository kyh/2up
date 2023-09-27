import { classed, deriveClassed } from "~/utils/classed";

type PropsV2 = {
  onClick?: () => void;
  children?: React.ReactNode;
  background?:
    | "accent-black"
    | "accent-white"
    | "grey1"
    | "grey2"
    | "grey3"
    | "grey4"
    | "accent-yellow-dark"
    | "accent-yellow-regular"
    | "accent-blue-dark"
    | "accent-blue-regular"
    | "accent-green-dark"
    | "accent-green-regular"
    | "red-dark"
    | "red-regular"
    | "accent-beige-dark"
    | "accent-beige-regular";
};
const StyledCardV2 = classed.div(
  "border-2 mx-2 rounded-md shadow-m px-[25px] py-[35px] mb-[20px] ${area}",

  {
    variants: {
      background: {
        black: "bg-accent-black",
        white: "bg-accent-white",
        grey1: "bg-accent-grey-grey1",
        grey2: "bg-accent-grey-grey2",
        grey3: "bg-accent-grey-grey3",
        grey4: "bg-accent-grey-grey4",
        "yellow-dark": "bg-accent-yellow-dark",
        "yellow-regular": "bg-accent-yellow-regular",
        "blue-dark": "bg-accent-blue-dark",
        "blue-regular": "bg-accent-blue-regular",
        "green-dark": "bg-accent-green-dark",
        "green-regular": "bg-accent-green-regular",
        "red-dark": "bg-accent-red-dark",
        "red-regular": "bg-accent-red-regular",
        "beige-dark": "bg-accent-beige-dark",
        "beige-regular": "bg-accent-beige-regular",
      },
    },
    defaultVariants: {
      background: "grey2",
    },
  }
);
export const CardV2 = deriveClassed<typeof StyledCardV2, PropsV2>(
  ({ children }) => {
    return <StyledCardV2>{children}</StyledCardV2>;
  }
);
