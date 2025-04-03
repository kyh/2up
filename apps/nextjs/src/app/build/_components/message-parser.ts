// Types
export type VgArtifactData = {
  id: string;
  title: string;
  isParsed: boolean;
};

export type ActionType = "file";

export type BaseAction = {
  content: string;
  isParsed: boolean;
};

export type FileAction = {
  type: "file";
  filePath: string;
} & BaseAction;

export type VgActionData = BaseAction | FileAction;

export type ParsedMessage = {
  messageId: string;
  contentBeforeArtifact: string;
  artifact: VgArtifactData;
  actions: VgActionData[];
  contentAfterArtifact: string;
  fullInput: string;
};

// Cache for parsed messages
const parsedMessageCache = new Map<string, ParsedMessage>();

/**
 * Extract an attribute value from a tag string
 */
function extractAttribute(
  tag: string,
  attributeName: string,
): string | undefined {
  const match = new RegExp(`${attributeName}="([^"]*)"`, "i").exec(tag);
  return match ? match[1] : undefined;
}

/**
 * Parse a message using regular expressions
 */
export function parseMessage(messageId: string, input: string): ParsedMessage {
  // Check if we have a cached result for this exact input
  const cached = parsedMessageCache.get(messageId);
  if (cached && cached.fullInput === input) {
    return cached;
  }

  // Initialize the parsed message
  const parsedMessage: ParsedMessage = {
    messageId,
    contentBeforeArtifact: "",
    artifact: {
      id: "",
      title: "",
      isParsed: false,
    },
    actions: [],
    contentAfterArtifact: "",
    fullInput: input,
  };

  // Find the artifact tag if it exists
  const artifactRegex = /<vgArtifact([^>]*)>([\s\S]*?)<\/vgArtifact>/;
  const artifactMatch = artifactRegex.exec(input);

  if (!artifactMatch) {
    // No artifact found, all content is before artifact
    parsedMessage.contentBeforeArtifact = input;
    parsedMessageCache.set(messageId, parsedMessage);
    return parsedMessage;
  }

  // Extract artifact attributes
  const artifactTag = artifactMatch[1]!;
  const artifactContent = artifactMatch[2]!;
  const artifactId = extractAttribute(artifactTag, "id") ?? "";
  const artifactTitle = extractAttribute(artifactTag, "title") ?? "";

  // Update artifact data
  parsedMessage.artifact = {
    id: artifactId,
    title: artifactTitle,
    isParsed: true,
  };

  // Split content before and after artifact
  parsedMessage.contentBeforeArtifact = input.substring(0, artifactMatch.index);
  parsedMessage.contentAfterArtifact = input.substring(
    artifactMatch.index + artifactMatch[0].length,
  );

  // Find all actions within the artifact
  const actionRegex = /<vgAction([^>]*)>([\s\S]*?)<\/vgAction>/g;
  let actionMatch;

  while ((actionMatch = actionRegex.exec(artifactContent)) !== null) {
    const actionTag = actionMatch[1]!;
    const actionContent = actionMatch[2]?.trim() ?? "";
    const actionType = extractAttribute(actionTag, "type") as ActionType;

    if (actionType === "file") {
      const filePath = extractAttribute(actionTag, "filePath") ?? "";

      parsedMessage.actions.push({
        type: actionType,
        filePath,
        content: actionContent + "\n", // Add newline for file actions
        isParsed: true,
      });
    } else {
      parsedMessage.actions.push({
        content: actionContent ?? "",
        isParsed: true,
      });
    }
  }

  // Check for incomplete actions (open but not closed)
  const incompleteActionRegex = /<vgAction([^>]*)>([^<]*?)$/;
  const incompleteMatch = incompleteActionRegex.exec(artifactContent);

  if (incompleteMatch) {
    const actionTag = incompleteMatch[1]!;
    const actionContent = incompleteMatch[2]?.trim() ?? "";
    const actionType = extractAttribute(actionTag, "type") as ActionType;

    if (actionType === "file") {
      const filePath = extractAttribute(actionTag, "filePath") ?? "";

      parsedMessage.actions.push({
        type: actionType,
        filePath,
        content: actionContent,
        isParsed: false,
      });
    } else {
      parsedMessage.actions.push({
        content: actionContent,
        isParsed: false,
      });
    }
  }

  // Cache the result
  parsedMessageCache.set(messageId, parsedMessage);

  return parsedMessage;
}

/**
 * Reset the parser cache for a specific message or all messages
 */
export function resetParserCache(messageId?: string): void {
  if (messageId) {
    parsedMessageCache.delete(messageId);
  } else {
    parsedMessageCache.clear();
  }
}

/**
 * Type guard to check if an action is a file action
 */
export function isFileAction(action: VgActionData): action is FileAction {
  return "filePath" in action && "type" in action && action.type === "file";
}
