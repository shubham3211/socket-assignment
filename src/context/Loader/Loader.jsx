import * as React from "react";
const LoaderContext = React.createContext();
const LoaderDispatchContext = React.createContext();

const LOADER_ACTIONS = {
  LOAD: "load",
  STOP: "stop",
};

const getLoaderState = () => {
  const context = React.useContext(LoaderContext);
  if (!context && context != false) {
    throw new Error("getLoaderState should be used inside LoaderProvider");
  }
  return context;
};

const spinLoaderFactory = () => {
  const dispatch = React.useContext(LoaderDispatchContext);
  if (!dispatch) {
    throw new Error("spinLoaderFactory should be used inside LoaderProvider");
  }
  return () => dispatch({ type: LOADER_ACTIONS.LOAD });
};

const stopLoaderFactory = () => {
  const dispatch = React.useContext(LoaderDispatchContext);
  if (!dispatch) {
    throw new Error("stopLoaderFactory should be used inside LoaderProvider");
  }
  return () => dispatch({ type: LOADER_ACTIONS.STOP });
};

function loaderReducer(state, action) {
  switch (action.type) {
    case LOADER_ACTIONS.LOAD:
      return true;
    case LOADER_ACTIONS.STOP:
      return false;
    default:
      return state;
  }
}

function LoaderProvider({ children }) {
  const [state, dispatch] = React.useReducer(loaderReducer, false);
  return (
    <LoaderContext.Provider value={state}>
      <LoaderDispatchContext.Provider value={dispatch}>
        {children}
      </LoaderDispatchContext.Provider>
    </LoaderContext.Provider>
  );
}

export { LoaderProvider, getLoaderState, spinLoaderFactory, stopLoaderFactory };
