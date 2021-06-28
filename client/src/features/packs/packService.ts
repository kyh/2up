import { gql } from "@apollo/client";
import { useMutation, makeVar } from "@apollo/client";
import { Hotkey } from "@react-hook/hotkey";
import { useAlert } from "react-alert";
import { SCENE_FRAGMENT } from "features/packs/packFragments";
import {
  SceneUpdateMutation,
  SceneUpdateMutation_sceneUpdate_scene,
} from "./components/__generated__/SceneUpdateMutation";
import { SceneFragment } from "./__generated__/SceneFragment";

export const useUpdateScene = (scene: SceneFragment) => {
  const alert = useAlert();
  const [sceneUpdate] = useMutation<SceneUpdateMutation>(SCENE_UPDATE);

  const updateScene = async (updatedScene = {}) => {
    savingSceneVar(true);
    const newScene = { ...scene, ...updatedScene };
    console.log("Update new Scene:", newScene);
    try {
      await sceneUpdate({
        variables: {
          input: {
            id: newScene.id || "",
            instruction: newScene.instruction,
            questionTypeSlug: newScene.questionType.slug,
            question: newScene.question,
            answerTypeSlug: newScene.answerType.slug,
            sceneAnswers: newScene.sceneAnswers,
          },
        },
      });
      savingSceneVar(false);
    } catch (error) {
      alert.show(error.message);
      savingSceneVar(false);
    }
  };

  return { updateScene };
};

const SCENE_UPDATE = gql`
  mutation SceneUpdateMutation($input: SceneUpdateInput!) {
    sceneUpdate(input: $input) {
      scene {
        ...SceneFragment
      }
    }
  }
  ${SCENE_FRAGMENT}
`;

export enum VisibleQATypeMenu {
  None,
  Question,
  Answer,
}

export const visibleQATypeMenuVar = makeVar(VisibleQATypeMenu.None);
export const savingSceneVar = makeVar(false);
export const packScenesVar = makeVar<any[]>([]);

export const getRandomAnswer = () => {
  const packScenes = packScenesVar();
  const { sceneAnswers } = packScenes[
    Math.floor(Math.random() * packScenes.length)
  ];
  const randomAnswer =
    sceneAnswers[Math.floor(Math.random() * sceneAnswers.length)];
  return randomAnswer;
};

export const scenesToCsv = (
  scenes: Pick<
    SceneUpdateMutation_sceneUpdate_scene,
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
      const sceneAnswers = s.sceneAnswers?.map((a) => {
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
        const out = csvText
          .split("\r\n")
          .filter((_row, index) => index !== 0)
          .map((row) => row.split(",").filter(Boolean).join(","))
          .join("\n");

        resolve(out);
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
