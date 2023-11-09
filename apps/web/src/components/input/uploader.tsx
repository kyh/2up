import { useState, useRef, useEffect, useCallback } from "react";
import { nanoid } from "nanoid";
import { classed } from "@/lib/utils/classed";
import { useMutation } from "@/lib/utils/mock";

type DragAndDropProps = {
  onFileDrop: (_files: File[]) => void;
  disabled: boolean;
  children: React.ReactNode;
};

const DragAndDrop = ({ onFileDrop, disabled, children }: DragAndDropProps) => {
  const [dragging, setDragging] = useState(false);
  const dragCounterRef = useRef(0);
  const dropRef = useRef<HTMLDivElement>(null);

  const handleDrag = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const dataTransfer = e.dataTransfer;
    dragCounterRef.current = dragCounterRef.current + 1;
    if (dataTransfer && dataTransfer.items && dataTransfer.items.length > 0) {
      setDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = dragCounterRef.current - 1;
    if (dragCounterRef.current === 0) {
      setDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const dataTransfer = e.dataTransfer;
    if (dataTransfer && dataTransfer.files && dataTransfer.files.length > 0) {
      onFileDrop(Array.from(dataTransfer.files));
      dataTransfer.clearData();
      dragCounterRef.current = 0;
    }
  }, []);

  const addListeners = useCallback(() => {
    if (dropRef && dropRef.current) {
      dropRef.current.addEventListener("dragenter", handleDragIn);
      dropRef.current.addEventListener("dragleave", handleDragOut);
      dropRef.current.addEventListener("dragover", handleDrag);
      dropRef.current.addEventListener("drop", handleDrop);
    }
  }, []);

  const removeListeners = useCallback(() => {
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
    <DragAndDropContainer dragging={!disabled && dragging} ref={dropRef}>
      {children}
    </DragAndDropContainer>
  );
};

const DragAndDropContainer = classed.div(
  "relative border-2 border-dotted rounded-wavy w-full h-4/5",
  {
    variants: {
      dragging: {
        true: "border-purple",
        false: "border-grey-dark dark:border-grey-light",
      },
    },
  },
);

type UploaderProps = {
  pathPrefix: string;
  onUploaded: (rawName: string, path: string) => Promise<void>;
};

export const Uploader = ({ pathPrefix, onUploaded }: UploaderProps) => {
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [presignedUrlCreate] = useMutation(PRESIGNED_URL_CREATE);

  const upload = async (files: File[]) => {
    setFilesToUpload([...files]);

    for (const file of files) {
      const extension = file.name.split(".").pop();
      const path = `${pathPrefix}/${nanoid()}.${extension}`;
      const { data } = await presignedUrlCreate({
        variables: { input: { path } },
      });
      const url = data?.presignedUrlCreate?.presignedUrl;
      if (url) {
        await fetch(url, { method: "PUT", body: file });
        await onUploaded(file.name, path);
      }
    }

    setFilesToUpload([]);
  };

  return (
    <DragAndDrop disabled={Boolean(filesToUpload.length)} onFileDrop={upload}>
      <UploaderContainer>
        <input
          accept="audio/*,image/*,video/*"
          className="absolute h-full w-full opacity-0"
          disabled={Boolean(filesToUpload.length)}
          multiple
          onChange={(e) => {
            if (e.target.files) {
              upload(Array.from(e.target.files));
            }
          }}
          type="file"
        />
        {!filesToUpload.length && (
          <h3 className="m-auto">Drag and drop/click to upload assets</h3>
        )}
        {filesToUpload.map((file, i) => (
          <div
            className="mr-2 h-full border border-grey-dark p-2 dark:border-grey-light"
            key={i}
          >
            <div>Uploading...</div>
            <div>{file.name}</div>
          </div>
        ))}
      </UploaderContainer>
    </DragAndDrop>
  );
};

const PRESIGNED_URL_CREATE = `
  mutation PresignedUrlCreateMutation($input: PresignedUrlCreateInput!) {
    presignedUrlCreate(input: $input) {
      presignedUrl
    }
  }
`;

const UploaderContainer = classed.div("flex w-full h-full p-3");
