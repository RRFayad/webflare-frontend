import React, { useContext, useState, useEffect } from 'react';

import Navbar from '../../shared/navigation/Navbar';
import Footer from '../../shared/navigation/Footer';

import AuthContext from '../../shared/context/AuthContext';
import OffersContext from '../../shared/context/OffersContext';
import OffersList from '../components/OffersList';
import LoadingSpinner from '../../shared/ui-ux/LoadingSpinner';
import debugLog from '../../shared/util/logger';

import classes from './Offers.module.css';

function Offers() {
  const { userData } = useContext(AuthContext);
  const { fetchUserOffers } = useContext(OffersContext);
  const [userOffers, setUserOffers] = useState([]);
  const [filter, setFilter] = useState('Received Offers');
  const [offersToBeRendered, setOffersToBeRendered] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getUserOffers = async (userId) => {
    setIsLoading(true);
    try {
      const offersData = await fetchUserOffers(userId);
      setUserOffers(offersData);
      setOffersToBeRendered(offersData.receivedOffers);
      setIsLoading(false);
    } catch (error) {
      setUserOffers([]);
      setIsLoading(false);
      debugLog(error);
    }
  };

  useEffect(() => {
    getUserOffers(userData.id);
  }, []);

  const changeFilterHandler = (filterText) => {
    if (filterText === 'Received Offers') {
      setOffersToBeRendered(userOffers.receivedOffers);
    }
    if (filterText === 'Sent Offers') {
      setOffersToBeRendered(userOffers.sentOffers);
    }
  };

  return (
    <>
      <Navbar />
      <header className={classes.header}>
        <h1 className={classes.header__title}>{filter}</h1>
        <label htmlFor="filter" className={classes.header__label}>
          Show:
          <select
            name="filter"
            id="filter"
            className={classes.header__select}
            onChange={(e) => {
              changeFilterHandler(
                e.target.options[e.target.options.selectedIndex].textContent
              );
              setFilter(
                e.target.options[e.target.options.selectedIndex].textContent
              );
            }}
          >
            <option>Received Offers</option>
            <option>Sent Offers</option>
          </select>
        </label>
      </header>
      <hr />
      {isLoading && <LoadingSpinner overlay />}
      <main className={classes.main}>
        {!isLoading && offersToBeRendered.length === 0 && (
          <h1 className={classes['main--no-list']}>There Are No Offers Yet!</h1>
        )}
        {!isLoading && offersToBeRendered.length > 0 && (
          <OffersList
            offers={offersToBeRendered}
            updateOffersHandler={getUserOffers}
          />
        )}
      </main>
      <Footer />
    </>
  );
}

export default Offers;
