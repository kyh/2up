import {
  Scene as SceneModel,
  SceneAnswer as SceneAnswerModel,
} from "@prisma/client";
import { create } from "zustand";
import { shallow } from "zustand/shallow";

export type SceneWithAnswers = SceneModel & {
  answers: SceneAnswerModel[];
};

export enum VisibleQATypeMenu {
  None,
  Question,
  Answer,
}

export type PackStore = {
  visibleQATypeMenu: VisibleQATypeMenu;
  setVisibleQATypeMenu: (visibleQATypeMenu: VisibleQATypeMenu) => void;
  savingScene: boolean;
  setSavingScene: (savingScene: boolean) => void;
  packScenes: SceneWithAnswers[];
  setPackScenes: (packScenes: SceneWithAnswers[]) => void;
};

export const usePackStore = create<PackStore>()((set) => ({
  visibleQATypeMenu: VisibleQATypeMenu.None,
  setVisibleQATypeMenu: (visibleQATypeMenu) =>
    set((state) => ({ ...state, visibleQATypeMenu })),
  savingScene: false,
  setSavingScene: (savingScene) => set((state) => ({ ...state, savingScene })),
  packScenes: [],
  setPackScenes: (packScenes) => set((state) => ({ ...state, packScenes })),
}));

export const useAllPackStore = () => usePackStore((state) => state, shallow);
