import { useState, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import styled from "styled-components";
import { theme } from "styles/theme";
import { QuestionTypeSlugs } from "features/game/gameSlice";
import {
  VisibleQATypeMenu,
  visibleQATypeMenuVar,
  instructionElementAttribute,
} from "features/packs/sceneService";
import { Button, Icon, Modal, Uploader } from "components";
import { PackAssetCreateMutation } from "./__generated__/PackAssetCreateMutation";

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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange({ question: e.target.value });
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

type EditableQuestionImageProps = Pick<
  EditableQuestionProps,
  "instruction" | "question"
> & {
  onFocus: () => void;
  onChange: (scene: any) => void;
};

const EditableQuestionImage = ({
  instruction,
  question,
  onFocus,
  onChange,
}: EditableQuestionImageProps) => {
  const { packId } = useParams<{ packId: string }>();
  const [isOpen, setIsOpen] = useState(false);
  const [packAssetCreate] = useMutation<PackAssetCreateMutation>(
    PACK_ASSET_CREATE
  );

  const onUploaded = async (rawName: string, path: string) => {
    await packAssetCreate({
      variables: {
        input: { rawName, path, packId },
      },
    });
  };

  return (
    <EditableQuestionImageContainer>
      <button className="image-container" onFocus={onFocus}>
        <QuestionImage alt={instruction} src={question} />
      </button>
      <input
        className="image-input"
        type="text"
        placeholder="Image URL"
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
      <Modal
        open={isOpen}
        title="Asset Library"
        onRequestClose={() => setIsOpen(false)}
        closeButton
      >
        <Uploader onUploaded={onUploaded} pathPrefix={`packs/${packId}`} />
      </Modal>
    </EditableQuestionImageContainer>
  );
};

const PACK_ASSET_CREATE = gql`
  mutation PackAssetCreateMutation($input: PackAssetCreateInput!) {
    packAssetCreate(input: $input) {
      packAsset {
        id
      }
    }
  }
`;

const EditableQuestionImageContainer = styled.div`
  position: relative;
  .image-input {
    position: absolute;
    left: 50%;
    top: 10px;
    transform: translateX(-50%);
  }
  .image-container {
    width: 100%;
    margin-bottom: ${theme.spacings(5)};
    transition: box-shadow 0.23s ease;
    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px ${theme.ui.background};
    }
    > img {
      margin: 0;
    }
  }
  .edit-button {
    background-color: ${theme.ui.background};
    border-radius: 100%;
    position: absolute;
    top: ${theme.spacings(2)};
    right: ${theme.spacings(2)};
  }
`;

const QuestionImage = styled.img`
  object-fit: cover;
  max-width: 100%;
  max-height: 200px;
  margin: 0 0 ${theme.spacings(5)};
  ${theme.breakpoints.desktop} {
    max-width: 500px;
  }
`;

const EditableQuestionContainer = styled.div`
  width: 70%;
  input,
  textarea {
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
