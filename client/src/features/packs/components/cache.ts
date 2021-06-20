import { makeVar } from "@apollo/client";

export enum VisibleQATypeMenu {
  None,
  Question,
  Answer,
}

export const visibleQATypeMenuVar = makeVar(VisibleQATypeMenu.None);
export const savingSceneVar = makeVar(false);
