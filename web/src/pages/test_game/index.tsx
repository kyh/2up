import { ReactNode, useState } from "react";
import { Navigation } from "features/game/components/Navigation";
import { GamePage } from "features/game/GameLayout";
import { Step0 } from "features/game/steps/Step0";
import { Step1 } from "features/game/steps/Step1";
import { Step2 } from "features/game/steps/Step2";
import { Step3 } from "features/game/steps/Step3";

const dummySteps = {
  0: {
    gameId: "9584",
    scene: 0,
    step: 0,
    instruction: "clickz",
    question: "what is caaa",
    questionType: "text",
    sceneAnswers: [
      {
        content: "sojuiii",
        id: "173",
        isCorrect: true,
      },
    ],
    answerType: "text",
    submissions: [],
    pack: "Test pack",
    totalScenes: 6,
    duration: 45000,
    durationInSeconds: 45,
    startTime: 0,
    players: [
      {
        isSpectator: false,
        name: "kai",
        phx_ref: "FpiU-zCpieQZ-5-B",
        prevScore: 0,
        score: 0,
      },
    ],
    invitedToGame: undefined,
  },
  1: {
    gameId: "9584",
    scene: 1,
    step: 1,
    instruction: "clickz",
    question: '{"code":"console.log(\'Hello World\')","language":"javascript"}',
    questionType: "code",
    sceneAnswers: [
      {
        content: "boy",
        id: "1651",
        isCorrect: false,
      },
      {
        content: "ape",
        id: "1650",
        isCorrect: true,
      },
    ],
    answerType: "multi_text",
    submissions: [],
    pack: "Test pack",
    totalScenes: 6,
    duration: 45000,
    durationInSeconds: 45,
    startTime: 1628215074208,
    players: [
      {
        isSpectator: false,
        name: "kai",
        phx_ref: "FpiU-zCpieQZ-5-B",
        prevScore: 0,
        score: 0,
      },
    ],
    invitedToGame: undefined,
  },
  2: {
    gameId: "9584",
    scene: 1,
    step: 2,
    instruction: "clickz",
    question: '{"code":"console.log(\'Hello World\')","language":"javascript"}',
    questionType: "code",
    sceneAnswers: [
      {
        content: "boy",
        id: "1651",
        isCorrect: false,
      },
      {
        content: "ape",
        id: "1650",
        isCorrect: true,
      },
    ],
    answerType: "multi_text",
    submissions: [
      {
        content: "ape",
        name: "kai",
      },
      {
        content: "cat",
        name: "andrew",
      },
      {
        content: "dog",
        name: "john",
      },
      {
        content: "ape",
        name: "matt",
      },
      {
        content: "ape",
        name: "chris",
      },
      {
        content: "a long answer",
        name: "joe",
      },
      {
        content: "lol",
        name: "tina",
      },
    ],
    pack: "Test pack",
    totalScenes: 6,
    duration: 45000,
    durationInSeconds: 45,
    startTime: 1628215074208,
    players: [
      {
        isSpectator: false,
        name: "kai",
        phx_ref: "FpibohWn9JUZ-6Ch",
        prevScore: 0,
        score: 0,
      },
    ],
    invitedToGame: undefined,
  },
};

const Game = () => {
  const [gameState, setGameState] = useState<any>(dummySteps[1]);
  const dispatch = () => {};
  const broadcast = (key: string) => {
    if (key === "submit") {
      setGameState(dummySteps[2]);
    } else {
      setGameState(dummySteps[1]);
    }
  };
  const name = "kai";

  const props = { gameState, broadcast, dispatch, name };

  switch (gameState.step) {
    case 0:
      return <Step0 {...props} />;
    case 1:
      return <Step1 {...props} />;
    case 2:
      return <Step2 {...props} />;
    case 3:
      return <Step3 {...props} />;
    default:
      return null;
  }
};

const getLayout = (page: ReactNode) => (
  <>
    <Navigation />
    <GamePage>{page}</GamePage>
  </>
);

Game.getLayout = getLayout;

export default Game;
