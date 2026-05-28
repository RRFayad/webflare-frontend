import React, { useContext, useEffect, useState } from 'react';

import Navbar from '../../shared/navigation/Navbar';
import Footer from '../../shared/navigation/Footer';

import BusinessContext from '../../shared/context/BusinessContext';
import NewAuthContext from '../../shared/context/AuthContext';
import UserCard from '../components/UserCard';
import BusinessList from '../../business/components/Homepage/BusinessList';
import LoadingSpinner from '../../shared/ui-ux/LoadingSpinner';
import debugLog from '../../shared/util/logger';

import classes from './Profile.module.css';

function Profile() {
  const { allBusinesses, getBusinessesByUserId } = useContext(BusinessContext);
  const { userData } = useContext(NewAuthContext);
  const [usersBusinesses, setUsersBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // const usersBusiness = allBusinesses.filter(
  //   (item) => item.ownerId === userData.id
  // );
  useEffect(() => {
    const fetchBusinesses = async () => {
      setIsLoading(true);
      try {
        const responseData = await getBusinessesByUserId(userData.id);
        setUsersBusinesses(responseData);
        setIsLoading(false);
      } catch (error) {
        setUsersBusinesses([]);
        setIsLoading(false);
        debugLog('Error fetching businesses');
      }
    };
    fetchBusinesses();
  }, []);

  return (
    <>
      <Navbar />
      <main className={classes.main}>
        <h1 className={classes['user-info__title']}>Personal Info:</h1>
        <UserCard />
        <hr />
        {isLoading && (
          <div className={classes['businesses-list__title']}>
            <LoadingSpinner />
          </div>
        )}
        {!isLoading && usersBusinesses.length === 0 && (
          <h1 className={classes['businesses-list__title']}>
            No Business Found!
          </h1>
        )}
        {!isLoading && usersBusinesses.length > 0 && (
          <>
            <h1 className={classes['businesses-list__title']}>
              Your Businesses:
            </h1>
            <BusinessList businessesList={usersBusinesses} />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

export default Profile;
