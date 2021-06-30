import styled from "styled-components";
import { theme } from "styles/theme";
import { QuestionTypeSlugs } from "features/game/gameSlice";
import { VideoPlayer, AudioPlayer } from "components";

type QuestionProps = {
  instruction: string;
  question: string;
  questionType: string;
};

export const Question = ({
  instruction,
  question,
  questionType,
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
          <QuestionAudio src={question} />
        </>
      );
    case QuestionTypeSlugs.video.id:
      return (
        <>
          <QuestionInstructions>{instruction}</QuestionInstructions>
          <QuestionVideo src={question} />
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

type PlayerProp = {
  src: string;
};

const QuestionAudio = ({ src }: PlayerProp) => {
  return (
    <PlayerContainer className="question">
      <AudioPlayer src={src} />
    </PlayerContainer>
  );
};

const QuestionVideo = ({ src }: PlayerProp) => {
  return (
    <PlayerContainer className="question">
      <VideoPlayer url={src} width="auto" height="auto" />
    </PlayerContainer>
  );
};

const PlayerContainer = styled.div`
  margin: 0 0 ${theme.spacings(5)};
`;
