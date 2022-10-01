import { ChangeEvent } from "react";
import styled from "styled-components";
import { theme } from "~/styles/theme";
import { Input, SingleLetterInput, Checkbox, Button, Icon } from "~/components";
import { usePackStore, VisibleQATypeMenu } from "~/lib/packs/packStore";
import { getRandomAnswer } from "~/lib/packs/packUtils";
import { AnswerTypeSlugs } from "~/lib/game/gameUtils";

type EditableAnswerProps = {
  sceneId: string;
  answerType: string;
  sceneAnswers: any[];
  onChange: (scene: any) => void;
};

export const EditableAnswer = ({
  sceneId,
  sceneAnswers,
  answerType,
  onChange,
}: EditableAnswerProps) => {
  const [sceneAnswer] = sceneAnswers;
  const setVisibleQATypeMenu = usePackStore(
    (state) => state.setVisibleQATypeMenu
  );

  const onFocus = () => {
    setVisibleQATypeMenu(VisibleQATypeMenu.Answer);
  };

  const onChangeSceneAnswer = (updatedSceneAnswer = {}, index: number = 0) => {
    const updatedSceneAnswers = [...sceneAnswers];
    updatedSceneAnswers[index] = updatedSceneAnswer;
    onChange({
      sceneAnswers: updatedSceneAnswers,
    });
  };

  const onAddRandomSceneAnswer = () => {
    const randomAnswer = getRandomAnswer();
    onChange({
      sceneAnswers: [
        ...sceneAnswers,
        { isCorrect: false, content: randomAnswer.content },
      ],
    });
  };

  const onAddSceneAnswer = () => {
    onChange({
      sceneAnswers: [...sceneAnswers, { isCorrect: false, content: "" }],
    });
  };

  const onDeleteSceneAnswer = (id: string) => {
    onChange({
      sceneAnswers: sceneAnswers.filter((sa) => sa.id !== id),
    });
  };

  switch (answerType) {
    case AnswerTypeSlugs.multiText.id:
      return (
        <AnswerContainer key={sceneId}>
          <Grid>
            {sceneAnswers.map((sceneAnswer, index) => (
              <InputContainer key={index}>
                <Checkbox
                  name="correct"
                  value={index}
                  checked={sceneAnswer.isCorrect}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    onChangeSceneAnswer({ isCorrect: e.target.checked }, index)
                  }
                  disabled={
                    sceneAnswer.isCorrect &&
                    sceneAnswers.filter((a) => a.isCorrect).length < 2
                  }
                />
                <Input
                  defaultValue={sceneAnswer.content || ""}
                  onFocus={onFocus}
                  onBlur={(e) =>
                    onChangeSceneAnswer({ content: e.target.value }, index)
                  }
                />
                {sceneAnswers.length > 1 && (
                  <button
                    className="delete"
                    onClick={() => onDeleteSceneAnswer(sceneAnswer.id)}
                  >
                    <Icon icon="trash" />
                  </button>
                )}
              </InputContainer>
            ))}
          </Grid>
          <AddOptionContainer>
            <Button
              onClick={onAddSceneAnswer}
              disabled={sceneAnswers.length > 3}
            >
              + Add Option
            </Button>
            <button
              onClick={onAddRandomSceneAnswer}
              disabled={sceneAnswers.length > 3}
            >
              + random answer
            </button>
          </AddOptionContainer>
        </AnswerContainer>
      );
    // case AnswerTypeSlugs.letterText.id:
    //   return (
    //     <AnswerContainer key={sceneId}>
    //       <InputContainer>
    //         <Input
    //           defaultValue={sceneAnswer?.content || ""}
    //           onFocus={onFocus}
    //           onBlur={(e) =>
    //             onChangeSceneAnswer({
    //               content: e.target.value,
    //               isCorrect: true,
    //             })
    //           }
    //         />
    //       </InputContainer>
    //       <InputContainer>
    //         <SingleLetterInput value={sceneAnswer?.content || ""} />
    //       </InputContainer>
    //       <Button disabled>Submit answer</Button>
    //     </AnswerContainer>
    //   );
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
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${theme.spacings(3)};
  /* Multi */
  .delete {
    position: absolute;
    right: ${theme.spacings(1)};
  }
`;

const AddOptionContainer = styled(InputContainer)`
  flex-direction: column;

  > button {
    margin-bottom: ${theme.spacings(1)};
  }
`;
