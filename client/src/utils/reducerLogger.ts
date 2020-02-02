export const reducerLogger = (reducer: any) => {
  return (state: any, response: any) => {
    const newState = reducer(state, response);
    console.log('REDUCER:', {
      ...response,
      newState
    });
    return newState;
  };
};
