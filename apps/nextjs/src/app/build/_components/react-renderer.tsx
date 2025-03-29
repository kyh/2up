import { useState } from "react";
import {
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  useSandpack,
} from "@codesandbox/sandpack-react";
// import {
//   SandpackPreview,
//   SandpackProvider,
//   useSandpack,
// } from "@codesandbox/sandpack-react/unstyled";
import { CheckIcon, CopyIcon } from "lucide-react";

import type { SandpackFile } from "@codesandbox/sandpack-react";

export const ReactRenderer = ({
  files,
  onRequestFix,
}: {
  files: Record<string, SandpackFile>;
  onRequestFix?: (e: string) => void;
}) => {
  console.log("ReactRenderer", files);
  return (
    <SandpackProvider
      template="vite-react"
      files={files}
      customSetup={{
        dependencies,
      }}
    >
      <SandpackLayout>
        <SandpackFileExplorer />
        <SandpackCodeEditor showLineNumbers showInlineErrors />
        <SandpackPreview />
      </SandpackLayout>
    </SandpackProvider>
  );
};

const ErrorMessage = ({
  onRequestFix,
}: {
  onRequestFix: (e: string) => void;
}) => {
  const { sandpack } = useSandpack();
  const [didCopy, setDidCopy] = useState(false);

  if (!sandpack.error) return null;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/5 text-base backdrop-blur-sm">
      <div className="max-w-[400px] rounded-md bg-red-500 p-4 text-white shadow-xl shadow-black/20">
        <p className="text-lg font-medium">Error</p>

        <p className="mt-4 line-clamp-[10] overflow-x-auto font-mono text-xs whitespace-pre">
          {sandpack.error.message}
        </p>

        <div className="mt-8 flex justify-between gap-4">
          <button
            onClick={async () => {
              if (!sandpack.error) return;

              setDidCopy(true);
              await window.navigator.clipboard.writeText(
                sandpack.error.message,
              );
              await new Promise((resolve) => setTimeout(resolve, 2000));
              setDidCopy(false);
            }}
            className="rounded border-red-300 px-2.5 py-1.5 text-sm font-semibold text-red-50"
          >
            {didCopy ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
          </button>
          <button
            onClick={() => {
              if (!sandpack.error) return;
              onRequestFix(sandpack.error.message);
            }}
            className="rounded bg-white px-2.5 py-1.5 text-sm font-medium text-black"
          >
            Try to fix
          </button>
        </div>
      </div>
    </div>
  );
};

const dependencies = {
  "@react-three/drei": "*",
  "@react-three/fiber": "*",
  "@react-three/rapier": "*",
  "@react-three/postprocessing": "*",
  leva: "*",
  react: "*",
  "react-dom": "*",
  three: "*",
  phaser: "*",
};
