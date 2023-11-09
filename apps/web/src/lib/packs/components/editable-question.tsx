import { useRef, useState } from "react";
import { useRouter } from "next/router";
import { classed } from "@/lib/utils/classed";
import { VideoPlayer, AudioPlayer, Code, Button, Icon } from "@/components";
import { PackAssetModal } from "@/lib/packs/components/pack-asset-modal";
import { usePackStore, VisibleQATypeMenu } from "@/lib/packs/pack-store";
import { instructionElementAttribute } from "@/lib/packs/pack-utils";
import { QuestionTypeSlugs } from "@/lib/game/game-utils";

type EditableQuestionProps = {
  questionDescription: string;
  question: string;
  questionType: string;
  sceneId: string;
  onChange: (scene: any) => void;
};

export const EditableQuestion = ({
  sceneId,
  questionDescription,
  question,
  questionType,
  onChange,
}: EditableQuestionProps) => {
  const setVisibleQATypeMenu = usePackStore(
    (state) => state.setVisibleQATypeMenu,
  );

  const onFocus = () => {
    setVisibleQATypeMenu(VisibleQATypeMenu.Question);
  };

  const onBlurQuestionDescription = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    onChange({ questionDescription: e.target.value });
  };

  const onBlurQuestion = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
  ) => {
    if (typeof e === "string") {
      onChange({ question: e });
    } else {
      onChange({ question: e.target.value });
    }
  };

  const instructionElement = (
    <EditableQuestionInstructions
      data-focusable={instructionElementAttribute}
      defaultValue={questionDescription}
      onBlur={onBlurQuestionDescription}
      onFocus={onFocus}
      placeholder="Instruction..."
      variant="inContainer"
    />
  );

  switch (questionType) {
    case QuestionTypeSlugs.image.id:
      return (
        <EditableQuestionContainer key={sceneId}>
          {instructionElement}
          <EditableQuestionImage
            instruction={questionDescription}
            onChange={onBlurQuestion}
            onFocus={onFocus}
            question={question}
          />
        </EditableQuestionContainer>
      );
    case QuestionTypeSlugs.audio.id:
      return (
        <EditableQuestionContainer key={sceneId}>
          {instructionElement}
          <EditableQuestionAudio
            onChange={onBlurQuestion}
            onFocus={onFocus}
            question={question}
          />
        </EditableQuestionContainer>
      );
    case QuestionTypeSlugs.video.id:
      return (
        <EditableQuestionContainer key={sceneId}>
          {instructionElement}
          <EditableQuestionVideo
            onChange={onBlurQuestion}
            onFocus={onFocus}
            question={question}
          />
        </EditableQuestionContainer>
      );
    case QuestionTypeSlugs.code.id:
      return (
        <EditableQuestionContainer key={sceneId}>
          {instructionElement}
          <EditableQuestionCode
            onChange={onBlurQuestion}
            onFocus={onFocus}
            question={question}
          />
        </EditableQuestionContainer>
      );
    default:
      return (
        <EditableQuestionContainer key={sceneId}>
          {instructionElement}
          <EditableQuestionText
            defaultValue={question}
            onBlur={onBlurQuestion}
            onFocus={onFocus}
            placeholder="Your question?"
            variant="inContainer"
          />
        </EditableQuestionContainer>
      );
  }
};

const EditableQuestionInstructions = classed.input(
  "mx-auto mb-2 bg-grey-background dark:bg-grey-dark w-full",
  {
    variants: {
      variant: {
        default: "",
        inContainer:
          "block text-center rounded-wavy border-none transition-shadow duration-[0.23s] ease-[ease] focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,_0,_0,_0.3)] dark:focus:shadow-[0_0_0_3px_rgba(255,_255,_255,_0.3)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const EditableQuestionText = classed.textarea(
  "mx-auto mb-5 text-[2rem] w-full resize-y bg-grey-background dark:bg-grey-dark",
  {
    variants: {
      variant: {
        default: "",
        inContainer:
          "block text-center rounded-wavy border-none transition-shadow duration-[0.23s] ease-[ease] focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,_0,_0,_0.3)] dark:focus:shadow-[0_0_0_3px_rgba(255,_255,_255,_0.3)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type EditableQuestionComponentProps = Pick<
  EditableQuestionProps,
  "question"
> & {
  onFocus: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement> | string) => void;
  children?: React.ReactNode;
};

const EditableQuestionImage = ({
  instruction,
  question,
  onFocus,
  onChange,
}: EditableQuestionComponentProps & { instruction: string }) => {
  return (
    <AssetManager onChange={onChange} onFocus={onFocus} question={question}>
      <ImageContainer>
        <img
          alt={instruction}
          className="mx-auto max-h-[200px] max-w-full object-cover desktop:max-w-[500px]"
          src={question}
        />
      </ImageContainer>
    </AssetManager>
  );
};

const ImageContainer = classed.div(
  "flex bg-grey-background dark:bg-grey-dark py-1 mb-5",
);

const EditableQuestionAudio = ({
  question,
  onFocus,
  onChange,
}: EditableQuestionComponentProps) => {
  return (
    <AssetManager onChange={onChange} onFocus={onFocus} question={question}>
      <Container>
        <AudioPlayer src={question} style={{ margin: "auto" }} />
      </Container>
    </AssetManager>
  );
};

const EditableQuestionVideo = ({
  question,
  onFocus,
  onChange,
}: EditableQuestionComponentProps) => {
  return (
    <AssetManager onChange={onChange} onFocus={onFocus} question={question}>
      <Container>
        <VideoPlayer
          height={300}
          style={{ margin: "auto" }}
          url={question}
          width={530}
        />
      </Container>
    </AssetManager>
  );
};

const EditableQuestionCode = ({
  question,
  onFocus,
  onChange,
}: EditableQuestionComponentProps) => {
  return (
    <Container>
      <Code content={question} editable onBlur={onChange} onFocus={onFocus} />
    </Container>
  );
};

const Container = classed.div("mb-5");

const AssetManager = ({
  question,
  onFocus,
  onChange,
  children,
}: EditableQuestionComponentProps) => {
  const router = useRouter();
  const packId = router.query.packId as string;
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<null | HTMLInputElement>(null);

  return (
    <AssetManagerContainer>
      {children}
      <input
        className="absolute left-1/2 top-[10px] -translate-x-1/2"
        defaultValue={question}
        onBlur={onChange}
        onFocus={onFocus}
        placeholder="URL"
        ref={inputRef}
        type="text"
      />
      <Button
        className="absolute right-2 top-2 rounded-full bg-white dark:bg-black"
        onClick={() => {
          setIsOpen(true);
        }}
        variant="fab"
      >
        <Icon icon="pencil" />
      </Button>
      {isOpen ? (
        <PackAssetModal
          onRequestClose={() => {
            setIsOpen(false);
          }}
          onSelectAsset={(path) => {
            onChange(path);
            setIsOpen(false);
            if (inputRef.current) {
              inputRef.current.value = path;
            }
          }}
          packId={packId}
        />
      ) : null}
    </AssetManagerContainer>
  );
};

const AssetManagerContainer = classed.div("relative");

const EditableQuestionContainer = classed.div("w-[70%]");
