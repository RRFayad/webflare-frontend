import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { NavLink, Link } from 'react-router-dom';

import SideDrawer from '../ui-ux/SideDrawer';
import NewAuthContext from '../context/AuthContext';
import classes from './ModalMenu.module.css';

function ModalMenu(props) {
  const { logoutHandler, isLoggedIn, userData } = useContext(NewAuthContext);

  return ReactDOM.createPortal(
    <SideDrawer onClick={props.onClick}>
      {isLoggedIn && (
        <>
          <div className={`${classes['modal-menu__links--nav-links']}`}>
            <li className={`${classes['modal-menu__link']}`}>
              <button type="button" onClick={props.onClick}>
                <NavLink to="/" exact>
                  HomePage
                </NavLink>
              </button>
            </li>

            <li className={`${classes['modal-menu__link']}`}>
              <button type="button" onClick={props.onClick}>
                <NavLink to={`/users/${userData.id}/profile`} exact>
                  My Profile
                </NavLink>
              </button>
            </li>
            <li className={`${classes['modal-menu__link']}`}>
              <button type="button" onClick={props.onClick}>
                <NavLink to={`/users/${userData.id}/offers`} exact>
                  My Offers
                </NavLink>
              </button>
            </li>
            <li className={`${classes['modal-menu__link']}`}>
              <button type="button" onClick={props.onClick}>
                <NavLink to={`/users/${userData.id}/create-business`} exact>
                  Add Business
                </NavLink>
              </button>
            </li>
            <li className={`${classes['modal-menu__link']}`}>
              <button type="button" onClick={props.onClick}>
                <a
                  href="https://github.com/RRFayad/webflare-api"
                  target="_blank"
                  rel="noreferrer"
                >
                  Github Repo
                </a>
              </button>
            </li>
          </div>
          <li className={`${classes['modal-menu__link']}`}>
            <button type="button" onClick={logoutHandler}>
              <NavLink to="/" exact>
                Logout
              </NavLink>
            </button>
          </li>
        </>
      )}
      {!isLoggedIn && (
        <>
          <li className={`${classes['modal-menu__link']}`}>
            <button type="button" onClick={props.onClick}>
              <a
                href="https://github.com/RRFayad/webflare-api"
                target="_blank"
                rel="noreferrer"
              >
                Github Repo
              </a>
            </button>
          </li>
          <li
            className={`${classes['modal-menu__link']} ${classes['modal-menu__link--cta']}`}
          >
            <button type="button">
              <NavLink to="/auth" exact>
                Login
              </NavLink>
            </button>
          </li>
        </>
      )}
    </SideDrawer>,
    document.querySelector('#modal'),
  );
}

export default ModalMenu;
