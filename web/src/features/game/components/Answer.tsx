import { useState, SyntheticEvent } from "react";
import styled, { css } from "styled-components";
import { theme } from "styles/theme";
import { Input, Button } from "components";
import {
  SceneAnswer,
  Submission,
  AnswerTypeSlugs,
} from "features/game/gameSlice";

type AnswerProps = {
  sceneAnswer: SceneAnswer;
  answerType: string;
  submitted: boolean;
  onSubmit: (submission: Pick<Submission, "content">) => void;
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

const getDisplayClassName = (isCorrect: boolean) => {
  return `display-text ${isCorrect ? "correct" : ""}`;
};

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
      <AnswerTextDisplay className={getDisplayClassName(sceneAnswer.isCorrect)}>
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

const AnswerTextDisplay = styled.div`
  border-image-slice: 4 4 3 5 fill;
  border-image-width: 5px;
  border-image-outset: 0;
  border-image-repeat: stretch stretch;
  border-image-source: ${theme.ui.inputBorderUrl};
  padding: ${theme.spacings(4)};
  color: ${theme.ui.buttonText};
  background-color: ${theme.ui.buttonBackground};
  width: 100%;
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
        className={getDisplayClassName(sceneAnswer.isCorrect)}
      >
        {sceneAnswer.content}
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

const AnswerMultiDisplay = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacings(3)};
  padding: ${theme.spacings(4)};
  border-image-slice: 4 4 3 5 fill;
  border-image-width: 5px;
  border-image-outset: 0;
  border-image-repeat: stretch stretch;
  border-image-source: ${theme.ui.buttonBorderUrl};
`;
