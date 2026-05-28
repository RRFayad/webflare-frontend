/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useCallback, useEffect, useState } from 'react';

import axios from 'axios';

import { formHookDataMapper } from '../util/validators-and-formatters';
import debugLog from '../util/logger';

const AuthContext = React.createContext({
  isLoggedIn: false,
  signUpHandler: () => {},
  loginHandler: () => {},
  logoutHandler: () => {},
  getUserData: () => {},
  updateProfileHandler: () => {},
  updatePasswordHandler: () => {},
  userData: {},
  serverDomain: undefined,
  tokenValue: null,
});

let logoutTimer; // Saved here bcs didn't need to manage state in the Context

export function AuthContextProvider(props) {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(undefined);

  const url = {
    domain: process.env.REACT_APP_BACKEND_DOMAIN_URL,
    signUp: `${process.env.REACT_APP_BACKEND_DOMAIN_URL}/api/users/signup`,
    login: `${process.env.REACT_APP_BACKEND_DOMAIN_URL}/api/users/login`,
    userData: `${process.env.REACT_APP_BACKEND_DOMAIN_URL}/api/users`, // /:uid
    updatePassword: `${process.env.REACT_APP_BACKEND_DOMAIN_URL}/api/users/update-password`, // /:uid
  };

  const logoutHandler = () => {
    localStorage.removeItem('userData');
    setToken(null);
    setUserData(null);
    clearTimeout(logoutTimer);
    debugLog('User logged out!!');
  };

  const signUpHandler = async (formUserData) => {
    const newUserData = formHookDataMapper(formUserData);
    const formFields = Object.keys(newUserData);

    const formData = new FormData();
    formFields.forEach((fieldName) => {
      formData.append(fieldName, newUserData[fieldName]);
    });

    try {
      const response = await axios.post(url.signUp, formData);
      setUserData(response.data.user);
      setToken(response.data.token);
      localStorage.setItem(
        'userData',
        JSON.stringify({
          token: response.data.token,
          userId: response.data.user.id,
        })
      );
      logoutTimer = setTimeout(
        logoutHandler,
        response.data.token.expirationTime - Date.now()
      );
    } catch (error) {
      alert(`Error creating user: ${error.response.data.message}`);
    }
  };

  const loginHandler = async (formUserData) => {
    const toBeLoggedUserData = formHookDataMapper(formUserData);

    try {
      const response = await axios.post(url.login, toBeLoggedUserData);
      setToken(response.data.token);
      setUserData(response.data.user);
      logoutTimer = setTimeout(
        logoutHandler,
        response.data.token.expirationTime - Date.now()
      );
      localStorage.setItem(
        'userData',
        JSON.stringify({
          token: response.data.token,
          userId: response.data.user.id,
        })
      );
    } catch (error) {
      alert(`Error fetching user: ${error.response.data.message}`);
    }
  };

  const getUserData = async (userId) => {
    let response;
    try {
      response = await axios.get(`${url.userData}/${userId}`);
    } catch (error) {
      alert(`Error creating user: ${error.response.data.message}`);
    }
    return response.data.user;
  };

  const updateProfileHandler = async (data) => {
    const profileData = formHookDataMapper(data);
    const formFields = Object.keys(profileData);

    const formData = new FormData();
    formFields.forEach((fieldName) => {
      formData.append(fieldName, profileData[fieldName]);
    });

    try {
      const response = await axios.patch(
        `${url.userData}/${userData.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      debugLog('User updated:', response);
      setUserData(response.data.user);
      localStorage.setItem(
        'userData',
        JSON.stringify({ token, userId: response.data.user.id })
      );
    } catch (error) {
      alert(`Error updating user: ${error.response.data.message}`);
    }
  };

  const updatePasswordHandler = async (data) => {
    const profileData = formHookDataMapper(data);

    try {
      const response = await axios.patch(
        `${url.updatePassword}/${userData.id}`,
        profileData
      );
      debugLog('Password updated:', response.data.message);
    } catch (error) {
      alert(`Error updating user: ${error.response.data.message}`);
    }
  };

  useEffect(() => {
    const getLoggedUserData = async () => {
      const localUserData = JSON.parse(localStorage.getItem('userData'));
      if (localUserData) {
        const fetchedUserData = await getUserData(localUserData.userId);
        setToken(localUserData.token);
        setUserData(fetchedUserData);
        logoutTimer = setTimeout(
          logoutHandler,
          localUserData.token.expirationTime - Date.now()
        );
      }
    };
    getLoggedUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signUpHandler,
        loginHandler,
        logoutHandler,
        getUserData,
        updateProfileHandler,
        updatePasswordHandler,
        userData,
        isLoggedIn: !!token,
        serverDomain: url.domain,
        tokenValue: token ? token.value : null,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
