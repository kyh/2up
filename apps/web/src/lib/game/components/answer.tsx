import { useState, SyntheticEvent } from "react";
import { classed } from "@/lib/utils/classed";
import { Input, Button } from "@/components";
import { AnswerTypeSlugs } from "@/lib/game/game-utils";
import type { StepProps } from "@/lib/game/steps/types";

type AnswerProps = {
  sceneAnswer: StepProps["gameState"]["sceneAnswers"][0];
  answerType: StepProps["gameState"]["answerType"];
  submitted: boolean;
  onSubmit: (
    submission: Pick<StepProps["gameState"]["submissions"][0], "content">,
  ) => void;
  displayMode?: boolean;
};

export const Answer = (props: AnswerProps) => {
  switch (props.answerType) {
    case AnswerTypeSlugs.multiText.id:
      return <AnswerMulti {...props} />;
    default:
      return <AnswerText {...props} />;
  }
};

const AnswerDisplay = classed.div(
  "overflow-hidden relative p-4 border-2 border-grey-dark dark:border-grey-light rounded-wavy",
);

const AnswerDisplaySvg = () => (
  <svg
    className="pointer-events-none absolute left-0 top-0 z-[-1] h-full w-full fill-none content-['']"
    width="100%"
    height="9"
    viewBox="0 0 101 9"
  >
    <path
      className="[stroke-dasharray:1] [stroke-dashoffset:1]"
      d="M.426 1.973C4.144 1.567 17.77-.514 21.443 1.48 24.296 3.026 24.844 4.627 27.5 7c3.075 2.748 6.642-4.141 10.066-4.688 7.517-1.2 13.237 5.425 17.59 2.745C58.5 3 60.464-1.786 66 2c1.996 1.365 3.174 3.737 5.286 4.41 5.423 1.727 25.34-7.981 29.14-1.294"
      pathLength="1"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </svg>
);

const AnswerText = ({
  sceneAnswer,
  submitted,
  onSubmit,
  displayMode,
}: AnswerProps) => {
  const [value, setValue] = useState("");

  const submit = (e: SyntheticEvent) => {
    e.preventDefault();
    onSubmit({ content: value });
  };

  if (displayMode) {
    // TODO - make sure these are
    return (
      <AnswerTextDisplay
        className={`answer-display answer-text ${
          sceneAnswer.isCorrect ? "correct" : ""
        }`}
      >
        {sceneAnswer.content}
      </AnswerTextDisplay>
    );
  }

  return (
    <AnswerTextForm onSubmit={submit}>
      <InputContainer>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          readOnly={submitted}
          autoFocus
          fullWidth
        />
      </InputContainer>
      <Button type="submit" disabled={!value || submitted}>
        Submit answer
      </Button>
    </AnswerTextForm>
  );
};

const AnswerTextDisplay = classed(AnswerDisplay, " [border-style:inset]");

const AnswerTextForm = classed.form("text-center w-full");

const InputContainer = classed.div("flex justify-center mb-3");

const AnswerMulti = ({
  sceneAnswer,
  submitted,
  onSubmit,
  displayMode,
}: AnswerProps) => {
  if (displayMode) {
    return (
      <AnswerMultiDisplay
        className={`answer-display ${sceneAnswer.isCorrect ? "correct" : ""}`}
      >
        {sceneAnswer.content}
        <AnswerDisplaySvg />
      </AnswerMultiDisplay>
    );
  }

  return (
    <AnswerMultiButton
      key={sceneAnswer.id}
      disabled={submitted}
      onClick={() => onSubmit({ content: sceneAnswer.content })}
      fullWidth
    >
      {sceneAnswer.content}
    </AnswerMultiButton>
  );
};

const AnswerMultiButton = classed(Button, "mb-3");

const AnswerMultiDisplay = classed(
  AnswerDisplay,
  "text-center mb-3 border-dashed",
);
