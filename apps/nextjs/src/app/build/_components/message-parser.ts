import { useRef } from "react";

const ARTIFACT_TAG_OPEN = "<vgArtifact";
const ARTIFACT_TAG_CLOSE = "</vgArtifact>";
const ARTIFACT_ACTION_TAG_OPEN = "<vgAction";
const ARTIFACT_ACTION_TAG_CLOSE = "</vgAction>";

export type VgArtifactData = {
  id: string;
  title: string;
};

export type ActionType = "file";

export type BaseAction = {
  content: string;
};

export type FileAction = {
  type: "file";
  filePath: string;
} & BaseAction;

export type VgAction = FileAction;

export type VgActionData = VgAction | BaseAction;

export type ParserCallbacks = {
  onArtifactOpen?: (state: MessageState, parsedMessage: ParsedMessage) => void;
  onArtifactClose?: (state: MessageState, parsedMessage: ParsedMessage) => void;
  onActionOpen?: (state: MessageState, parsedMessage: ParsedMessage) => void;
  onActionClose?: (state: MessageState, parsedMessage: ParsedMessage) => void;
};

export type StreamingMessageParserOptions = {
  callbacks?: ParserCallbacks;
};

export type MessageState = {
  position: number;
  insideArtifact: boolean;
  insideAction: boolean;
  currentArtifact?: VgArtifactData;
  currentAction: VgActionData;
  actionId: number;
};

export type ParsedMessage = {
  messageId: string;
  contentBeforeArtifact: string;
  artifact?: VgArtifactData;
  actions: VgAction[];
  contentAfterArtifact: string;
};

export class StreamingMessageParser {
  #messages = new Map<string, MessageState>();
  #parsedMessages = new Map<string, ParsedMessage>();

  constructor(private _options: StreamingMessageParserOptions = {}) {}

  parse(messageId: string, input: string): ParsedMessage {
    let state = this.#messages.get(messageId);
    let parsedMessage = this.#parsedMessages.get(messageId);

    // Initialize state if it doesn't exist
    if (!state) {
      state = {
        position: 0,
        insideAction: false,
        insideArtifact: false,
        currentAction: { content: "" },
        actionId: 0,
      };
      this.#messages.set(messageId, state);
    }

    // Initialize parsed message if it doesn't exist
    if (!parsedMessage) {
      parsedMessage = {
        messageId,
        contentBeforeArtifact: "",
        actions: [],
        contentAfterArtifact: "",
      };
      this.#parsedMessages.set(messageId, parsedMessage);
    }

    let output = "";
    let i = state.position;
    let earlyBreak = false;

    while (i < input.length) {
      if (state.insideArtifact) {
        const currentArtifact = state.currentArtifact;

        if (currentArtifact === undefined) {
          console.error("Artifact not initialized");
          return parsedMessage;
        }

        if (state.insideAction) {
          const closeIndex = input.indexOf(ARTIFACT_ACTION_TAG_CLOSE, i);

          const currentAction = state.currentAction;

          if (closeIndex !== -1) {
            currentAction.content += input.slice(i, closeIndex);

            let content = currentAction.content.trim();

            if ("type" in currentAction && currentAction.type === "file") {
              content += "\n";
            }

            currentAction.content = content;

            // Add the action to the parsedMessage actions array
            parsedMessage.actions.push(currentAction as VgAction);

            this._options.callbacks?.onActionClose?.(state, parsedMessage);

            state.insideAction = false;
            state.currentAction = { content: "" };

            i = closeIndex + ARTIFACT_ACTION_TAG_CLOSE.length;
          } else {
            break;
          }
        } else {
          const actionOpenIndex = input.indexOf(ARTIFACT_ACTION_TAG_OPEN, i);
          const artifactCloseIndex = input.indexOf(ARTIFACT_TAG_CLOSE, i);

          if (
            actionOpenIndex !== -1 &&
            (artifactCloseIndex === -1 || actionOpenIndex < artifactCloseIndex)
          ) {
            const actionEndIndex = input.indexOf(">", actionOpenIndex);

            if (actionEndIndex !== -1) {
              state.insideAction = true;

              state.currentAction = this.#parseActionTag(
                input,
                actionOpenIndex,
                actionEndIndex,
              );

              this._options.callbacks?.onActionOpen?.(state, parsedMessage);

              i = actionEndIndex + 1;
            } else {
              break;
            }
          } else if (artifactCloseIndex !== -1) {
            this._options.callbacks?.onArtifactClose?.(state, parsedMessage);

            state.insideArtifact = false;
            state.currentArtifact = undefined;

            i = artifactCloseIndex + ARTIFACT_TAG_CLOSE.length;
          } else {
            break;
          }
        }
      } else if (input[i] === "<" && input[i + 1] !== "/") {
        let j = i;
        let potentialTag = "";

        while (
          j < input.length &&
          potentialTag.length < ARTIFACT_TAG_OPEN.length
        ) {
          potentialTag += input[j];

          if (potentialTag === ARTIFACT_TAG_OPEN) {
            const nextChar = input[j + 1];

            if (nextChar && nextChar !== ">" && nextChar !== " ") {
              output += input.slice(i, j + 1);
              i = j + 1;
              break;
            }

            const openTagEnd = input.indexOf(">", j);

            if (openTagEnd !== -1) {
              const artifactTag = input.slice(i, openTagEnd + 1);

              const artifactTitle = this.#extractAttribute(
                artifactTag,
                "title",
              );
              const artifactId = this.#extractAttribute(artifactTag, "id");

              if (!artifactTitle) {
                console.warn("Artifact title missing");
              }

              if (!artifactId) {
                console.warn("Artifact id missing");
              }

              state.insideArtifact = true;

              const currentArtifact = {
                id: artifactId ?? "",
                title: artifactTitle ?? "",
              } satisfies VgArtifactData;

              state.currentArtifact = currentArtifact;

              // Set the artifact in parsedMessage when we enter an artifact
              parsedMessage.artifact = currentArtifact;

              this._options.callbacks?.onArtifactOpen?.(state, parsedMessage);

              i = openTagEnd + 1;
            } else {
              earlyBreak = true;
            }

            break;
          } else if (!ARTIFACT_TAG_OPEN.startsWith(potentialTag)) {
            output += input.slice(i, j + 1);
            i = j + 1;
            break;
          }

          j++;
        }

        if (j === input.length && ARTIFACT_TAG_OPEN.startsWith(potentialTag)) {
          break;
        }
      } else {
        output += input[i];
        i++;
      }

      if (earlyBreak) {
        break;
      }
    }

    state.position = i;

    // Update the parsed message based on parsing results
    if (!state.insideArtifact && !parsedMessage.artifact) {
      // If we're not inside an artifact and no artifact has been found yet,
      // add content to the "before" section
      parsedMessage.contentBeforeArtifact += output;
    } else {
      // If we're inside an artifact or we've already parsed an artifact,
      // add content to the "after" section
      parsedMessage.contentAfterArtifact += output;
    }

    // Return the current state of the parsed message
    return { ...parsedMessage };
  }

  getParsedMessage(messageId: string): ParsedMessage | undefined {
    return this.#parsedMessages.get(messageId);
  }

  getAllParsedMessages(): ParsedMessage[] {
    return Array.from(this.#parsedMessages.values());
  }

  reset(messageId?: string) {
    if (messageId) {
      this.#messages.delete(messageId);
      this.#parsedMessages.delete(messageId);
    } else {
      this.#messages.clear();
      this.#parsedMessages.clear();
    }
  }

  #parseActionTag(
    input: string,
    actionOpenIndex: number,
    actionEndIndex: number,
  ) {
    const actionTag = input.slice(actionOpenIndex, actionEndIndex + 1);

    const actionType = this.#extractAttribute(actionTag, "type") as ActionType;

    const actionAttributes = {
      type: actionType,
      content: "",
    };

    if (actionType === "file") {
      const filePath = this.#extractAttribute(actionTag, "filePath")!;

      if (!filePath) {
        console.debug("File path not specified");
      }

      (actionAttributes as FileAction).filePath = filePath;
    } else {
      console.warn(`Unknown action type '${actionType}'`);
    }

    return actionAttributes as VgAction;
  }

  #extractAttribute(tag: string, attributeName: string): string | undefined {
    const match = new RegExp(`${attributeName}="([^"]*)"`, "i").exec(tag);
    return match ? match[1] : undefined;
  }
}

export function useMessageParser(props?: StreamingMessageParserOptions) {
  const messageParserRef = useRef(new StreamingMessageParser(props));

  return {
    messageParser: messageParserRef.current,
  };
}
