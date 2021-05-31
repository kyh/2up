import styled from "styled-components";
import { theme } from "styles/theme";
import { StepProps, GameState, SceneAnswer } from "features/game/gameSlice";
import { Answer } from "features/game/components/Answer";
import correctSvg from "features/game/components/correct.svg";
import {
  Player,
  PlayersGrid,
  NextButton,
} from "features/game/components/PlayerGrid";
import { AnimationSprite } from "components";

const isCorrect = (sceneAnswer: SceneAnswer) => sceneAnswer.isCorrect;

export const Step2 = ({ gameState, broadcast, name }: StepProps) => {
  const [firstPlayer] = gameState.players;
  // We only support single answers for now
  const correctAnswer = gameState.sceneAnswers?.find(isCorrect)!;
  return (
    <>
      <AnswerResult gameState={gameState} sceneAnswer={correctAnswer} />
      <Submissions gameState={gameState} sceneAnswer={correctAnswer} />
      {firstPlayer && (
        <NextButton
          disabled={firstPlayer.name !== name}
          onClick={() => broadcast("step:next")}
          autoFocus
        >
          {firstPlayer.name === name
            ? "Next"
            : `Waiting for ${firstPlayer.name}`}
        </NextButton>
      )}
    </>
  );
};

export const Step2Spectate = ({ gameState }: StepProps) => {
  const correctAnswer = gameState.sceneAnswers?.find(isCorrect)!;
  return (
    <>
      <AnswerResult gameState={gameState} sceneAnswer={correctAnswer} />
      <Submissions gameState={gameState} sceneAnswer={correctAnswer} />
    </>
  );
};

type SubmissionProps = {
  gameState: GameState;
  sceneAnswer: SceneAnswer;
};

const AnswerResult = ({ gameState, sceneAnswer }: SubmissionProps) => {
  return (
    <AnswerContainer>
      <h4 className="title">Correct Answer</h4>
      <Answer
        sceneAnswer={sceneAnswer}
        answerType={gameState.answerType}
        onSubmit={() => {}}
        submitted
        displayMode
      />
    </AnswerContainer>
  );
};

const AnswerContainer = styled.div`
  margin-bottom: ${theme.spacings(5)};
  .title {
    text-align: center;
  }
`;

const Submissions = ({ gameState, sceneAnswer }: SubmissionProps) => {
  const players = gameState.submissions.map((submission) => {
    const isCorrect =
      submission.content.toLowerCase() === sceneAnswer.content.toLowerCase();
    return (
      <Player
        key={submission.name}
        playerName={submission.name}
        playerContent={`: "${submission.content}"`}
      >
        {isCorrect && (
          <>
            <img className="correct" src={correctSvg} alt="Correct answer" />
            <Stars name="blinkingStars2" />
          </>
        )}
      </Player>
    );
  });

  return <SubmissionsContainer>{players}</SubmissionsContainer>;
};

const SubmissionsContainer = styled(PlayersGrid)`
  margin-bottom: ${theme.spacings(5)};
  .correct {
    position: absolute;
    width: 50px;
    top: ${theme.spacings(-3)};
    left: 0;
  }
  .name {
    text-align: center;
  }
  ${theme.breakpoints.desktop} {
    margin-bottom: 0;
  }
`;

const Stars = styled(AnimationSprite)`
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  ${theme.breakpoints.desktop} {
    top: 0;
  }
`;
