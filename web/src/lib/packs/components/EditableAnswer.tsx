import { ChangeEvent } from "react";
import { classed } from "@tw-classed/react";
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
                {/* Delete */}
                {sceneAnswers.length > 1 && (
                  <button
                    className="absolute right-1"
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
            className='mb-1'
              onClick={onAddSceneAnswer}
              disabled={sceneAnswers.length > 3}
            >
              + Add Option
            </Button>
            <button
            className='mb-1'
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

const AnswerContainer = classed.div("flex flex-col items-center");

const Grid = classed.div("grid grid-cols-2 gap-3");

const InputContainer = classed.div("relative flex justify-center items-center mb-3");


const AddOptionContainer = classed(InputContainer, "flex-col");
