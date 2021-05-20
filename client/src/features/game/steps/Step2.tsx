import styled from "styled-components";
import { Button } from "components";
import { StepProps, GameState, SceneAnswer } from "features/game/gameSlice";
import { Answer } from "features/game/components/Answer";
import correctSvg from "features/game/components/correct.svg";
import {
  Player,
  PlayersGrid,
  PlayersRow,
} from "features/game/components/PlayerGrid";

const isCorrect = (sceneAnswer: SceneAnswer) => sceneAnswer.isCorrect;

export const Step2 = ({ gameState, broadcast, name }: StepProps) => {
  const [firstPlayer] = gameState.players;
  // We only support single answers for now
  const correctAnswer = gameState.sceneAnswers?.find(isCorrect)!;
  return (
    <Container>
      <AnswerResult gameState={gameState} sceneAnswer={correctAnswer} />
      <Submissions gameState={gameState} sceneAnswer={correctAnswer} />
      {firstPlayer && (
        <NextButtonContainer>
          <Button
            disabled={firstPlayer.name !== name}
            onClick={() => broadcast("step:next")}
          >
            {firstPlayer.name === name
              ? "Next"
              : `Waiting for ${firstPlayer.name}`}
          </Button>
        </NextButtonContainer>
      )}
    </Container>
  );
};

export const Step2Spectate = ({ gameState }: StepProps) => {
  const correctAnswer = gameState.sceneAnswers?.find(isCorrect)!;
  return (
    <Container>
      <AnswerResult gameState={gameState} sceneAnswer={correctAnswer} />
      <Submissions gameState={gameState} sceneAnswer={correctAnswer} />
    </Container>
  );
};

const Container = styled.div`
  .answer-container {
    margin-bottom: ${({ theme }) => theme.spacings(5)};
    .title {
      text-align: center;
    }
  }
`;

type Props = {
  gameState: GameState;
  sceneAnswer: SceneAnswer;
};

const AnswerResult = ({ gameState, sceneAnswer }: Props) => {
  return (
    <div className="answer-container">
      <h4 className="title">Correct Answer</h4>
      <Answer
        answerType={gameState.answerType}
        sceneAnswer={sceneAnswer}
        displayMode
      />
    </div>
  );
};

const Submissions = ({ gameState, sceneAnswer }: Props) => {
  const players = gameState.submissions.map((submission) => {
    const isCorrect = submission.content === sceneAnswer.content;
    return (
      <Player
        key={submission.id}
        playerName={submission.name}
        playerContent={`: "${submission.content}"`}
        isHost={gameState.isHost}
      >
        {isCorrect && (
          <img className="correct" src={correctSvg} alt="Correct answer" />
        )}
      </Player>
    );
  });

  if (gameState.isHost) {
    return (
      <SpectatorSubmissionsContainer>{players}</SpectatorSubmissionsContainer>
    );
  }

  return <SubmissionsContainer>{players}</SubmissionsContainer>;
};

const SubmissionsContainer = styled(PlayersGrid)`
  margin-bottom: ${({ theme }) => theme.spacings(5)};
  .correct {
    position: absolute;
    width: 50px;
    top: ${({ theme }) => theme.spacings(-3)};
    left: 0;
  }
  .name {
    text-align: center;
  }
`;

const SpectatorSubmissionsContainer = styled(PlayersRow)``;

const NextButtonContainer = styled.div`
  text-align: center;
`;
