import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
  const { user } = useSelector((state) => state.users);
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(user?.email));

  useEffect(() => {
    setIsLoggedIn(Boolean(user?.email));
  }, [user]);

  const value = {
    isLoggedIn,
    user,
  };

  return <UserAuthContext.Provider value={value}>{children}</UserAuthContext.Provider>;
};

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUserAuth must be used within UserAuthProvider');
  }
  return context;
};
