import * as React from "react";
const NotificationContext = React.createContext();
const NotificationDispatchContext = React.createContext();

const NOTIFICATION_ACTIONS = {
  SET_SUCCESS_NOTIFICATION: "set notification",
  SET_ERROR_NOTIFICATION: "set error notification",
  REMOVE_NOTIFICATION: "set error notification",
};

const NOTIFICATION_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
  NONE: "none",
};

const getNotificationState = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error("Context Should be used inside provider");
  }
  return context;
};

const setSuccessNotificationFactory = () => {
  const dispatch = React.useContext(NotificationDispatchContext);
  if (!dispatch) {
    throw new Error(
      "setSuccessNotificationFactory should be used inside NotificationProvider"
    );
  }
  return (notification) =>
    dispatch({
      type: NOTIFICATION_ACTIONS.SET_SUCCESS_NOTIFICATION,
      payload: {
        notificationType: NOTIFICATION_TYPES.SUCCESS,
        notification,
      },
    });
};

const setErrorNotificationFactory = () => {
  const dispatch = React.useContext(NotificationDispatchContext);
  if (!dispatch) {
    throw new Error(
      "setErrorNotificationFactory should be used inside NotificationProvider"
    );
  }
  return (notification) =>
    dispatch({
      type: NOTIFICATION_ACTIONS.SET_ERROR_NOTIFICATION,
      payload: {
        notificationType: NOTIFICATION_TYPES.ERROR,
        notification,
      },
    });
};

const removeNotificationFactory = () => {
  const dispatch = React.useContext(NotificationDispatchContext);
  if (!dispatch) {
    throw new Error(
      "removeNotificationFactory should be used inside NotificationProvider"
    );
  }
  return () =>
    dispatch({
      type: NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION,
      payload: {
        notificationType: NOTIFICATION_TYPES.NONE,
        notification: "",
      },
    });
};

function notificationReducer(state, action) {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.SET_SUCCESS_NOTIFICATION:
      return action.payload;
    case NOTIFICATION_ACTIONS.SET_ERROR_NOTIFICATION:
      return action.payload;
    case NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION:
      return action.payload;
    default:
      return state;
  }
}

const getNotificationTypes = () => ({ ...NOTIFICATION_TYPES });

function NotificationProvider({ children }) {
  const [state, dispatch] = React.useReducer(notificationReducer, {
    notificationType: NOTIFICATION_TYPES.NONE,
    notification: "",
  });
  return (
    <NotificationContext.Provider value={state}>
      <NotificationDispatchContext.Provider value={dispatch}>
        {children}
      </NotificationDispatchContext.Provider>
    </NotificationContext.Provider>
  );
}

export {
  NotificationProvider,
  getNotificationState,
  setSuccessNotificationFactory,
  setErrorNotificationFactory,
  removeNotificationFactory,
  getNotificationTypes,
};
