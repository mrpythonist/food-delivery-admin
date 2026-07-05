import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { loginRequest, logoutRequest, getMe } from '../api/auth';
import { getToken, setToken, getUser, setUser, clearAuth } from '../services/authStorage';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setCurrentUser] = useState(getUser());

  const [loading, setLoading] = useState(true);

  const [authenticated, setAuthenticated] = useState(!!getToken());

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    const token = getToken();

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await getMe();

      setCurrentUser(response.data);

      setUser(response.data);

      setAuthenticated(true);
    } catch {
      clearAuth();

      setAuthenticated(false);

      setCurrentUser(null);
    }

    setLoading(false);
  }

  async function login(email, password) {
    const response = await loginRequest(email, password);

    const token = response.data.token;

    setToken(token);

    const me = await getMe();

    setUser(me.data);

    setCurrentUser(me.data);

    setAuthenticated(true);

    return me.data;
  }

  async function logout() {
    try {
      await logoutRequest();
    } catch (error) {
      console.log(error);
    }

    clearAuth();

    setAuthenticated(false);

    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        authenticated,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node
};
