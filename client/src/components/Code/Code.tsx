import { useState, useEffect, ChangeEvent } from "react";
import styled from "styled-components";
import { theme } from "styles/theme";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

const parseCodeContent = (content: string) => {
  const defaultValue = { code: "", language: "javascript" };
  if (content) {
    try {
      return JSON.parse(content);
    } catch (error) {
      return defaultValue;
    }
  }
  return defaultValue;
};

type Props = {
  content: string; // "{ code, language }"
  editable?: boolean;
  onFocus?: () => void;
  onBlur?: (content: string) => void;
};

export const Code = ({ content, editable, onFocus, onBlur }: Props) => {
  const c = parseCodeContent(content);
  const [code, setCode] = useState(c.code || "");
  const [language, setLanguage] = useState(c.language || "javascript");

  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  const onCodeChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const onCodeBlur = () => {
    if (onBlur) {
      onBlur(JSON.stringify({ code, language }));
    }
  };

  const codeBlock = (
    <pre>
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );

  if (editable) {
    return (
      <EditableCodeContainer>
        <textarea
          onChange={onCodeChange}
          onFocus={onFocus}
          value={code}
          onBlur={onCodeBlur}
        />
        {codeBlock}
      </EditableCodeContainer>
    );
  }

  return codeBlock;
};

const EditableCodeContainer = styled.div`
  position: relative;
  > textarea {
    width: 100%;
    height: 100%;
    padding: 1em;
    position: absolute;
    background-color: hsl(0deg 0% 0% / 0%);
    color: hsl(0deg 0% 0% / 0%);
    caret-color: ${theme.ui.text};
    font-family: Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace;
    font-size: 1em;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;
    resize: none;
  }
`;
