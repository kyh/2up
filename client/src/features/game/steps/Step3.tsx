import React from "react";
import { AvatarImage, Button } from "components";
import { StepProps } from "features/game/gameSlice";
import { hashCode } from "utils/stringUtils";
import { SubmissionsContainer } from "features/game/components/SubmissionsContainer";
import { Answer } from "features/game/components/Answer";
import correctSvg from "features/game/components/correct.svg";

export const Step3Remote = ({ state, broadcast, name }: StepProps) => {
  const firstPlayer = state.players[0];
  return (
    <section>
      <SubmissionsContainer>
        {state.submissions.map((submission) => {
          if (!submission.content) return null;
          const isRightAnswer = submission.content === state.answer;
          return (
            <div className="submission full" key={submission.id}>
              {isRightAnswer && (
                <img
                  className="correct"
                  src={correctSvg}
                  alt="Correct answer"
                />
              )}
              <Answer
                key={submission.id}
                answerType={`endorse_${state.answerType}`}
                answer={submission.content}
                onSubmit={() => {}}
                submitted
              />
              <div className="endorsement-container">
                {submission.endorsers.map((endorser) => {
                  const avatar = hashCode(endorser.name, 10);
                  return (
                    <div className="endorsement" key={endorser.id}>
                      <AvatarImage avatar={avatar} />
                      {endorser.name}
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
          onClick={() => broadcast("scene:next")}
        >
          {firstPlayer.name === name
            ? "Next"
            : `Waiting for ${firstPlayer.name}`}
        </Button>
      )}
    </section>
  );
};

export const Step3TV = ({ state }: StepProps) => {
  return (
    <section>
      <SubmissionsContainer>
        {state.submissions.map((submission) => {
          if (!submission.content) return null;
          const isRightAnswer = submission.content === state.answer;
          return (
            <div className="submission" key={submission.id}>
              {isRightAnswer && (
                <img
                  className="correct"
                  src={correctSvg}
                  alt="Correct answer"
                />
              )}
              <Answer
                key={submission.id}
                answerType={`endorse_${state.answerType}`}
                answer={submission.content}
                onSubmit={() => {}}
                submitted
              />
              <div className="endorsement-container">
                {submission.endorsers.map((endorser) => {
                  const avatar = hashCode(endorser.name, 10);
                  return (
                    <div className="endorsement" key={endorser.id}>
                      <AvatarImage avatar={avatar} />
                      {endorser.name}
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
