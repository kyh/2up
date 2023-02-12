import { classed } from "@tw-classed/react";

const CheckboxContainer = classed.label("relative inline-block p-3 m-0 checkbox path")

const CheckboxInput = classed.input(
  "peer w-[21px] h-[21px] block appearance-none relative outline-none border-none m-0 p-0",
  "transition-shadow duration-300 cursor-pointer rounded",
  "shadow-[inset_0_0_0_2px] shadow-black dark:shadow-white active:shadow-purple"
);

const CheckboxSvg = classed.svg(
  "w-[21px] h-[21px] block pointer-events-none fill-none absolute top-0 left-0 m-3",
  "stroke-2 [stroke-linecap:round] [stroke-linejoin:round] stroke-purple",
  "[stroke-dasharray:86.12] [stroke-dashoffset:86.12]",
  "[transition:stroke-dasharray_0.6s_,_stroke-dashoffset_0.6s]",
  "peer-checked:delay-[0.4s] peer-checked:[stroke-dasharray:16.1_86.12] peer-checked:[stroke-dashoffset:102.22]"
);

export const Checkbox = ({ ...rest }) => {
  return (
    <CheckboxContainer>
      <CheckboxInput type="checkbox" {...rest} />
      <CheckboxSvg 
        viewBox="0 0 21 21"
       >
        <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186" />
      </CheckboxSvg>
    </CheckboxContainer>
  );
};
