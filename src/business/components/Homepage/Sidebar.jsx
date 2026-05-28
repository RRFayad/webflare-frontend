import React, { useRef, useContext, useEffect } from 'react';

import BusinessContext from '../../../shared/context/BusinessContext';
import SidebarFilters from './SidebarFilters';

import classes from './Sidebar.module.css';

function SideBar() {
  const { filterHandler, businessesList } = useContext(BusinessContext);

  const minPriceRef = useRef(0);
  const maxPriceRef = useRef(Infinity);
  const minProfitRef = useRef(0);
  const maxProfitRef = useRef(Infinity);

  const filterValueChangeHandler = (event) => {
    if (event.target.id === 'min-price' || event.target.id === 'max-price') {
      filterHandler({
        type: 'SET_PRICE_FILTER',
        payload: {
          minValue: Number(minPriceRef.current.value),
          maxValue: Number(maxPriceRef.current.value || Infinity),
        },
      });
    }
    if (event.target.id === 'min-profit' || event.target.id === 'max-profit') {
      filterHandler({
        type: 'SET_PROFIT_FILTER',
        payload: {
          minValue: Number(minProfitRef.current.value),
          maxValue: Number(maxProfitRef.current.value || Infinity),
        },
      });
    }
  };

  return (
    <aside className={classes.sidebar}>
      {businessesList.length ? (
        <p>
          1 - {businessesList.length} of {businessesList.length} results
        </p>
      ) : (
        <p>No results</p>
      )}

      <div className={classes.sidebar__items}>
        <SidebarFilters />
        <div className={`${classes['price-filter']}`}>
          <p>Asking Price</p>
          <div className={`${classes['price-filter__container']}`}>
            <input
              type="number"
              id="min-price"
              placeholder="Min"
              aria-label="Minimum asking price"
              ref={minPriceRef}
              onChange={filterValueChangeHandler}
            />
            -
            <input
              type="number"
              id="max-price"
              placeholder="Max"
              aria-label="Maximum asking price"
              ref={maxPriceRef}
              onChange={filterValueChangeHandler}
            />
          </div>
        </div>
        <div className={`${classes['profit-filter']}`}>
          <p>Monthly Profit</p>
          <div className={`${classes['profit-filter__container']}`}>
            <input
              type="number"
              id="min-profit"
              placeholder="Min"
              aria-label="Minimum monthly profit"
              ref={minProfitRef}
              onChange={filterValueChangeHandler}
            />
            -
            <input
              type="number"
              id="max-profit"
              placeholder="Max"
              aria-label="Maximum monthly profit"
              ref={maxProfitRef}
              onChange={filterValueChangeHandler}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

export default SideBar;
