import { useRef, forwardRef } from "react";
import { classed } from "@tw-classed/react";
import { Button } from "~/components";
import { Props as ScenePreviewProps } from "~/lib/packs/components/ScenePreview";
import { AnswerTypeSlugs, QuestionTypeSlugs } from "~/lib/game/gameUtils";
import { usePackStore, VisibleQATypeMenu } from "~/lib/packs/packStore";
import { useUpdateScene } from "~/lib/packs/useSceneActions";
import { useOnClickOutside } from "~/utils/element";

export const SceneQATypeMenu = ({ scene }: ScenePreviewProps) => {
  const ref = useRef(null);
  const { updateScene } = useUpdateScene(scene);
  const setQATypeMenu = usePackStore((state) => state.setVisibleQATypeMenu);
  const QATypeMenu = usePackStore((state) => state.visibleQATypeMenu);

  const onSelectType = (updatedScene = {}) => {
    setQATypeMenu(VisibleQATypeMenu.None);
    if (updatedScene) {
      updateScene(updatedScene);
    }
  };

  useOnClickOutside(ref, () => {
    setQATypeMenu(VisibleQATypeMenu.None);
  });

  switch (QATypeMenu) {
    case VisibleQATypeMenu.Question:
      return (
        <QuestionTypeMenu
          currentType={scene.questionType}
          onSelectType={onSelectType}
          ref={ref}
        />
      );
    case VisibleQATypeMenu.Answer:
      return (
        <AnswerTypeMenu
          currentType={scene.answerType}
          onSelectType={onSelectType}
          sceneAnswers={scene.answers}
          ref={ref}
        />
      );
    default:
      return null;
  }
};

type Props = {
  currentType: string;
  onSelectType: (scene: any) => void;
  sceneAnswers?: any[] | null;
};

// Maps question type to the default set of questions
const defaultQuestionsMap = {
  [QuestionTypeSlugs.text.id]: "Hello in there?",
  [QuestionTypeSlugs.image.id]: "/illustrations/pusheen.gif",
  [QuestionTypeSlugs.audio.id]: "/sounds/theme.mp3",
  [QuestionTypeSlugs.video.id]: "https://youtu.be/dQw4w9WgXcQ",
  [QuestionTypeSlugs.code.id]: JSON.stringify({
    code: "console.log('Hello World')",
    language: "javascript",
  }),
};

const QuestionTypeMenu = forwardRef<HTMLDivElement, Props>(
  function QuestionTypeMenu({ currentType, onSelectType }, ref) {
    return (
      <QATypeMenuContainer
        style={{ "--content": "Question type:" } as React.CSSProperties}
        ref={ref}
      >
        {Object.entries(QuestionTypeSlugs).map(([key, value]) => {
          return (
            <Button
              key={key}
              className={currentType === value.id ? "selected" : ""}
              onClick={() => {
                onSelectType(
                  currentType === value.id
                    ? false
                    : {
                      questionType: { slug: value.id },
                      question: defaultQuestionsMap[value.id],
                    }
                );
              }}
            >
              {value.display}
            </Button>
          );
        })}
      </QATypeMenuContainer>
    );
  }
);

// Maps answer type to the default set of answers
const defaultAnswersMap = {
  [AnswerTypeSlugs.text.id]: [],
  [AnswerTypeSlugs.multiText.id]: [
    { content: "", isCorrect: false },
    { content: "", isCorrect: false },
    { content: "", isCorrect: false },
  ],
  // [AnswerTypeSlugs.letterText.id]: [],
};

const AnswerTypeMenu = forwardRef<HTMLDivElement, Props>(
  function AnswerTypeMenu({ currentType, onSelectType, sceneAnswers }, ref) {
    return (
      <QATypeMenuContainer
        style={{ "--content": "Answer type:" } as React.CSSProperties}
        ref={ref}
      >
        {Object.entries(AnswerTypeSlugs).map(([key, value]) => {
          return (
            <Button
              key={key}
              className={currentType === value.id ? "selected" : ""}
              onClick={() => {
                const correct = sceneAnswers?.find((a) => a.isCorrect);
                onSelectType(
                  currentType === value.id
                    ? false
                    : {
                      answerType: { slug: value.id },
                      sceneAnswers: [
                        ...[correct || { content: "", isCorrect: true }],
                        ...defaultAnswersMap[value.id],
                      ],
                    }
                );
              }}
            >
              {value.display}
            </Button>
          );
        })}
      </QATypeMenuContainer>
    );
  }
);

export const QATypeMenuContainer = classed.div(
  "absolute top-[-50px] left-1/2 -translate-x-1/2 border-2 rounded-[50px] flex w-fit",
  "bg-white dark:bg-black [&_button]:border-none hover:[&_button]:border-none [&_button]:border-r-2 hover:[&_button]:border-r-2",
  "[&_button]:animate-none hover:[&_button]:animate-none [&_button]:transition-colors hover:[&_button]:transition-colors",
  "[&_button]:duration-100 hover:[&_button]:duration-100 [&_button]:ease-[ease] hover:[&_button]:ease-[ease]",
  "[&_button]:first:rounded-l-[30px] hover:[&_button]:first:rounded-l-[30px] [&_button]:last:rounded-r-[30px] hover:[&_button]:last:rounded-r-[30px]",
  "[&_button]:first:border-r-0 hover:[&_button]:first:border-r-0 [&_button.selected]:bg-purple-dark hover:[&_button.selected]:bg-purple-dark",
  "dark:[&_button.selected]:bg-purple dark:hover:[&_button.selected]:bg-purple [&_button.selected]:text-white",
  "hover:[&_button]:bg-grey-background dark:hover:[&_button]:bg-grey-dark",
  "after:absolute after:inline-black after:-top-4 after:left-1/2 after:-translate-x-1/2 after:w-[120px]",
  "after:text-center after:rounded-wavy after:p-1 after:text-[0.9rem] after:bg-white dark:after:bg-black",
  "after:content-[var(--content)]"
);
