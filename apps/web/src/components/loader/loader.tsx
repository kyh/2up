import { useState, useEffect } from "react";
import { classed } from "~/utils/classed";

const STATES = {
  default: "default",
  loading: "loading",
  done: "done",
};

export const Loader = ({ loading = false, ...rest }) => {
  const [state, setState] = useState(STATES.default);

  useEffect(() => {
    if (state === STATES.default && loading) {
      setState(STATES.loading);
    } else if (state === STATES.loading && !loading) {
      setState(STATES.done);
      setTimeout(() => {
        setState(STATES.default);
      }, 3000);
    }
  }, [state, loading]);

  return (
    <LoaderContainer {...rest}>
      {state === STATES.loading && "Saving..."}
      {state === STATES.done && "Saved"}
    </LoaderContainer>
  );
};

const LoaderContainer = classed.div(
  "child:transition-opacity child:duration-200 child:ease-[ease]"
);
