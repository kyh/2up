import { classed } from "~/utils/classed";

const Container = classed.div("flex justify-center items-center h-4/5");

const SpinnerStyles = classed.div(
  "w-[140px] h-[30px] border-4 border-grey-dark dark:border-grey-light rounded-wavy",
  "bg-spinner-gradient-light dark:bg-spinner-gradient-dark [background-size:40px_40px]",
  "animate-[spinner_2s_linear_infinite]"
);

const SpinnerText = classed.div("text-center mb-2");

export const Spinner = () => {
  return (
    <Container>
      <div>
        <SpinnerText>Loading...</SpinnerText>
        <SpinnerStyles role="spinner" />
      </div>
    </Container>
  );
};
