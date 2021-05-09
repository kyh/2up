import { AvatarImage, Button } from "components";
import { StepProps } from "features/game/gameSlice";
import { hashCode } from "utils/stringUtils";
import { SubmissionsContainer } from "features/game/components/SubmissionsContainer";
import { Answer } from "features/game/components/Answer";
import correctSvg from "features/game/components/correct.svg";

export const Step2 = ({ state, broadcast, name }: StepProps) => {
  const [firstPlayer] = state.players;
  return (
    <section>
      <SubmissionsContainer>
        {state.sceneAnswers?.map((sceneAnswer) => {
          return (
            <div className="submission full" key={sceneAnswer.id}>
              {sceneAnswer.isCorrect && (
                <img
                  className="correct"
                  src={correctSvg}
                  alt="Correct answer"
                />
              )}
              <Answer
                answerType={state.answerType}
                sceneAnswer={sceneAnswer}
                onSubmit={() => {}}
                submitted
              />
              <div className="endorsement-container">
                {state.submissions.map((submission) => {
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
      {firstPlayer && (
        <Button
          disabled={firstPlayer.name !== name}
          onClick={() => broadcast("step:next")}
        >
          {firstPlayer.name === name
            ? "Next"
            : `Waiting for ${firstPlayer.name}`}
        </Button>
      )}
    </section>
  );
};

export const Step2Spectate = ({ state }: StepProps) => {
  return (
    <section>
      <SubmissionsContainer>
        {state.sceneAnswers?.map((sceneAnswer) => {
          return (
            <div className="submission full" key={sceneAnswer.id}>
              {sceneAnswer.isCorrect && (
                <img
                  className="correct"
                  src={correctSvg}
                  alt="Correct answer"
                />
              )}
              <Answer
                answerType={state.answerType}
                sceneAnswer={sceneAnswer}
                onSubmit={() => {}}
                submitted
              />
              <div className="endorsement-container">
                {state.submissions.map((submission) => {
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
    </section>
  );
};
