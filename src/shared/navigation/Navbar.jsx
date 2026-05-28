import React, { useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';

import NewAuthContext from '../context/AuthContext';
import ModalMenu from './ModalMenu';
import Backdrop from '../ui-ux/Backdrop';

import Logo from '../util/img/Logo__Clean.png';

import classes from './Navbar.module.css';

function Navbar() {
  const { isLoggedIn, userData, logoutHandler } = useContext(NewAuthContext);
  const [modalMenuIsShown, setModalMenuIsShown] = useState(false);

  return (
    <>
      {modalMenuIsShown && (
        <>
          <ModalMenu onClick={() => setModalMenuIsShown((state) => !state)} />
          <Backdrop onClick={() => setModalMenuIsShown((state) => !state)} />
        </>
      )}
      <nav className={`${classes['nav-bar']}`}>
        <button
          type="button"
          className={`${classes['nav-bar__sandwich-menu']}`}
          aria-label="Open navigation menu"
          onClick={() => setModalMenuIsShown((state) => !state)}
        >
          <span />
          <span />
          <span className={`${classes['nav-bar__sandwich-bar--last']}`} />
        </button>
        <Link to="/" className={`${classes['nav-bar__logo']}`}>
          {/* <h2>WEBFLARE</h2> */}
          <div className={`${classes['nav-bar__logo-container']}`}>
            <img src={Logo} alt="Webflare" />
          </div>
        </Link>
        <ul className={`${classes['nav-bar__links']}`}>
          {userData && (
            <>
              <li className={`${classes['nav-bar__link']}`}>
                <NavLink to={`/users/${userData.id}/profile`} exact>
                  My Profile
                </NavLink>
              </li>
              <li className={`${classes['nav-bar__link']}`}>
                <NavLink
                  to={userData.id && `/users/${userData.id}/offers`}
                  exact
                >
                  My Offers
                </NavLink>
              </li>
              <li className={`${classes['nav-bar__link']}`}>
                <NavLink
                  to={userData.id && `/users/${userData.id}/create-business`}
                  exact
                >
                  Add Business
                </NavLink>
              </li>
              <li className={userData.id && `${classes['nav-bar__link']}`}>
                <NavLink to="/" exact onClick={logoutHandler}>
                  Logout
                </NavLink>
              </li>
            </>
          )}
          {!isLoggedIn && (
            <li
              className={`${classes['nav-bar__link']} ${classes['nav-bar__link--cta']}`}
            >
              <NavLink to="/auth" exact>
                Login
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
