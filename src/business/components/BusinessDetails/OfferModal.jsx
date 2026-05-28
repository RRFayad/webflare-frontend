import React, { useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { useHistory } from 'react-router-dom/cjs/react-router-dom';

import BusinessContext from '../../../shared/context/BusinessContext';
import NewAuthContext from '../../../shared/context/AuthContext';
import LoadingSpinner from '../../../shared/ui-ux/LoadingSpinner';
import { formatCurrency } from '../../../shared/util/validators-and-formatters';
import debugLog from '../../../shared/util/logger';

import classes from './OfferModal.module.css';

function OfferCard(props) {
  const { isLoggedIn, userData, serverDomain } = useContext(NewAuthContext);
  const { fetchOwnerData, isLoading } = useContext(BusinessContext);
  const [owner, setOwner] = useState(undefined);

  const history = useHistory();

  const {
    age,
    askingPrice,
    description,
    id,
    imageUrl,
    monthlyProfit,
    monthlyRevenue,
    niche,
    owner: ownerId,
    title,
    type,
  } = props.business;

  useEffect(() => {
    const getOwner = async (businessId) => {
      try {
        const fetchedOwner = await fetchOwnerData(businessId);
        setOwner(fetchedOwner);
      } catch (error) {
        setOwner(null);
        debugLog('Error fetching business');
      }
    };
    getOwner(id);
  }, []);

  return ReactDOM.createPortal(
    <div className={classes.modal}>
      {owner && (
        <>
          <header className={classes.modal__header}>
            <h2>{title}</h2>
            {props.onClick && (
              <button type="button" onClick={props.onClick}>
                &times;
              </button>
            )}
          </header>
          <main className={classes.modal__content}>
            <div className={classes['modal__user-info']}>
              <img src={`${serverDomain}/${owner.image}`} alt={owner.name} />
              <div className={classes.modal__container}>
                <dl className={classes.modal__items}>
                  <div className={classes.modal__item}>
                    <dt>Owner:</dt>
                    <dd>{owner.name}</dd>
                  </div>
                  <div className={classes.modal__item}>
                    <dt>Profile:</dt>
                    <dd>
                      <a
                        href={owner.profileUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {owner.profileUrl}
                      </a>
                    </dd>
                  </div>
                  <div className={classes.modal__item}>
                    <dt>Country:</dt>
                    <dd>{owner.country}</dd>
                  </div>
                  <div className={classes.modal__item}>
                    <dt>Active Businesses:</dt>
                    <dd>{owner.businesses.length}</dd>
                  </div>
                </dl>
                <p className={classes.modal__description}>
                  {owner.description}
                </p>
                <div className={classes.modal__price}>
                  <h4>Asking Price:</h4>
                  <p>{formatCurrency(askingPrice)}</p>
                </div>
              </div>
            </div>
          </main>
          <hr />
          <footer className={classes.modal__footer}>
            {(!isLoggedIn || userData.id !== owner.id) && (
              <>
                <button
                  type="button"
                  className={classes.modal__button}
                  onClick={() => {
                    isLoggedIn
                      ? history.push(
                          `${history.location.pathname}/create-offer`
                        )
                      : history.push('/auth');
                  }}
                >
                  Make Offer
                </button>
                <button
                  type="button"
                  className={`${classes.modal__button} ${classes['modal__button--cta']}`}
                  onClick={() => history.push(`/success/purchase`)}
                >
                  Buy it now for {formatCurrency(askingPrice)}
                </button>
              </>
            )}
            {isLoggedIn && userData.id === owner.id && (
              <button
                type="button"
                className={`${classes.modal__button} ${classes['modal__button--cta']}`}
                onClick={() =>
                  history.push(
                    `/users/${userData.id}/edit-business/${props.business.id}`
                  )
                }
              >
                EDIT BUSINESS INFO
              </button>
            )}
          </footer>
        </>
      )}
    </div>,
    document.querySelector('#modal')
  );
}

export default OfferCard;
