import { Hotkey } from "@react-hook/hotkey";
import { usePackStore } from "./packStore";

export const getRandomAnswer = () => {
  const packScenes = usePackStore.getState().packScenes;
  const { sceneAnswers } =
    packScenes[Math.floor(Math.random() * packScenes.length)];
  const randomAnswer =
    sceneAnswers[Math.floor(Math.random() * sceneAnswers.length)];
  return randomAnswer;
};

export const scenesToCsv = (
  scenes: Pick<
    any,
    | "externalId"
    | "instruction"
    | "question"
    | "questionType"
    | "sceneAnswers"
    | "answerType"
  >[]
) => {
  return scenes
    .map((s) => {
      const sceneAnswers = s.sceneAnswers?.map((a: any) => {
        return `${a?.content || ""},${a?.isCorrect ? "TRUE" : ""}`;
      });
      return [
        s.externalId,
        s.instruction,
        s.questionType.slug,
        s.question,
        s.answerType.slug,
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
