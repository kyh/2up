import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { Input } from "./Input";

type Props = {
  amount: number;
  autoFocus: boolean;
  inputRegExp: RegExp;
  password: boolean;
  handleOutputString: (value: string) => void;
};

export const LetterInputBox = (props: Props) => {
  const [characters, setCharacters] = useState({
    characterArray: Array(props.amount).fill(null),
  });

  const inputElements = useRef<Record<string, HTMLInputElement>>({});

  useEffect(() => {
    const input = inputElements.current["input0"];
    if (props.autoFocus && input) input.select();
  }, []);

  useEffect(() => {
    props.handleOutputString(characters.characterArray.join(""));
  }, [characters.characterArray]);

  const handleChange = ({ target }: { target: HTMLInputElement }) => {
    if (target.value.match(props.inputRegExp)) {
      focusNextChar(target);
      setModuleOutput();
    } else {
      target.value =
        characters.characterArray[target.name.replace("input", "") as any];
    }
  };

  const handleKeyDown = ({ target, key }: any) => {
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

  const handleFocus = ({ target }: { target: HTMLInputElement }) => {
    setTimeout(target.select, 0);
  };

  const focusPrevChar = (target: HTMLInputElement) => {
    const prevSibling = target.previousElementSibling as HTMLInputElement;
    if (prevSibling !== null) {
      prevSibling.focus();
    }
  };

  const focusNextChar = (target: HTMLInputElement) => {
    const nextSibling = target.previousElementSibling as HTMLInputElement;
    if (nextSibling !== null) {
      nextSibling.focus();
    }
  };

  const setModuleOutput = () => {
    setCharacters((characters) => {
      let updatedCharacters = characters.characterArray.map(
        (_character, number) => {
          return inputElements.current["input" + number].value;
        }
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
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          onFocus={handleFocus}
          name={`input${i}`}
          ref={(el) => {
            if (!el) return;
            inputElements.current[el.name] = el;
          }}
        />
      );
    });
  };

  return <InputContainer>{renderItems()}</InputContainer>;
};

const InputContainer = styled.div``;

const InputBox = styled(Input)``;
