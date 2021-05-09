import styled from "styled-components";
import { Box, AvatarImage, Button } from "components";
import { StepProps, GameState } from "features/game/gameSlice";
import { hashCode } from "utils/stringUtils";
import { Answer } from "features/game/components/Answer";
import correctSvg from "features/game/components/correct.svg";

export const Step2 = ({ state, broadcast, name }: StepProps) => {
  const [firstPlayer] = state.players;
  return (
    <section>
      <Submissions gameState={state} />
      {firstPlayer && (
        <Box textAlign="center">
          <Button
            disabled={firstPlayer.name !== name}
            onClick={() => broadcast("step:next")}
          >
            {firstPlayer.name === name
              ? "Next"
              : `Waiting for ${firstPlayer.name}`}
          </Button>
        </Box>
      )}
    </section>
  );
};

export const Step2Spectate = ({ state }: StepProps) => {
  return (
    <section>
      <Submissions gameState={state} />
    </section>
  );
};

const Submissions = ({ gameState }: { gameState: GameState }) => {
  return (
    <SubmissionsContainer>
      {gameState.sceneAnswers?.map((sceneAnswer) => {
        return (
          <div className="submission full" key={sceneAnswer.id}>
            {sceneAnswer.isCorrect && (
              <img className="correct" src={correctSvg} alt="Correct answer" />
            )}
            <Answer
              answerType={gameState.answerType}
              sceneAnswer={sceneAnswer}
              displayMode
            />
            <div className="endorsement-container">
              {gameState.submissions.map((submission) => {
                const avatar = hashCode(submission.name, 10);
                const show = submission.content === sceneAnswer.content;
                if (!show) return null;
                return (
                  <div className="endorsement" key={submission.id}>
                    <AvatarImage avatar={avatar} />
                    {submission.name}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </SubmissionsContainer>
  );
};

export const SubmissionsContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;

  .submission {
    display: inline-flex;
    position: relative;
    flex-direction: column;

    .correct {
      position: absolute;
      left: -20px;
      top: -20px;
      height: 60px;
    }

    > button {
      text-transform: uppercase;
      opacity: 1;
    }

    &.full {
      width: 100%;
      margin-bottom: ${({ theme }) => theme.spacings(2)};
    }
  }

  .endorsement-container {
    display: flex;
    flex-direction: row-reverse;
    transform: translateY(-20px);

    .endorsement {
      display: inline-flex;
      flex-direction: column;
      padding: 10px;
      background: ${({ theme }) => theme.ui.background};
      justify-content: center;
      align-items: center;
      border: 2px solid;
      border-radius: 100%;

      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
`;
