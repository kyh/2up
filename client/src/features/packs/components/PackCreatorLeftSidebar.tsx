import { useEffect, useState, useRef, ChangeEvent } from "react";
import styled, { css } from "styled-components";
import { useAlert } from "react-alert";
import { gql, useMutation } from "@apollo/client";
import { motion } from "framer-motion";
import {
  useDynamicList,
  useDynamicListItem,
  calculateSwapDistance,
  arrayMove,
  getDragStateZIndex,
  DynamicListItemProps,
  getDragCursor,
} from "styles/animations";
import { theme } from "styles/theme";
import { useHotkeys } from "@react-hook/hotkey";
import { Modal, Button, Icon, AreaField } from "components";
import { Question } from "features/game/components/Question";
import { Answer } from "features/game/components/Answer";
import {
  keybindings,
  savingSceneVar,
  scenesToCsv,
  fileToCsv,
} from "features/packs/sceneService";

import { SidebarSceneCreateMutation } from "./__generated__/SidebarSceneCreateMutation";
import { SidebarSceneDeleteMutation } from "./__generated__/SidebarSceneDeleteMutation";
import { SidebarSceneOrderUpdateMutation } from "./__generated__/SidebarSceneOrderUpdateMutation";
import { SidebarPackFragment_scenes_edges_node } from "./__generated__/SidebarPackFragment";
import { CsvImportMutation } from "./__generated__/CsvImportMutation";

type Props = {
  packId: string;
  packScenes: SidebarPackFragment_scenes_edges_node[];
  selectedSceneId?: string;
  selectScene: (scene: any) => void;
  refetch: () => void;
};

export const Sidebar = ({
  packId,
  packScenes,
  selectedSceneId,
  selectScene,
  refetch,
}: Props) => {
  const alert = useAlert();
  const [sceneCreate] = useMutation<SidebarSceneCreateMutation>(SCENE_CREATE);
  const [sceneDelete] = useMutation<SidebarSceneDeleteMutation>(SCENE_DELETE);
  const [sceneOrderUpdate] = useMutation<SidebarSceneOrderUpdateMutation>(
    SCENE_ORDER_UPDATE
  );
  const [scenes, setScenes] = useState(packScenes);
  const draggingRef = useRef(false);
  // const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (draggingRef.current) return;
    if (JSON.stringify(scenes) !== JSON.stringify(packScenes)) {
      setScenes(packScenes);
    }
  }, [packScenes]);

  const onPositionUpdate = (startIndex: number, endIndex: number) => {
    draggingRef.current = true;
    const newOrder = arrayMove(scenes, startIndex, endIndex);
    setScenes(newOrder);
  };

  const onDragEnd = async (startIndex: number, endIndex: number) => {
    const sceneId = scenes[startIndex].id;
    let beforeSceneId;
    let afterSceneId;

    if (endIndex !== 0) {
      beforeSceneId = scenes[endIndex - 1].id;
    }

    if (endIndex !== scenes.length - 1) {
      afterSceneId = scenes[endIndex + 1].id;
    }

    try {
      savingSceneVar(true);
      await sceneOrderUpdate({
        variables: {
          input: {
            id: sceneId,
            beforeId: beforeSceneId,
            afterId: afterSceneId,
          },
        },
      });
      draggingRef.current = false;
      savingSceneVar(false);
    } catch (error) {
      alert.show(error.message);
      savingSceneVar(false);
    }
  };

  const itemProps = useDynamicList({
    items: scenes,
    swapDistance: calculateSwapDistance,
    onPositionUpdate,
    onDragEnd,
  });

  const deleteScene = async (sceneId: string, index: number) => {
    try {
      savingSceneVar(true);
      const { data } = await sceneDelete({
        variables: {
          input: {
            id: sceneId,
          },
        },
      });
      const deletedScene = data?.sceneDelete?.scene;
      if (deletedScene) {
        if (sceneId === selectedSceneId && scenes[index - 1]) {
          selectScene(scenes[index - 1].id);
        }
      }
      savingSceneVar(false);
    } catch (error) {
      alert.show(error.message);
      savingSceneVar(false);
    }
  };

  const addNewScene = async () => {
    const selectedScene = scenes.find((s) => s.id === selectedSceneId);
    const input = {
      packId: packId,
      instruction: selectedScene ? selectedScene.instruction : "",
      questionTypeSlug: selectedScene
        ? selectedScene.questionType.slug
        : "text",
      question: selectedScene ? selectedScene.question : "Question?",
      answerTypeSlug: selectedScene ? selectedScene.answerType.slug : "text",
      sceneAnswers: selectedScene
        ? selectedScene.sceneAnswers
        : [{ content: "Answer!", isCorrect: true }],
      order: (scenes?.length || 0) + 1,
    };

    try {
      savingSceneVar(true);
      const { data } = await sceneCreate({
        variables: { input },
      });
      const newScene = data?.sceneCreate
        ?.scene as SidebarPackFragment_scenes_edges_node;
      if (newScene) {
        selectScene(newScene.id);
      }
      savingSceneVar(false);
    } catch (error) {
      alert.show(error.message);
      savingSceneVar(false);
    }
  };

  useHotkeys(window, [[keybindings.addNewScene.hotkey, addNewScene]]);

  // const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
  //   setSearchQuery(e.target.value);
  // };

  return (
    <>
      <SidebarHeader>
        {/* <input
          className="search"
          onChange={onSearch}
          type="text"
          placeholder="Search by question/answers"
        /> */}
      </SidebarHeader>
      <SidebarContent>
        {scenes.map((scene, index) => {
          // const matchedQuestion = scene.question.includes(searchQuery);
          // const matchedAnswers = (scene.sceneAnswers || []).filter(
          //   (sceneAnswer) => {
          //     return (sceneAnswer?.content || "").includes(searchQuery);
          //   }
          // ).length < 1;

          // if (searchQuery !== "" && matchedAnswers && matchedQuestion) {
          //   return null;
          // }

          return (
            <SidebarItem
              key={scene.id}
              index={index}
              itemProps={itemProps}
              scene={scene}
              isSelected={selectedSceneId === scene.id}
              selectScene={selectScene}
              deleteScene={deleteScene}
              showDelete={scenes.length > 1}
            />
          );
        })}
      </SidebarContent>
      <SidebarFooter>
        <Button onClick={addNewScene} fullWidth>
          Add New Scene
        </Button>
        <CsvImportButton packId={packId} scenes={scenes} refetch={refetch} />
      </SidebarFooter>
    </>
  );
};

Sidebar.fragments = {
  pack: gql`
    fragment SidebarPackFragment on Pack {
      id
      scenes(first: 100) {
        edges {
          node {
            id
            externalId
            question
            order
            sceneAnswers {
              id
              content
              isCorrect
            }
            instruction
            questionType {
              id
              slug
            }
            answerType {
              id
              slug
            }
          }
        }
      }
    }
  `,
};

const SCENE_CREATE = gql`
  mutation SidebarSceneCreateMutation($input: SceneCreateInput!) {
    sceneCreate(input: $input) {
      scene {
        id
        question
        sceneAnswers {
          id
          content
          isCorrect
        }
        instruction
        questionType {
          id
          slug
        }
        answerType {
          id
          slug
        }
      }
    }
  }
`;

const SCENE_DELETE = gql`
  mutation SidebarSceneDeleteMutation($input: SceneDeleteInput!) {
    sceneDelete(input: $input) {
      scene {
        id
      }
    }
  }
`;

const SCENE_ORDER_UPDATE = gql`
  mutation SidebarSceneOrderUpdateMutation($input: SceneOrderUpdateInput!) {
    sceneOrderUpdate(input: $input) {
      scene {
        id
        order
      }
    }
  }
`;

const SidebarHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacings(3)};
  h3 {
    margin: 0;
  }
`;

const SidebarContent = styled.ul`
  isolation: isolate;
  overflow: auto;
  padding: 0 ${theme.spacings(3)} 0 0;
  margin: 0;
`;

const SidebarFooter = styled.footer`
  padding: ${theme.spacings(3)};
`;

type SidebarItemProps = {
  index: number;
  scene: SidebarPackFragment_scenes_edges_node;
  isSelected: boolean;
  selectScene: (sceneId: string) => any;
  deleteScene: (sceneId: string, index: number) => any;
  showDelete: boolean;
  itemProps: DynamicListItemProps;
};

const SidebarItem = ({
  scene,
  index,
  isSelected,
  selectScene,
  deleteScene,
  showDelete,
  itemProps,
}: SidebarItemProps) => {
  const [dragState, ref, eventHandlers] = useDynamicListItem<HTMLLIElement>(
    index,
    "y",
    itemProps
  );

  useEffect(() => {
    if (ref && ref.current && isSelected) {
      ref.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [isSelected]);

  return (
    <QuestionItemContainer
      layout
      initial={false}
      drag="y"
      ref={ref}
      style={{
        zIndex: getDragStateZIndex(dragState),
        cursor: getDragCursor(dragState),
      }}
      {...eventHandlers}
    >
      <QuestionItem
        isSelected={isSelected}
        onClick={() => selectScene(scene.id)}
      >
        <div className="preview">
          <Question
            question={scene.question}
            instruction={scene.instruction || ""}
            questionType={scene.questionType.slug}
          />
          <div className="answers-container">
            {scene.sceneAnswers?.map((sceneAnswer) => {
              if (!sceneAnswer) return null;
              return (
                <Answer
                  key={sceneAnswer.id}
                  sceneAnswer={{
                    id: sceneAnswer.id,
                    content: sceneAnswer.content || "",
                    isCorrect: sceneAnswer.isCorrect,
                  }}
                  answerType={scene.answerType.slug}
                  submitted
                  onSubmit={() => {}}
                  displayMode
                />
              );
            })}
          </div>
        </div>
        {showDelete && (
          <button
            className="delete"
            onClick={() => deleteScene(scene.id, index)}
          >
            <Icon icon="trash" />
          </button>
        )}
      </QuestionItem>
    </QuestionItemContainer>
  );
};

const QuestionItemContainer = styled(motion.li)`
  padding: ${theme.spacings(1)} 0;
`;

const QuestionItem = styled.div<{ isSelected: boolean }>`
  position: relative;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  padding: ${theme.spacings(2)};
  padding-left: ${theme.spacings(6)};
  transition: background 0.2s ease, box-shadow 0.2s ease;
  ${({ isSelected }) =>
    isSelected &&
    css`
      background-color: ${theme.ui.backgroundPurple};
      box-shadow: inset ${theme.spacings(1)} 0 0 0 ${theme.colors.purple};
    `}

  &:hover {
    .delete {
      display: block;
    }
    .preview {
      box-shadow: 0 0 3px 0 ${theme.colors.purple};
      border-color: ${theme.colors.purple};
    }
  }

  .preview {
    cursor: pointer;
    font-size: 0.4rem;
    background: ${theme.ui.background};
    padding: ${theme.spacings(2)};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border: 1px solid ${theme.ui.borderColor};
    border-radius: ${theme.ui.borderWavyRadius};
    transition: border-color 0.1s ease, box-shadow 0.1s ease;
    > div:first-child {
      margin-bottom: ${theme.spacings(1)};
    }
    > img {
      object-fit: contain;
      max-width: 70px;
      height: 40px;
      display: block;
      margin: 0 auto ${theme.spacings(2)};
    }
    > h1 {
      font-size: 0.7rem;
      margin-bottom: ${theme.spacings(2)};
    }
    .answers-container {
      display: grid;
      grid-template-columns: repeat(2, max-content);
      grid-gap: ${theme.spacings(1)};
    }
    .display-text {
      font-size: 0.4rem;
      padding: ${theme.spacings(1)} ${theme.spacings(2)};
    }
    > * {
      pointer-events: none;
    }
  }

  .delete {
    display: none;
    position: absolute;
    right: ${theme.spacings(-1)};
    top: ${theme.spacings(-1)};
  }
`;

type CsvImportButtonProps = {
  packId: string;
  scenes: SidebarPackFragment_scenes_edges_node[];
  refetch: () => void;
};

const CsvImportButton = ({ packId, scenes, refetch }: CsvImportButtonProps) => {
  const alert = useAlert();
  const [isSaving, setIsSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [csv, setCsv] = useState(scenesToCsv(scenes));
  const [csvImport] = useMutation<CsvImportMutation>(CSV_IMPORT);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCsv(e.target.value);
  };

  const handleCsvInput = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const [file] = Array.from(e.target.files);
      const csv = await fileToCsv(file);
      setCsv(csv);
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      await csvImport({
        variables: {
          input: { packId, csv },
        },
      });
      await refetch();
    } catch (error) {
      alert.show(error.message);
    } finally {
      setIsSaving(false);
      setIsOpen(false);
    }
  };

  return (
    <CsvImportButtonContainer>
      <button className="modal-button" onClick={() => setIsOpen(true)}>
        CSV Import
      </button>
      <Modal
        title="Your pack as a CSV"
        open={isOpen}
        onRequestClose={() => setIsOpen(false)}
        closeButton
      >
        <CsvImportHeader>
          <input type="file" accept=".csv" onChange={handleCsvInput} />
          <a
            href="https://docs.google.com/spreadsheets/d/1OQHLadGoh3hzkZ_J4SfZ1kJ_f7C4YfV7YSGrqZ9wYC4/edit?usp=sharing"
            target="_blank"
            rel="noreferrer"
          >
            Example CSV
          </a>
        </CsvImportHeader>
        <CsvImportArea onChange={handleChange} value={csv} />
        <CsvImportFooter>
          <Button onClick={handleSubmit} disabled={isSaving}>
            Update Pack
          </Button>
        </CsvImportFooter>
      </Modal>
    </CsvImportButtonContainer>
  );
};

const CSV_IMPORT = gql`
  mutation CsvImportMutation($input: CsvImportInput!) {
    csvImport(input: $input) {
      pack {
        id
        name
      }
    }
  }
`;

const CsvImportButtonContainer = styled.div`
  text-align: center;
  margin-top: ${theme.spacings(1)};
  > .modal-button {
    font-size: 0.9rem;
    text-decoration: underline;
  }
`;

const CsvImportHeader = styled.header`
  display: flex;
  justify-content: space-between;
  a {
    text-decoration: underline;
  }
`;

const CsvImportArea = styled(AreaField)`
  width: 100%;
  min-height: 300px;
`;

const CsvImportFooter = styled.footer`
  display: flex;
  > button {
    margin-left: auto;
  }
`;
