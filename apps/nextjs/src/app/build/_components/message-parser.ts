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

type ParsedMessage = {
  textContent: string;
  artifact: VgArtifact | null;
  isComplete: boolean;
};

export function parseMessage(message: string): ParsedMessage {
  // Check if the message contains a complete artifact
  const artifactRegex =
    /<vgArtifact\s+id="([^"]+)"\s+title="([^"]+)">([\s\S]*?)<\/vgArtifact>/;
  const artifactMatch = artifactRegex.exec(message);

  let artifact: VgArtifact | null = null;
  let isComplete = true;

  if (artifactMatch) {
    const [fullMatch, id, title, artifactContent] = artifactMatch;

    // Extract all actions from the artifact
    const actionRegex =
      /<vgAction\s+type="([^"]+)"\s+filePath="([^"]+)">([\s\S]*?)<\/vgAction>/g;
    const actions: VgAction[] = [];

    let actionMatch;
    while ((actionMatch = actionRegex.exec(artifactContent ?? "")) !== null) {
      const [__, type, filePath, content] = actionMatch;
      if (!type || !filePath || !content) continue;
      actions.push({
        type,
        filePath,
        content,
      });
    }

    if (id && title) {
      artifact = {
        id,
        title,
        actions,
      };
    }
  } else {
    // Check if we have a partial artifact (for streaming)
    const hasOpeningTag = /<vgArtifact\s+id="[^"]*"\s+title="[^"]*">/.test(
      message,
    );
    const hasClosingTag = message.includes("</vgArtifact>");

    if (hasOpeningTag && !hasClosingTag) {
      isComplete = false;
    }
  }

  // Extract text content by removing the artifact block
  const textContent = message
    .replace(/<vgArtifact[\s\S]*?<\/vgArtifact>/g, "")
    .trim();

  return {
    textContent,
    artifact,
    isComplete,
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
