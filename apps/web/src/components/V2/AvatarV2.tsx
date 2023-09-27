import { classed, deriveClassed } from "~/utils/classed";

const StyledAvatarV2 = classed.div(
  "text-white p-2 flex flex-between rounded-[50%] items-center justify-center z-50",
  {
    variants: {
      size: {
        small: "w-[40px] h-[40px]",
        large: "w-[56px] h-[56px]",
      },
      variant: {
        error: "bg-accent-red-regular",
        warning: "bg-accent-yellow-regular",
        information: "bg-accent-gray-regular",
        success: "bg-accent-green-light",
        info: "bg-accent-blue-regular",
      },
    },
    defaultVariants: {
      size: "large",
      variant: "info",
    },
  }
);

type PropsV2 = {
  children?: React.ReactNode;
  variant?: "error" | "warning" | "information" | "success" | "info"; // Represents the color of the avatar
  size?: "small" | "large";
};

export const AvatarV2 = deriveClassed<typeof StyledAvatarV2, PropsV2>(
  ({ children, ...rest }, ref) => {
    return (
      <StyledAvatarV2 {...rest} ref={ref}>
        {children}
      </StyledAvatarV2>
    );
  }
);
