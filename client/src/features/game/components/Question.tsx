import styled from "styled-components";

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
    case "image":
      return (
        <>
          <QuestionInstructions>{instruction}</QuestionInstructions>
          <QuestionImage alt={instruction} src={question} />
        </>
      );
    default:
      return (
        <>
          <QuestionInstructions>{instruction}</QuestionInstructions>
          <QuestionText>{question}</QuestionText>
        </>
      );
  }
};

const QuestionInstructions = styled.div`
  text-align: center;
  margin: 0 0 ${({ theme }) => theme.spacings(2)};
`;

const QuestionText = styled.h1`
  text-align: center;
  margin: 0 0 ${({ theme }) => theme.spacings(5)};
`;

const QuestionImage = styled.img`
  object-fit: cover;
  margin: 0 0 ${({ theme }) => theme.spacings(5)};
`;
