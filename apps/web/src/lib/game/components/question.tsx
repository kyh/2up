import { classed } from "@/lib/utils/classed";
import { QuestionTypeSlugs } from "@/lib/game/game-utils";
import { VideoPlayer, AudioPlayer, Code } from "@/components";
import type { StepProps } from "@/lib/game/steps/types";

type QuestionProps = {
  question: string;
  questionType: StepProps["gameState"]["questionType"];
  displayMode?: boolean;
};

export const Question = ({
  question,
  questionType,
  displayMode = false,
}: QuestionProps) => {
  switch (questionType) {
    case QuestionTypeSlugs.image.id:
      return <QuestionImage question={question} displayMode={displayMode} />;
    case QuestionTypeSlugs.audio.id:
      return <QuestionAudio question={question} displayMode={displayMode} />;
    case QuestionTypeSlugs.video.id:
      return <QuestionVideo question={question} displayMode={displayMode} />;
    case QuestionTypeSlugs.code.id:
      return <QuestionCode question={question} displayMode={displayMode} />;
    default:
      return <QuestionText question={question} displayMode={displayMode} />;
  }
};

type QuestionComponentProp = {
  question: string;
  displayMode: boolean;
};

const QuestionText = ({ question }: QuestionComponentProp) => {
  return (
    <QuestionContainer className="question">
      <Text>{question}</Text>
    </QuestionContainer>
  );
};

const Text = classed.h1("text-center m-0");

const QuestionImage = ({ question }: QuestionComponentProp) => {
  return (
    <QuestionContainer className="question">
      <Image src={question} alt="image" />
    </QuestionContainer>
  );
};

const Image = classed.img(
  "object-contain max-w-[100vw] h-[240px] desktop:max-w-[40vw]",
);

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

export const Container = classed.div(
  "flex justify-center items-center w-full mb-5",
);

const QuestionContainer = classed(Container, "h-[240px] text-3xl font-bold");
