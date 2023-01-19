import { useState, SyntheticEvent } from "react";
import styled from "styled-components";
import { theme } from "styles/theme";
import { Input, Button } from "components";
import { AnswerTypeSlugs } from "lib/game/gameUtils";
import type { StepProps } from "lib/game/steps/types";

type AnswerProps = {
  sceneAnswer: StepProps["gameState"]["sceneAnswers"][0];
  answerType: StepProps["gameState"]["answerType"];
  submitted: boolean;
  onSubmit: (
    submission: Pick<StepProps["gameState"]["submissions"][0], "content">
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

const AnswerDisplay = styled.div`
  overflow: hidden;
  position: relative;
  padding: ${theme.spacings(4)};
  border-image-slice: 4 4 3 5 fill;
  border-image-width: 5px;
  border-image-outset: 0;
  border-image-repeat: stretch stretch;

  > svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    content: "";
    z-index: -1;
    pointer-events: none;
    fill: none;

    > path {
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
    }
  }
`;

const AnswerDisplaySvg = () => (
  <svg width="100%" height="9" viewBox="0 0 101 9">
    <path
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

const AnswerTextDisplay = styled(AnswerDisplay)`
  border-width: 2px;
  border-style: inset;
  border-image-source: ${theme.ui.inputBorderUrl};
`;

const AnswerTextForm = styled.form`
  text-align: center;
  width: 100%;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${theme.spacings(3)};
`;

const AnswerMulti = ({
  sceneAnswer,
  submitted,
  onSubmit,
  displayMode,
}: AnswerProps) => {
  if (displayMode) {
    return (
      <AnswerMultiDisplay
        className={`answer-display answer-multi ${
          sceneAnswer.isCorrect ? "correct" : ""
        }`}
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

const AnswerMultiButton = styled(Button)`
  margin-bottom: ${theme.spacings(3)};
`;

const AnswerMultiDisplay = styled(AnswerDisplay)`
  text-align: center;
  margin-bottom: ${theme.spacings(3)};
  border-image-source: ${theme.ui.buttonBorderUrl};
`;
