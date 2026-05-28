/* eslint-disable react/jsx-no-constructed-context-values */
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import axios from 'axios';

import {
  filtersInitializer,
  filtersReducer,
  homePageFiltersHandler,
} from './business-filters-reducer';
import { businessTypesOptions, nichesOptions } from '../util/parameters';
import { formHookDataMapper } from '../util/validators-and-formatters';
import debugLog from '../util/logger';

const BusinessContext = React.createContext({
  // business parameters
  businessTypesOptions: [],
  nichesOptions: [],

  // business data
  allBusinesses: [],
  homePageBusinessesList: [],
  isLoading: false,
  fetchBusiness: () => {},
  fetchOwnerData: () => {},
  getBusinessesByUserId: () => {},
  addNewBusiness: () => {},
  updateBusiness: () => {},
  deleteBusiness: () => {},
  serverDomain: undefined,
});

export function BusinessContextProvider(props) {
  const [isLoading, setIsLoading] = useState(false); // Created this only to show that I am loading in the HomePage
  const [allBusinesses, setAllBusinesses] = useState([]);

  const [filters, dispatch] = useReducer(filtersReducer, filtersInitializer);
  const [homePageBusinessesList, setHomePageBusinessesList] =
    useState(allBusinesses);

  const url = {
    domain: process.env.REACT_APP_BACKEND_DOMAIN_URL,
    businesses: `${process.env.REACT_APP_BACKEND_DOMAIN_URL}/api/businesses/`,
    businessesByUser: `${process.env.REACT_APP_BACKEND_DOMAIN_URL}/api/businesses/user/`, // :uid
    ownerData: `${process.env.REACT_APP_BACKEND_DOMAIN_URL}/api/users/business/`, //  :bid
  };

  // Filters Logic (Front End Only)
  useEffect(() => {
    setHomePageBusinessesList(() =>
      homePageFiltersHandler(allBusinesses, filters)
    );
    // console.log(allBusinesses);
  }, [allBusinesses, filters]);

  const fetchBusinesses = async () => {
    setIsLoading(true);
    let response;
    try {
      response = await axios.get(`${url.businesses}`);
      setAllBusinesses(response.data.businesses);
      setIsLoading(false);
    } catch (error) {
      alert(`Error creating user: ${error.response.data.message}`);
      setIsLoading(false);
    }
    return response.data.businesses;
  };

  const addNewBusiness = async (data, token) => {
    const newBusinessData = { ...formHookDataMapper(data) };
    const formFields = Object.keys(newBusinessData);

    const formData = new FormData();
    formFields.forEach((fieldName) => {
      formData.append(fieldName, newBusinessData[fieldName]);
    });

    let response;
    try {
      response = await axios.post(url.businesses, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      debugLog('Business Created Successfully:', response);
    } catch (error) {
      debugLog(error);
      alert(`Error creating business: ${error.response.data.message}`);
    }

    await fetchBusinesses();
    return response.data.business;
  };

  const fetchBusiness = async (businessId) => {
    let response;
    try {
      response = await axios.get(`${url.businesses}${businessId}`);
    } catch (error) {
      debugLog(`Error creating user: ${error.response.data.message}`);
    }

    return response.data.business;
  };

  const fetchOwnerData = async (businessId) => {
    let response;
    try {
      response = await axios.get(`${url.ownerData}${businessId}`);
    } catch (error) {
      debugLog(`Error fetching user: ${error.response.data.message}`);
    }
    return response.data.user;
  };

  const getBusinessesByUserId = async (userId) => {
    let response;
    try {
      response = await axios.get(`${url.businessesByUser}${userId}`);
    } catch (error) {
      debugLog(`Error fetching user: ${error.response.data.message}`);
    }
    return response.data.businesses;
  };

  const updateBusiness = async (data, businessId, token) => {
    const businessData = {
      ...formHookDataMapper(data),
    };

    const formFields = Object.keys(businessData);

    const formData = new FormData();
    formFields.forEach((fieldName) => {
      formData.append(fieldName, businessData[fieldName]);
    });

    let response;
    try {
      response = await axios.patch(
        `${process.env.REACT_APP_BACKEND_DOMAIN_URL}/api/businesses/${businessId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      debugLog('Business updated:', response.data);
    } catch (error) {
      alert(`Error updating business: ${error.response.data.message}`);
    }
    await fetchBusinesses();
    return response.data.business;
  };

  const deleteBusiness = async (businessId, token) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_DOMAIN_URL}/api/businesses/${businessId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      debugLog('Business Deleted Successfully!');
    } catch (error) {
      alert(`Error updating user: ${error.response.data.message}`);
    }
    await fetchBusinesses();
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  return (
    <BusinessContext.Provider
      value={{
        // business parameters
        businessTypesOptions,
        nichesOptions,

        // business data
        allBusinesses,
        businessesList: homePageBusinessesList,
        isLoading,
        addNewBusiness,
        fetchBusiness,
        fetchOwnerData,
        getBusinessesByUserId,
        updateBusiness,
        filterHandler: dispatch,
        deleteBusiness,
        serverDomain: url.domain,
      }}
    >
      {props.children}
    </BusinessContext.Provider>
  );
}

export default BusinessContext;
