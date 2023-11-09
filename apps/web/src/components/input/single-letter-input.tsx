import { KeyboardEvent } from "react";
import { classed } from "@/lib/utils/classed";
import { useEffect, useRef, useState } from "react";
import { Input } from "./input";

type Props = {
  value?: string;
  autoFocus?: boolean;
  inputRegExp?: RegExp;
  password?: boolean;
  className?: string;
  onLetterChange?: (value: string) => void;
};

export const SingleLetterInput = ({
  value = "",
  autoFocus = true,
  inputRegExp = /^[a-z0-9]+$/i,
  className = "",
  onLetterChange = () => {},
}: Props) => {
  const [characters, setCharacters] = useState({
    characterArray: value.split(""),
  });

  const inputElements = useRef<Record<string, HTMLInputElement>>({});

  useEffect(() => {
    const input = inputElements.current["input0"];
    if (autoFocus && input) input.select();
  }, []);

  useEffect(() => {
    onLetterChange(characters.characterArray.join(""));
  }, [characters.characterArray]);

  const onChange = ({ target }: { target: HTMLInputElement }) => {
    if (target.value.match(inputRegExp)) {
      focusNextChar(target);
      setModuleOutput();
    } else {
      target.value =
        characters.characterArray[target.name.replace("input", "") as any];
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const key = e.key;
    const prevSibling = target.previousElementSibling as HTMLInputElement;
    if (key === "Backspace") {
      if (target.value === "" && prevSibling !== null) {
        prevSibling.value = "";
        focusPrevChar(target);
      } else {
        target.value = "";
      }
      setModuleOutput();
    } else if (key === "ArrowLeft") {
      focusPrevChar(target);
    } else if (key === "ArrowRight" || key === " ") {
      focusNextChar(target);
    }
  };

  const onFocus = ({ target }: { target: HTMLInputElement }) => {
    setTimeout(target.select, 0);
  };

  const focusPrevChar = (target: HTMLInputElement) => {
    const prevSibling = target.previousElementSibling as HTMLInputElement;
    if (prevSibling !== null) {
      prevSibling.focus();
    }
  };

  const focusNextChar = (target: HTMLInputElement) => {
    const nextSibling = target.nextElementSibling as HTMLInputElement;
    if (nextSibling !== null) {
      nextSibling.focus();
    }
  };

  const setModuleOutput = () => {
    setCharacters((characters) => {
      let updatedCharacters = characters.characterArray.map(
        (_character, number) => {
          return inputElements.current["input" + number].value;
        },
      );
      return { characterArray: updatedCharacters };
    });
  };

  const renderItems = () => {
    return characters.characterArray.map((c, i) => {
      return (
        <InputBox
          key={i}
          type="text"
          onKeyDown={onKeyDown}
          onChange={onChange}
          onFocus={onFocus}
          name={`input${i}`}
          maxLength={1}
          defaultValue={c.trim()}
          ref={(el) => {
            if (!el) return;
            inputElements.current[el.name] = el;
          }}
        />
      );
    });
  };

  return <InputContainer className={className}>{renderItems()}</InputContainer>;
};

const InputContainer = classed.div("flex");

const InputBox = classed(Input, "p-0 w-12 h-12 text-center");
