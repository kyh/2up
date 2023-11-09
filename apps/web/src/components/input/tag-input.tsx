"use client";

import { useEffect, useState, ChangeEvent, KeyboardEvent } from "react";
import { classed } from "@/lib/utils/classed";

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
        <div
          className="my-2 mr-3 flex items-center whitespace-nowrap bg-purple-background px-3 pr-1 dark:bg-purple-dark"
          key={tag}
        >
          {tag}
          <button className="flex p-1" onClick={() => deleteTag(tag)}>
            x
          </button>
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
        className="w-full min-w-[50%] border-none bg-transparent p-3 pl-2 text-black focus:outline-none dark:text-white"
      />
    </InputContainer>
  );
};

const InputContainer = classed.div(
  "flex overflow-scroll w-full max-w-full pl-2",
  "border-2 border-grey-dark dark:border-grey-light rounded-wavy",
);
