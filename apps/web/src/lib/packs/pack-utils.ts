import { Hotkey } from "@react-hook/hotkey";
import { usePackStore, SceneWithAnswers } from "@/lib/packs/pack-store";

export const getRandomAnswer = () => {
  const packScenes = usePackStore.getState().packScenes;
  const { answers } = packScenes[Math.floor(Math.random() * packScenes.length)];
  const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
  return randomAnswer;
};

export const scenesToCsv = (
  scenes: Pick<
    SceneWithAnswers,
    | "externalId"
    | "questionDescription"
    | "question"
    | "questionType"
    | "answers"
    | "answerType"
  >[]
) => {
  return scenes
    .map((s) => {
      const sceneAnswers = s.answers.map((a) => {
        return `${a?.content || ""},${a?.isCorrect ? "TRUE" : ""}`;
      });
      return [
        s.externalId,
        s.questionDescription,
        s.questionType,
        s.question,
        s.answerType,
        ...(sceneAnswers || []),
      ].join();
    })
    .join("\n");
};

export const fileToCsv = (file: File) => {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      if (reader.result) {
        const csvText = reader.result.toString();
        resolve(csvText);
      }
    };
  });
};

type Keybindings = {
  [key: string]: {
    hotkey: Hotkey[];
    display: string;
    description: string;
  };
};

export const keybindings: Keybindings = {
  showShortcuts: {
    hotkey: ["mod", "/"],
    display: "⌘ + /",
    description: "Show keyboard shortcuts",
  },
  previousScene: {
    hotkey: ["up"],
    display: "Up arrow",
    description: "Select previous Scene",
  },
  nextScene: {
    hotkey: ["down"],
    display: "Down arrow",
    description: "Select next Scene",
  },
  addNewScene: {
    hotkey: ["mod", "d"],
    display: "⌘ + d",
    description: "Add new Scene",
  },
  focusScene: {
    hotkey: ["mod", "a"],
    display: "⌘ + a",
    description: "Update Scene properties",
  },
  testPlay: {
    hotkey: ["mod", "enter"],
    display: "⌘ + Enter",
    description: "Test play pack",
  },
};

export const instructionElementAttribute = "instruction-input";
