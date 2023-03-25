import React, { createContext, useReducer } from 'react';

export const NotificationContext = createContext();

const initialState = {
  message: '',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_MESSAGE':
      return {
        ...state,
        message: action.payload,
      };
    case 'CLEAR_MESSAGE':
      return {
        ...state,
        message: '',
      };
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  );
};
