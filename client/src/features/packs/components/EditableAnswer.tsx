import { ChangeEvent } from "react";
import styled from "styled-components";
import produce from "immer";
import { theme } from "styles/theme";
import { Input, SingleLetterInput, Checkbox, Button } from "components";
import {
  VisibleQATypeMenu,
  visibleQATypeMenuVar,
} from "features/packs/sceneService";
import { AnswerTypeSlugs } from "features/game/gameSlice";

import { ScenePreviewFragment_sceneAnswers } from "./__generated__/ScenePreviewFragment";

type EditableAnswerProps = {
  sceneId: string;
  answerType: string;
  sceneAnswers: ScenePreviewFragment_sceneAnswers[];
  onChange: (scene: any) => void;
};

export const EditableAnswer = ({
  sceneId,
  sceneAnswers,
  answerType,
  onChange,
}: EditableAnswerProps) => {
  const [sceneAnswer] = sceneAnswers;

  const onFocus = () => {
    visibleQATypeMenuVar(VisibleQATypeMenu.Answer);
  };

  const onChangeSceneAnswer = (updatedSceneAnswer = {}, index: number = 0) => {
    onChange({
      sceneAnswers: produce(sceneAnswers, (draft) => {
        draft[index] = { ...draft[index], ...updatedSceneAnswer };
      }),
    });
  };

  const onAddSceneAnswer = () => {
    onChange({
      sceneAnswers: [...sceneAnswers, { isCorrect: false, content: "" }],
    });
  };

  switch (answerType) {
    case AnswerTypeSlugs.multiText.id:
      return (
        <AnswerContainer key={sceneId}>
          <Grid>
            {sceneAnswers.map((sceneAnswer, index) => (
              <InputContainer key={sceneAnswer.id}>
                <Checkbox
                  name="correct"
                  value={index}
                  checked={sceneAnswer.isCorrect}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onChangeSceneAnswer({ isCorrect: e.target.checked }, index)
                  }
                />
                <Input
                  defaultValue={sceneAnswer.content || ""}
                  onFocus={onFocus}
                  onBlur={(e) =>
                    onChangeSceneAnswer({ content: e.target.value }, index)
                  }
                />
              </InputContainer>
            ))}
          </Grid>
          <InputContainer>
            <Button onClick={onAddSceneAnswer}>+ Add Option</Button>
          </InputContainer>
        </AnswerContainer>
      );
    case AnswerTypeSlugs.letter.id:
      return (
        <AnswerContainer key={sceneId}>
          <InputContainer>
            <Input
              defaultValue={sceneAnswer?.content || ""}
              onFocus={onFocus}
              onBlur={(e) =>
                onChangeSceneAnswer({
                  content: e.target.value,
                  isCorrect: true,
                })
              }
            />
            <SingleLetterInput defaultValue={sceneAnswer?.content || ""} />
          </InputContainer>
          <Button disabled>Submit answer</Button>
        </AnswerContainer>
      );
    // "text"
    default:
      return (
        <AnswerContainer key={sceneId}>
          <InputContainer>
            <Input
              defaultValue={sceneAnswer?.content || ""}
              onFocus={onFocus}
              onBlur={(e) =>
                onChangeSceneAnswer({
                  content: e.target.value,
                  isCorrect: true,
                })
              }
            />
          </InputContainer>
          <Button disabled>Submit answer</Button>
        </AnswerContainer>
      );
  }
};

const AnswerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, max-content);
  grid-column-gap: ${theme.spacings(3)};
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${theme.spacings(3)};
`;
