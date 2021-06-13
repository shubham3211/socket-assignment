import * as React from "react";
const UserContext = React.createContext();
const UserDispatchContext = React.createContext();

const USER_ACTIONS = {
  SET_USER: "set user",
  REMOVE_USER: "remove user",
};

const getUserState = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error("getUserState should be used inside UserProvider");
  }
  return context;
};

const setUserFactory = () => {
  const dispatch = React.useContext(UserDispatchContext);
  if (!dispatch) {
    throw new Error("setUser should be used inside UserProvider");
  }

  return (user) => {
    sessionStorage.setItem("user", JSON.stringify(user));
    dispatch({ type: USER_ACTIONS.SET_USER, payload: user });
  };
};

const removeUserFactory = () => {
  const dispatch = React.useContext(UserDispatchContext);
  if (!dispatch) {
    throw new Error("removeUserFactory should be used inside UserProvider");
  }
  return () => {
    sessionStorage.setItem("user", null);
    dispatch({ type: USER_ACTIONS.REMOVE_USER });
  };
};

function userReducer(state, action) {
  switch (action.type) {
    case USER_ACTIONS.SET_USER:
      return action.payload;
    case USER_ACTIONS.REMOVE_USER:
      return {};
    default:
      return state;
  }
}

function UserProvider({ children }) {
  const [state, dispatch] = React.useReducer(
    userReducer,
    sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user"))
      : {}
  );
  return (
    <UserContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}

export { UserProvider, getUserState, setUserFactory, removeUserFactory };
