import { ServerResponse } from 'games/types';

export const reducerLogger = (reducer: any, eventList: Array<string>) => {
  return (state: any, response: ServerResponse) => {
    const newState = reducer(state, response);
    if (eventList.includes(response.event)) {
      console.log('REDUCER:', {
        prevState: state,
        serverResponse: response,
        newState
      });
    }
    return newState;
  };
};
