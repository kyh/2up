import { useEffect, useState, ChangeEvent, KeyboardEvent } from "react";
import styled from "styled-components";
import { theme } from "~/styles/theme";

type Props = {
  defaultTags?: string[];
  max?: number;
  id?: HTMLInputElement["id"];
  type?: HTMLInputElement["type"];
  placeholder?: HTMLInputElement["placeholder"];
  onTagChange?: (value: string[]) => void;
};

export const TagInput = ({
  defaultTags = [],
  max = 3,
  id = "",
  type = "text",
  placeholder = "",
  onTagChange = () => {},
}: Props) => {
  const [input, setInput] = useState("");
  const [tags, setTags] = useState(defaultTags);
  const [isKeyReleased, setIsKeyReleased] = useState(false);

  useEffect(() => {
    onTagChange(tags);
  }, [tags]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const addTag = () => {
    const trimmedInput = input.trim();
    if (
      trimmedInput.length &&
      !tags.includes(trimmedInput) &&
      tags.length < max
    ) {
      setTags((prevState) => [...prevState, trimmedInput]);
      setInput("");
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      addTag();
    }

    if (
      e.key === "Backspace" &&
      !input.length &&
      tags.length &&
      isKeyReleased
    ) {
      const tagsCopy = [...tags];
      const poppedTag = tagsCopy.pop();
      e.preventDefault();
      setTags(tagsCopy);
      setInput(poppedTag || "");
    }

    setIsKeyReleased(false);
  };

  const onKeyUp = () => {
    setIsKeyReleased(true);
  };

  const deleteTag = (t: string) => {
    setTags((prevState) => prevState.filter((tag) => tag !== t));
  };

  return (
    <InputContainer>
      {tags.map((tag) => (
        <div className="tag" key={tag}>
          {tag}
          <button onClick={() => deleteTag(tag)}>x</button>
        </div>
      ))}
      <input
        id={id}
        type={type}
        value={input}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onChange={onChange}
        onBlur={addTag}
      />
    </InputContainer>
  );
};

const InputContainer = styled.div`
  display: flex;
  overflow: scroll;
  width: 100%;
  max-width: 100%;
  padding-left: ${theme.spacings(2)};
  border: 2px ${theme.ui.borderColor} solid;
  border-radius: ${theme.ui.borderWavyRadius};

  input {
    width: 100%;
    min-width: 50%;
    padding: ${theme.spacings(3)};
    padding-left: ${theme.spacings(2)};
    color: ${theme.ui.text};
    background: transparent;
    border: none;
    &:focus {
      outline: none;
    }
  }

  .tag {
    display: flex;
    align-items: center;
    margin: ${theme.spacings(2)} 0;
    margin-right: ${theme.spacings(3)};
    padding: 0 ${theme.spacings(3)};
    padding-right: ${theme.spacings(1)};
    background-color: ${theme.ui.backgroundPurple};
    white-space: nowrap;
  }

  .tag button {
    display: flex;
    padding: ${theme.spacings(1)};
  }
`;
