import { ReactNode, useReducer } from "react";

export const createReducer = (initialState: any) => {
  return function reducer(state: any, action: any) {
    if (action.type === "RESET_STATE") {
      return { ...initialState };
    }
    if (state.hasOwnProperty(action.type)) {
      return { ...state, [action.type]: action.payload };
    }
    throw new Error(`Action type ${action.type} not defined`);
  };
};

const setName = (key: any) => {
  return "set" + key.charAt(0).toUpperCase() + key.slice(1);
};

const resetName = (key: any) => {
  return "reset" + key.charAt(0).toUpperCase() + key.slice(1);
};

export const createDispatchers = (dispatch: any, initialState: any) => {
  const keys = Object.keys(initialState);

  const standardDispatchers = keys.reduce((acc, key) => {
    const setFn = (payload: any) => dispatch({ type: key, payload });
    const resetFn = () => dispatch({ type: key, payload: initialState[key] });
    return {
      ...acc,
      [setName(key)]: setFn,
      [resetName(key)]: resetFn,
    };
  }, {});

  return {
    ...standardDispatchers,
    resetInitialState: () => dispatch({ type: "RESET_STATE" }),
  };
};

export const InitializeContext = (
  initialState: any
): { state: any; dispatchers: any } => {
  const reducer = createReducer(initialState);
  const [state, dispatch] = useReducer(reducer, initialState);
  const dispatchers = createDispatchers(dispatch, initialState);
  return { state, dispatchers };
};

export const Contextor = (
  Context: any,
  state: any,
  dispatchers: any,
  functions: any,
  children: ReactNode
) => {
  return (
    <Context.Provider
      value={{
        ...state,
        ...dispatchers,
        ...functions,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const ContextProvider = ({
  providers,
  children,
}: {
  providers: Array<any>;
  children: ReactNode;
}) => {
  if (!providers.length) {
    return children;
  }

  const [CurrentProvider, ...remainingProviders] = providers;

  return (
    <CurrentProvider>
      <ContextProvider providers={remainingProviders}>
        {children}
      </ContextProvider>
    </CurrentProvider>
  );
};
