import { CSSProperties } from "react";
import styled from "styled-components";
import { theme } from "styles/theme";
import { QuestionTypeSlugs } from "features/game/gameSlice";
import ReactPlayer from "react-player/lazy";

type QuestionProps = {
  instruction: string;
  question: string;
  questionType: string;
  videoStyle?: CSSProperties;
};

export const Question = ({
  instruction,
  question,
  questionType,
  videoStyle,
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
          <QuestionVideo src={question} style={videoStyle} />
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

const QuestionAudio = ({ src }: { src: string }) => {
  return null;
};

type QuestionVideoProp = {
  src: string;
  style?: CSSProperties;
};

const QuestionVideo = ({ src, style }: QuestionVideoProp) => {
  return (
    <QuestionVideoContainer className="question">
      <ReactPlayer
        url={src}
        style={style}
        width={style?.width}
        height={style?.height}
      />
    </QuestionVideoContainer>
  );
};

const QuestionVideoContainer = styled.div`
  margin: 0 0 ${theme.spacings(5)};
`;
