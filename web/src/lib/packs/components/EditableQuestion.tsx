import { useRef, useState, ChangeEvent, ReactNode } from "react";
import { useRouter } from "next/router";
import { classed } from "~/utils/classed";
import { VideoPlayer, AudioPlayer, Code, Button, Icon } from "~/components";
import { PackAssetModal } from "~/lib/packs/components/PackAssetModal";
import { usePackStore, VisibleQATypeMenu } from "~/lib/packs/packStore";
import { instructionElementAttribute } from "~/lib/packs/packUtils";
import { QuestionTypeSlugs } from "~/lib/game/gameUtils";

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
    (state) => state.setVisibleQATypeMenu
  );

  const onFocus = () => {
    setVisibleQATypeMenu(VisibleQATypeMenu.Question);
  };

  const onBlurQuestionDescription = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ questionDescription: e.target.value });
  };

  const onBlurQuestion = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string
  ) => {
    if (typeof e === "string") {
      onChange({ question: e });
    } else {
      onChange({ question: e.target.value });
    }
  };

  const instructionElement = (
    <EditableQuestionInstructions
      variant="inContainer"
      data-focusable={instructionElementAttribute}
      placeholder="Instruction..."
      defaultValue={questionDescription}
      onFocus={onFocus}
      onBlur={onBlurQuestionDescription}
    />
  );

  switch (questionType) {
    case QuestionTypeSlugs.image.id:
      return (
        <EditableQuestionContainer key={sceneId}>
          {instructionElement}
          <EditableQuestionImage
            instruction={questionDescription}
            question={question}
            onFocus={onFocus}
            onChange={onBlurQuestion}
          />
        </EditableQuestionContainer>
      );
    case QuestionTypeSlugs.audio.id:
      return (
        <EditableQuestionContainer key={sceneId}>
          {instructionElement}
          <EditableQuestionAudio
            question={question}
            onFocus={onFocus}
            onChange={onBlurQuestion}
          />
        </EditableQuestionContainer>
      );
    case QuestionTypeSlugs.video.id:
      return (
        <EditableQuestionContainer key={sceneId}>
          {instructionElement}
          <EditableQuestionVideo
            question={question}
            onFocus={onFocus}
            onChange={onBlurQuestion}
          />
        </EditableQuestionContainer>
      );
    case QuestionTypeSlugs.code.id:
      return (
        <EditableQuestionContainer key={sceneId}>
          {instructionElement}
          <EditableQuestionCode
            question={question}
            onFocus={onFocus}
            onChange={onBlurQuestion}
          />
        </EditableQuestionContainer>
      );
    default:
      return (
        <EditableQuestionContainer key={sceneId}>
          {instructionElement}
          <EditableQuestionText
            variant="inContainer"
            placeholder="Your question?"
            defaultValue={question}
            onFocus={onFocus}
            onBlur={onBlurQuestion}
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
  }
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
  }
);

type EditableQuestionComponentProps = Pick<
  EditableQuestionProps,
  "question"
> & {
  onFocus: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement> | string) => void;
  children?: ReactNode;
};

const EditableQuestionImage = ({
  instruction,
  question,
  onFocus,
  onChange,
}: EditableQuestionComponentProps & { instruction: string }) => {
  return (
    <AssetManager question={question} onFocus={onFocus} onChange={onChange}>
      <ImageContainer>
        <img
          alt={instruction}
          src={question}
          className="mx-auto object-cover max-w-full max-h-[200px] desktop:max-w-[500px]"
        />
      </ImageContainer>
    </AssetManager>
  );
};

const ImageContainer = classed.div(
  "flex bg-grey-background dark:bg-grey-dark py-1 mb-5"
);

const EditableQuestionAudio = ({
  question,
  onFocus,
  onChange,
}: EditableQuestionComponentProps) => {
  return (
    <AssetManager question={question} onFocus={onFocus} onChange={onChange}>
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
    <AssetManager question={question} onFocus={onFocus} onChange={onChange}>
      <Container>
        <VideoPlayer
          url={question}
          width={530}
          height={300}
          style={{ margin: "auto" }}
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
      <Code content={question} onFocus={onFocus} onBlur={onChange} editable />
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
        ref={inputRef}
        className="absolute left-1/2 top-[10px] -translate-x-1/2"
        type="text"
        placeholder="URL"
        defaultValue={question}
        onFocus={onFocus}
        onBlur={onChange}
      />
      <Button
        className="rounded-full absolute top-2 right-2 bg-white dark:bg-black"
        variant="fab"
        onClick={() => setIsOpen(true)}
      >
        <Icon icon="pencil" />
      </Button>
      {isOpen && (
        <PackAssetModal
          packId={packId}
          onRequestClose={() => setIsOpen(false)}
          onSelectAsset={(path) => {
            onChange(path);
            setIsOpen(false);
            if (inputRef.current) {
              inputRef.current.value = path;
            }
          }}
        />
      )}
    </AssetManagerContainer>
  );
};

const AssetManagerContainer = classed.div("relative");

const EditableQuestionContainer = classed.div("w-[70%]");
