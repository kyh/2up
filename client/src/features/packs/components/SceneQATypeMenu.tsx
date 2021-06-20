import styled from "styled-components";
import { useReactiveVar } from "@apollo/client";
import { theme } from "styles/theme";
import { Button } from "components";
import { Props as ScenePreviewProps } from "features/packs/components/ScenePreview";
import { useUpdateScene } from "features/packs/components/hooks";
import {
  visibleQATypeMenuVar,
  VisibleQATypeMenu,
} from "features/packs/components/cache";
import { AnswerTypeSlugs, QuestionTypeSlugs } from "features/game/gameSlice";

export const SceneQATypeMenu = ({ scene }: ScenePreviewProps) => {
  const { updateScene } = useUpdateScene({ scene });
  const openMenu = useReactiveVar(visibleQATypeMenuVar);

  const onSelectType = (updatedScene = {}) => {
    visibleQATypeMenuVar(VisibleQATypeMenu.None);
    updateScene(updatedScene);
  };

  switch (openMenu) {
    case VisibleQATypeMenu.Question:
      return (
        <QuestionTypeMenu
          currentType={scene.questionType.slug}
          onSelectType={onSelectType}
        />
      );
    case VisibleQATypeMenu.Answer:
      return (
        <AnswerTypeMenu
          currentType={scene.answerType.slug}
          onSelectType={onSelectType}
        />
      );
    default:
      return null;
  }
};

type Props = {
  currentType: string;
  onSelectType: (_updatedScene: any) => void;
};

const QuestionTypeMenu = ({ currentType, onSelectType }: Props) => {
  return (
    <QATypeMenuContainer content="Question type:">
      {Object.entries(QuestionTypeSlugs).map(([key, value]) => {
        return (
          <Button
            key={key}
            className={currentType === value.id ? "selected" : ""}
            onClick={() => {
              onSelectType({
                questionType: { slug: value.id },
                question: value.content,
              });
            }}
          >
            {value.display}
          </Button>
        );
      })}
    </QATypeMenuContainer>
  );
};

const AnswerTypeMenu = ({ currentType, onSelectType }: Props) => {
  return (
    <QATypeMenuContainer content="Answer type:">
      {Object.entries(AnswerTypeSlugs).map(([key, value]) => {
        return (
          <Button
            key={key}
            className={currentType === value.id ? "selected" : ""}
            onClick={() => {
              onSelectType({
                answerType: { slug: value.id },
                sceneAnswers: [],
              });
            }}
          >
            {value.display}
          </Button>
        );
      })}
    </QATypeMenuContainer>
  );
};

export const QATypeMenuContainer = styled.div<{ content: string }>`
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  border: 2px solid;
  border-radius: 50px;
  background: ${theme.ui.background};
  display: flex;

  > button,
  > button:hover {
    border: none;
    border-right: 2px solid;

    &:first-child {
      border-top-left-radius: 30px;
      border-bottom-left-radius: 30px;
    }

    &:last-child {
      border-right: none;
      border-top-right-radius: 30px;
      border-bottom-right-radius: 30px;
    }

    &.selected {
      background-color: ${theme.colors.purple};
    }
  }

  &:after {
    position: absolute;
    content: "${({ content }) => content}";
    display: inline-block;
    top: ${theme.spacings(-4)};
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    text-align: center;
    background: ${theme.ui.background};
    border-radius: ${theme.ui.borderWavyRadius};
    font-size: 0.9rem;
    padding: 4px;
  }
`;
