import styled from "styled-components";
import { theme } from "styles/theme";
import { QuestionTypeSlugs } from "features/game/gameSlice";
import { VideoPlayer, AudioPlayer, Code } from "components";

type QuestionProps = {
  instruction: string;
  question: string;
  questionType: string;
  displayMode?: boolean;
};

export const Question = ({
  instruction,
  question,
  questionType,
  displayMode = false,
}: QuestionProps) => {
  switch (questionType) {
    case QuestionTypeSlugs.image.id:
      return (
        <>
          <QuestionInstructions>{instruction}</QuestionInstructions>
          <QuestionImage
            className="question"
            alt={instruction}
            src={question}
          />
        </>
      );
    case QuestionTypeSlugs.audio.id:
      return (
        <>
          <QuestionInstructions>{instruction}</QuestionInstructions>
          <QuestionAudio question={question} displayMode={displayMode} />
        </>
      );
    case QuestionTypeSlugs.video.id:
      return (
        <>
          <QuestionInstructions>{instruction}</QuestionInstructions>
          <QuestionVideo question={question} displayMode={displayMode} />
        </>
      );
    case QuestionTypeSlugs.code.id:
      return (
        <>
          <QuestionInstructions>{instruction}</QuestionInstructions>
          <QuestionCode question={question} displayMode={displayMode} />
        </>
      );
    default:
      return (
        <>
          <QuestionInstructions>{instruction}</QuestionInstructions>
          <QuestionText className="question">{question}</QuestionText>
        </>
      );
  }
};

const QuestionInstructions = styled.div`
  text-align: center;
  margin: 0 0 ${theme.spacings(2)};
`;

const QuestionText = styled.h1`
  text-align: center;
  margin: 0 0 ${theme.spacings(5)};
`;

const QuestionImage = styled.img`
  object-fit: contain;
  margin: 0 0 ${theme.spacings(5)};
  max-width: 100vw;
  height: 240px;

  ${theme.breakpoints.desktop} {
    max-width: 40vw;
  }
`;

type QuestionComponentProp = {
  question: string;
  displayMode: boolean;
};

const QuestionAudio = ({ question, displayMode }: QuestionComponentProp) => {
  return (
    <QuestionContainer className="question">
      <AudioPlayer src={question} autoPlay={!displayMode} loop />
    </QuestionContainer>
  );
};

const QuestionVideo = ({ question, displayMode }: QuestionComponentProp) => {
  return (
    <QuestionContainer className="question">
      <VideoPlayer
        url={question}
        width="auto"
        height="auto"
        config={{
          youtube: {
            playerVars: {
              showinfo: displayMode ? 0 : 1,
              disablekb: 1,
              loop: 1,
              modestbranding: 1,
            },
          },
        }}
      />
    </QuestionContainer>
  );
};

const QuestionCode = ({ question }: QuestionComponentProp) => {
  return (
    <QuestionContainer className="question">
      <Code content={question} />
    </QuestionContainer>
  );
};

const QuestionContainer = styled.div`
  margin: 0 0 ${theme.spacings(5)};
`;
