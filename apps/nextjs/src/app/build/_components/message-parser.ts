import type { SandpackFile } from "@codesandbox/sandpack-react";

export type VgAction = {
  type: string;
  filePath: string;
  content: string;
};

export type VgArtifact = {
  id: string;
  title: string;
  actions: VgAction[];
};

export function extractArtifact(message: string): VgArtifact | null {
  const artifactRegex =
    /<vgArtifact\s+id="([^"]+)"\s+title="([^"]+)">([\s\S]*?)<\/vgArtifact>/;
  const artifactMatch = artifactRegex.exec(message);

  if (!artifactMatch) {
    return null;
  }

  const [_, id, title, artifactContent] = artifactMatch;

  const actionRegex =
    /<vgAction\s+type="([^"]+)"\s+filePath="([^"]+)">([\s\S]*?)<\/vgAction>/g;
  const actions: VgAction[] = [];

  let actionMatch;
  while ((actionMatch = actionRegex.exec(artifactContent ?? "")) !== null) {
    const [__, type, filePath, content] = actionMatch;
    actions.push({
      type: type!,
      filePath: filePath!,
      content: content!,
    });
  }

  return {
    id: id!,
    title: title!,
    actions,
  };
}

export function convertToSandpackFiles(
  actions: VgAction[],
): Record<string, SandpackFile> {
  const files: Record<string, SandpackFile> = {};

  actions.forEach((action) => {
    if (action.type === "file") {
      files[action.filePath] = {
        code: action.content,
        active: false,
      };
    }
  });

  if (files["src/App.jsx"]) {
    files["src/App.jsx"].active = true;
  }

  return files;
}

export function extractTextContent(message: string): string {
  return message.replace(/<vgArtifact[\s\S]*?<\/vgArtifact>/g, "").trim();
}
