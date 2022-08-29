import { useRef, useState, ChangeEvent, ReactNode } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { theme } from "styles/theme";
import { VideoPlayer, AudioPlayer, Code, Button, Icon } from "components";
import { PackAssetModal } from "lib/packs/components/PackAssetModal";
import {
  VisibleQATypeMenu,
  visibleQATypeMenuVar,
  instructionElementAttribute,
} from "lib/packs/packService";
import { QuestionTypeSlugs } from "lib/game/gameSlice";

type EditableQuestionProps = {
  instruction: string;
  question: string;
  questionType: string;
  sceneId: string;
  onChange: (scene: any) => void;
};

export const EditableQuestion = ({
  sceneId,
  instruction,
  question,
  questionType,
  onChange,
}: EditableQuestionProps) => {
  const onFocus = () => {
    visibleQATypeMenuVar(VisibleQATypeMenu.Question);
  };

  const onBlurInstruction = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({ instruction: e.target.value });
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
      data-focusable={instructionElementAttribute}
      placeholder="Instruction..."
      defaultValue={instruction}
      onFocus={onFocus}
      onBlur={onBlurInstruction}
    />
  );

  switch (questionType) {
    case QuestionTypeSlugs.image.id:
      return (
        <EditableQuestionContainer key={sceneId}>
          {instructionElement}
          <EditableQuestionImage
            instruction={instruction}
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
            placeholder="Your question?"
            defaultValue={question}
            onFocus={onFocus}
            onBlur={onBlurQuestion}
          />
        </EditableQuestionContainer>
      );
  }
};

const EditableQuestionInstructions = styled.input`
  margin: 0 auto ${theme.spacings(2)};
`;

const EditableQuestionText = styled.textarea`
  margin: 0 auto ${theme.spacings(5)};
  font-size: 2rem;
  width: 100%;
  resize: vertical;
`;

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
        <img alt={instruction} src={question} />
      </ImageContainer>
    </AssetManager>
  );
};

const ImageContainer = styled.div`
  display: flex;

  > img {
    margin: auto;
    object-fit: cover;
    max-width: 100%;
    max-height: 200px;
    margin: 0 auto ${theme.spacings(5)};

    ${theme.breakpoints.desktop} {
      max-width: 500px;
    }
  }
`;

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

const Container = styled.div`
  margin-bottom: ${theme.spacings(5)};
`;

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
        className="url-input"
        type="text"
        placeholder="URL"
        defaultValue={question}
        onFocus={onFocus}
        onBlur={onChange}
      />
      <Button
        className="edit-button"
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

const AssetManagerContainer = styled.div`
  position: relative;

  .url-input {
    position: absolute;
    left: 50%;
    top: 10px;
    transform: translateX(-50%);
  }

  .edit-button {
    background-color: ${theme.ui.background};
    border-radius: 100%;
    position: absolute;
    top: ${theme.spacings(2)};
    right: ${theme.spacings(2)};
  }
`;

const EditableQuestionContainer = styled.div`
  width: 70%;

  ${EditableQuestionInstructions},
  ${EditableQuestionText} {
    display: block;
    text-align: center;
    border-radius: ${theme.ui.borderWavyRadius};
    border: none;
    transition: box-shadow 0.23s ease;
    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.3);
    }
  }
`;
