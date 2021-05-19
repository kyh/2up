import styled from "styled-components";
import { Avatar, Button } from "components";
import { StepProps, GameState } from "features/game/gameSlice";
import { Answer } from "features/game/components/Answer";
import correctSvg from "features/game/components/correct.svg";

export const Step2 = ({ state, broadcast, name }: StepProps) => {
  const [firstPlayer] = state.players;
  return (
    <section>
      <Submissions gameState={state} />
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
          <div className="submission" key={sceneAnswer.id}>
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
                const show = submission.content === sceneAnswer.content;
                if (!show) return null;
                return (
                  <div className="endorsement" key={submission.id}>
                    <Avatar name={submission.name} />
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
    width: 100%;
    margin-bottom: ${({ theme }) => theme.spacings(2)};
    .correct {
      position: absolute;
      left: -20px;
      top: -20px;
      height: 60px;
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

const NextButtonContainer = styled.div`
  text-align: center;
`;
