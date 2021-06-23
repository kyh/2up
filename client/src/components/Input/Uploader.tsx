import { useState, useRef, useEffect, useCallback, ReactNode } from "react";
import { gql, useMutation } from "@apollo/client";
import styled from "styled-components";
import { theme } from "styles/theme";

import { PresignedUrlCreateMutation } from "./__generated__/PresignedUrlCreateMutation";

type DragAndDropProps = {
  handleFileDrop: (_files: File[]) => void;
  disabled: boolean;
  children: ReactNode;
};

const DragAndDrop = ({
  handleFileDrop,
  disabled,
  children,
}: DragAndDropProps) => {
  const [dragging, setDragging] = useState(false);
  const dragCounterRef = useRef(0);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleDrag = useCallback((e: any) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: any) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = dragCounterRef.current + 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: any) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = dragCounterRef.current - 1;
    if (dragCounterRef.current === 0) {
      setDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileDrop(e.dataTransfer.files);
      e.dataTransfer.clearData();
      dragCounterRef.current = 0;
    }
  }, []);

  const addListeners = useCallback(() => {
    console.log("add listeners");
    if (dropRef && dropRef.current) {
      dropRef.current.addEventListener("dragenter", handleDragIn);
      dropRef.current.addEventListener("dragleave", handleDragOut);
      dropRef.current.addEventListener("dragover", handleDrag);
      dropRef.current.addEventListener("drop", handleDrop);
    }
  }, []);

  const removeListeners = useCallback(() => {
    console.log("remove listeners");
    if (dropRef && dropRef.current) {
      dropRef.current.removeEventListener("dragenter", handleDragIn);
      dropRef.current.removeEventListener("dragleave", handleDragOut);
      dropRef.current.removeEventListener("dragover", handleDrag);
      dropRef.current.removeEventListener("drop", handleDrop);
    }
  }, []);

  useEffect(() => {
    if (disabled) {
      removeListeners();
    } else {
      addListeners();
    }
  }, [disabled]);

  return (
    <DragAndDropContainer
      style={{ position: "relative" }}
      ref={dropRef}
      dragging={!disabled && dragging}
    >
      {children}
    </DragAndDropContainer>
  );
};

const DragAndDropContainer = styled.div<{ dragging: boolean }>`
  border: 2px dotted;
  border-radius: ${theme.ui.borderWavyRadius};
  border-color: ${({ dragging }) =>
    dragging ? theme.colors.purple : theme.ui.borderColor};
  width: 100%;
  height: 80px;
`;

type UploaderProps = {
  pathPrefix: string;
};

export const Uploader = ({ pathPrefix }: UploaderProps) => {
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [presignedUrlCreate] = useMutation<PresignedUrlCreateMutation>(
    PRESIGNED_URL_CREATE
  );

  const upload = async (files: File[]) => {
    setFilesToUpload([...files]);

    for (const file of files) {
      const { data } = await presignedUrlCreate({
        variables: { input: { path: `${pathPrefix}/${file.name}` } },
      });
      const url = data?.presignedUrlCreate?.presignedUrl;
      if (url) {
        console.log("uploading to:", url);
        const result = await fetch(url, {
          method: "PUT",
          body: file,
        });
        console.log("uploaded:");
        console.log(result);
        // call mutation to backend to save url
      }
    }

    setFilesToUpload([]);
  };

  return (
    <DragAndDrop handleFileDrop={upload} disabled={!!filesToUpload.length}>
      <UploaderContainer>
        <input
          className="uploader-input"
          type="file"
          multiple
          accept="audio/*,image/*,video/*"
          disabled={!!filesToUpload.length}
          onChange={(e) => {
            if (e.target.files) {
              upload(Array.from(e.target.files));
            }
          }}
        />
        {!filesToUpload.length && (
          <h3 className="uploader-empty-text">
            Drag and drop/click to upload assets
          </h3>
        )}
        {filesToUpload.map((file, i) => (
          <div key={i} className="uploader-file">
            <div>Uploading...</div>
            <div>{file.name}</div>
          </div>
        ))}
      </UploaderContainer>
    </DragAndDrop>
  );
};

const PRESIGNED_URL_CREATE = gql`
  mutation PresignedUrlCreateMutation($input: PresignedUrlCreateInput!) {
    presignedUrlCreate(input: $input) {
      presignedUrl
    }
  }
`;

const UploaderContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  padding: ${theme.spacings(3)};

  .uploader-input {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .uploader-empty-text {
    margin: auto;
  }

  .uploader-file {
    border: 1px solid ${theme.ui.borderColor};
    height: 100%;
    margin-right: ${theme.spacings(2)};
    padding: ${theme.spacings(2)};
  }
`;
