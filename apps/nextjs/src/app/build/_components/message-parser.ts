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

// Cache for parsed messages and intermediate results
const parsedMessageCache = new Map<string, ParsedMessage>();
const artifactRegexCache = new Map<string, RegExpExecArray | null>();

/**
 * Extract an attribute value from a tag string
 */
function extractAttribute(
  tag: string,
  attributeName: string,
): string | undefined {
  // Use a more optimized regex that doesn't need to create capture groups for non-matches
  const match = new RegExp(`${attributeName}="([^"]*)"`, "i").exec(tag);
  return match ? match[1] : undefined;
}

/**
 * Parse a message using regular expressions with optimizations for streaming content
 */
export function parseMessage(messageId: string, input: string): ParsedMessage {
  // Quick check for cached result
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

  // Fast path for messages without artifacts
  if (!input.includes("<vgArtifact")) {
    parsedMessage.contentBeforeArtifact = input;
    parsedMessageCache.set(messageId, parsedMessage);
    return parsedMessage;
  }

  // Check if we've already computed the artifact match for this input
  let artifactMatch = artifactRegexCache.get(input);
  if (artifactMatch === undefined) {
    // Find the complete artifact tag if it exists
    const artifactRegex = /<vgArtifact([^>]*)>([\s\S]*?)<\/vgArtifact>/;
    artifactMatch = artifactRegex.exec(input);
    artifactRegexCache.set(input, artifactMatch);
  }

  let artifactTag = "";
  let artifactContent = "";
  let isCompletedArtifact = false;
  let contentStartIndex = 0;
  let contentEndIndex = input.length;

  if (artifactMatch) {
    // Complete artifact found
    artifactTag = artifactMatch[1]!;
    artifactContent = artifactMatch[2]!;
    isCompletedArtifact = true;
    contentStartIndex = artifactMatch.index;
    contentEndIndex = artifactMatch.index + artifactMatch[0].length;
  } else {
    // No complete artifact, check for partial ones
    // Only run these expensive patterns if we didn't find a complete match
    const openTagIndex = input.lastIndexOf("<vgArtifact");

    if (openTagIndex === -1) {
      // No artifact tag at all
      parsedMessage.contentBeforeArtifact = input;
      parsedMessageCache.set(messageId, parsedMessage);
      return parsedMessage;
    }

    // Extract the tag part (from opening tag to first space or >)
    const closeBracketIndex = input.indexOf(">", openTagIndex);
    if (closeBracketIndex === -1) {
      // Tag not even properly opened yet
      parsedMessage.contentBeforeArtifact = input;
      parsedMessageCache.set(messageId, parsedMessage);
      return parsedMessage;
    }

    artifactTag = input.substring(
      openTagIndex + "<vgArtifact".length,
      closeBracketIndex,
    );
    artifactContent = input.substring(closeBracketIndex + 1);
    contentStartIndex = openTagIndex;
  }

  // Extract artifact attributes - only do this if there's an artifact
  const artifactId = extractAttribute(artifactTag, "id") ?? "";
  const artifactTitle = extractAttribute(artifactTag, "title") ?? "";

  // Update artifact data
  parsedMessage.artifact = {
    id: artifactId,
    title: artifactTitle,
    isParsed: isCompletedArtifact,
  };

  // Split content before and after artifact
  parsedMessage.contentBeforeArtifact = input.substring(0, contentStartIndex);
  if (isCompletedArtifact) {
    parsedMessage.contentAfterArtifact = input.substring(contentEndIndex);
  }

  // Fast path: if the artifact doesn't have actions, return early
  if (!artifactContent.includes("<vgAction")) {
    parsedMessageCache.set(messageId, parsedMessage);
    return parsedMessage;
  }

  // Process complete actions
  // Pre-compile regex for better performance
  const actionRegex = /<vgAction([^>]*)>([\s\S]*?)<\/vgAction>/g;
  let actionMatch;

  // Track the end position of the last complete action
  let lastCompleteActionEnd = 0;

  // Only add new complete actions
  const foundCompletePaths = new Set<string>();

  while ((actionMatch = actionRegex.exec(artifactContent)) !== null) {
    const actionTag = actionMatch[1]!;
    const actionContent = actionMatch[2]?.trim() ?? "";
    const actionType = extractAttribute(actionTag, "type") as ActionType;
    lastCompleteActionEnd = actionMatch.index + actionMatch[0].length;

    if (actionType === "file") {
      const filePath = extractAttribute(actionTag, "filePath") ?? "";
      foundCompletePaths.add(filePath);

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

  // Check for incomplete action at the end
  const remainingContent = artifactContent.substring(lastCompleteActionEnd);
  const lastOpenActionIndex = remainingContent.lastIndexOf("<vgAction");

  if (lastOpenActionIndex !== -1) {
    const incompleteActionContent =
      remainingContent.substring(lastOpenActionIndex);
    const closeBracketIndex = incompleteActionContent.indexOf(">");

    if (closeBracketIndex !== -1) {
      const actionTag = incompleteActionContent.substring(
        "<vgAction".length,
        closeBracketIndex,
      );
      const actionContent = incompleteActionContent
        .substring(closeBracketIndex + 1)
        .trim();
      const actionType = extractAttribute(actionTag, "type") as ActionType;

      if (actionType === "file") {
        const filePath = extractAttribute(actionTag, "filePath") ?? "";

        // Only add if we don't already have a complete version of this file
        if (!foundCompletePaths.has(filePath)) {
          parsedMessage.actions.push({
            type: actionType,
            filePath,
            content: actionContent,
            isParsed: false,
          });
        }
      } else {
        parsedMessage.actions.push({
          content: actionContent,
          isParsed: false,
        });
      }
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
