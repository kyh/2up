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

export type ParsedMessage = {
  textContent: string;
  artifact: VgArtifact | null;
  isComplete: boolean;
  currentFilePath: string | null;
};

export function parseMessage(message: string): ParsedMessage {
  // Initialize return values
  let artifact: VgArtifact | null = null;
  let isComplete = true;
  let currentFilePath: string | null = null;
  let textContent = "";

  // Check for complete artifact
  const artifactRegex =
    /<vgArtifact\s+id="([^"]+)"\s+title="([^"]+)">([\s\S]*?)<\/vgArtifact>/;
  const artifactMatch = artifactRegex.exec(message);

  if (artifactMatch) {
    // Complete artifact found
    const [fullMatch, id, title, artifactContent] = artifactMatch;

    // Extract actions
    const actions = extractActions(artifactContent ?? "");

    if (id && title) {
      artifact = { id, title, actions };
    }

    // Extract text content by removing the complete artifact block
    textContent = message.replace(fullMatch, "").trim();
  } else {
    // Check for partial artifact (streaming)
    const artifactStartIndex = message.indexOf("<vgArtifact");

    if (artifactStartIndex !== -1 && !message.includes("</vgArtifact>")) {
      isComplete = false;

      // Extract only the text content before the artifact tag
      textContent =
        artifactStartIndex > 0
          ? message.substring(0, artifactStartIndex).trim()
          : "";

      // Find current file being generated
      currentFilePath = extractCurrentFilePath(message);
    } else {
      // No artifact at all, just text
      textContent = message.trim();
    }
  }

  return {
    textContent,
    artifact: isComplete ? artifact : null,
    isComplete,
    currentFilePath,
  };
}

/**
 * Extract actions from artifact content
 */
function extractActions(artifactContent: string): VgAction[] {
  const actionRegex =
    /<vgAction\s+type="([^"]+)"\s+filePath="([^"]+)">([\s\S]*?)<\/vgAction>/g;
  const actions: VgAction[] = [];

  let actionMatch;
  while ((actionMatch = actionRegex.exec(artifactContent ?? "")) !== null) {
    const [_, type, filePath, content] = actionMatch;
    if (!type || !filePath || !content) continue;

    actions.push({ type, filePath, content });
  }

  return actions;
}

/**
 * Extract the current file path being generated during streaming
 */
function extractCurrentFilePath(message: string): string | null {
  // First check for a complete action followed by an incomplete one
  const lastActionEndIndex = message.lastIndexOf("</vgAction>");

  if (lastActionEndIndex !== -1) {
    // Look for the next action start after the last complete action
    const nextActionStartIndex = message.indexOf(
      "<vgAction",
      lastActionEndIndex,
    );

    if (nextActionStartIndex !== -1) {
      // Extract the file path from the partial action
      const filePathMatch =
        /<vgAction\s+type="[^"]+"\s+filePath="([^"]+)">/.exec(
          message.substring(nextActionStartIndex),
        );

      if (filePathMatch?.[1]) {
        return filePathMatch[1];
      }
    }
  } else {
    // No complete actions yet, check if we're on the first action
    const firstActionMatch =
      /<vgAction\s+type="[^"]+"\s+filePath="([^"]+)">/.exec(message);

    if (firstActionMatch?.[1]) {
      return firstActionMatch[1];
    }
  }

  return null;
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
