import { classed, deriveClassed, ComponentProps } from "@/lib/utils/classed";
import { Container } from "@/lib/game/components/question";

type InstructionProps = ComponentProps<typeof InstructionContainer> & {
  instruction?: string | null;
};

export const Instruction = deriveClassed<
  typeof InstructionContainer,
  InstructionProps
>(({ instruction, ...rest }, ref) => {
  return (
    <InstructionContainer {...rest} ref={ref} className="instruction">
      {instruction}
    </InstructionContainer>
  );
});

export const InstructionContainer = classed(
  Container,
  "text-grey dark:text-grey-light",
  {
    variants: {
      height: {
        default: "h-[50px]",
        class: "",
      },
    },
    defaultVariants: {
      height: "default",
    },
  },
);
