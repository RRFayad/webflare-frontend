import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import BusinessContext from '../../shared/context/BusinessContext';
import OffersContext from '../../shared/context/OffersContext';
import AuthContext from '../../shared/context/AuthContext';
import { formatCurrency } from '../../shared/util/validators-and-formatters';
import LoadingSpinner from '../../shared/ui-ux/LoadingSpinner';
import debugLog from '../../shared/util/logger';

import classes from './OfferCard.module.css';

function OfferCard(props) {
  const history = useHistory();
  const { userData, serverDomain, tokenValue } = useContext(AuthContext);
  const { acceptOffer, denyOffer, fetchOffer } = useContext(OffersContext);
  const [isLoading, setIsLoading] = useState(false);

  const [offer, setOffer] = useState(undefined);
  const [stakeholder, setStakeHolder] = useState({});

  useEffect(() => {
    const getOfferData = async () => {
      setIsLoading(true);
      try {
        const offerData = await fetchOffer(props.offer.id);
        setOffer(offerData);
        setStakeHolder(() =>
          userData.id === offerData.sender.id
            ? offerData.business.owner
            : offerData.sender
        );
      } catch (error) {
        debugLog(error);
        setIsLoading(false);
      }
      setIsLoading(false);
    };
    getOfferData();
  }, []);

  return (
    <>
      {isLoading && <LoadingSpinner overlay />}
      {!isLoading && offer && (
        <li className={classes.card} key={offer.id}>
          <header className={classes.card__header}>
            <h2>{offer.business.title}</h2>
          </header>
          <main className={classes.card__content}>
            <div className={classes['card__user-info']}>
              <img
                src={`${serverDomain}/${stakeholder.image}`}
                alt={stakeholder.name}
              />
              <div className={classes.card__container}>
                <dl className={classes.card__items}>
                  <div className={classes.card__item}>
                    <dt>
                      {userData.id !== offer.sender.id ? 'Sender:' : 'Sent to:'}
                    </dt>
                    <dd>{stakeholder.name}</dd>
                  </div>
                  <div className={classes.card__item}>
                    <dt>Profile:</dt>
                    <dd>
                      <a
                        href={stakeholder.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {stakeholder.profileUrl}
                      </a>
                    </dd>
                  </div>
                  <div className={classes.card__item}>
                    <dt>Country:</dt>
                    <dd>{stakeholder.country}</dd>
                  </div>
                </dl>
                <p className={classes.card__description}>{offer.message}</p>
                <div className={classes.card__price}>
                  <h4>Offered Price:</h4>
                  <p className={classes['card__price--original-value']}>
                    {formatCurrency(offer.business.askingPrice)}
                  </p>
                  <p className={classes['card__price--offered-value']}>
                    {formatCurrency(offer.offerValue)}
                  </p>
                </div>
              </div>
            </div>
          </main>
          <hr />
          <footer className={classes.card__footer}>
            {userData.id !== offer.sender.id && offer.status === 'active' && (
              <>
                <button
                  type="button"
                  className={classes.card__button}
                  onClick={async () => {
                    setIsLoading(true);
                    await denyOffer(offer.id, tokenValue);
                    setIsLoading(false);
                    props.updateOffersHandler(userData.id);
                  }}
                >
                  Deny Offer
                </button>
                <button
                  type="button"
                  className={`${classes.card__button} ${classes['card__button--cta']}`}
                  onClick={async () => {
                    setIsLoading(true);
                    await acceptOffer(offer.id, tokenValue);
                    setIsLoading(false);
                    props.updateOffersHandler(userData.id);
                  }}
                >
                  Accept Offer
                </button>
              </>
            )}

            {offer.status === 'accepted' && (
              <p className={classes.card__status}>
                Accepted Offer! Moving forward with the contractual acquisition
                procedures.
              </p>
            )}

            {userData.id === offer.sender.id && offer.status !== 'accepted' && (
              <button
                type="button"
                className={`${classes.card__button} ${classes['card__button--cta']}`}
                onClick={() => history.push(`/business/${offer.business.id}`)}
              >
                View Business Details
              </button>
            )}
          </footer>
        </li>
      )}
    </>
  );
}

export default OfferCard;
