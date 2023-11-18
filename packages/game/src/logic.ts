import type {
  AnswerType,
  Player,
  QuestionType,
  Scene,
  SceneAnswer,
} from "@prisma/client";

export type GameState = {
  currentStep: number;
  currentScene: number;
  submissions: Submission[];
  totalScenes: number;
  duration: number;
  startTime: number;
  playerScores: PlayerScore[];

  questionDescription: Scene["questionDescription"];
  question: Scene["question"];
  questionType: QuestionType;
  answerType: AnswerType;
  sceneAnswers: Omit<SceneAnswer, "sceneId" | "updatedAt" | "createdAt">[];
};

export type Submission = {
  playerId: Player["userId"];
  playerName: Player["name"];
  content: string;
  isCorrect?: boolean;
};

export type PlayerScore = {
  playerId: Player["userId"];
  playerName: Player["name"];
  prevScore: number;
  score: number;
};

export type LivePlayer = Pick<Player, "userId" | "name">;

// util for easy adding logs
// const addLog = (message: string, logs: GameState["log"]): GameState["log"] => {
//   return [{ dt: new Date().getTime(), message: message }, ...logs].slice(
//     0,
//     MAX_LOG_SIZE,
//   );
// };

// // If there is anything you want to track for a specific user, change this interface
// export type User = {
//   id: string;
// };

// // Every game has a list of users and log of actions
// type BaseGameState = {
//   users: User[];
//   log: {
//     dt: number;
//     message: string;
//   }[];
// };

// export type Action = DefaultAction | GameAction;

// export type ServerAction = WithUser<DefaultAction> | WithUser<GameAction>;

// // The maximum log size, change as needed
// const MAX_LOG_SIZE = 4;

// type WithUser<T> = T & { user: User };

// export type DefaultAction = { type: "userEntered" } | { type: "userExit" };

// export type GameState = BaseGameState & {
//   target: number;
// };

// // This is how a fresh new game starts out, it's a function so you can make it dynamic!
// // In the case of the guesser game we start out with a random target
// export const initialGame = () => ({
//   users: [],
//   target: Math.floor(Math.random() * 100),
//   log: addLog("Game Created!", []),
// });

// // Here are all the actions we can dispatch for a user
// type GameAction = { type: "guess"; guess: number };

// export const gameUpdater = (
//   action: ServerAction,
//   state: GameState,
// ): GameState => {
//   switch (action.type) {
//     case "userEntered":
//       return {
//         ...state,
//         users: [...state.users, action.user],
//         log: addLog(`user ${action.user.id} joined 🎉`, state.log),
//       };

//     case "userExit":
//       return {
//         ...state,
//         users: state.users.filter((user) => user.id !== action.user.id),
//         log: addLog(`user ${action.user.id} left 😢`, state.log),
//       };

//     case "guess":
//       if (action.guess === state.target) {
//         return {
//           ...state,
//           target: Math.floor(Math.random() * 100),
//           log: addLog(
//             `user ${action.user.id} guessed ${action.guess} and won! 👑`,
//             state.log,
//           ),
//         };
//       } else {
//         return {
//           ...state,
//           log: addLog(
//             `user ${action.user.id} guessed ${action.guess}`,
//             state.log,
//           ),
//         };
//       }
//   }
// };
