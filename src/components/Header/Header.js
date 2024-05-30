import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Header.css';
import nav from '../../utils/nav';
import logo_r_w from '../../assets/svg/logo-r-w.svg';
import logo_r from '../../assets/svg/logo-r.svg';
import user_icon from '../../assets/svg/user-icon.svg';
import logout_icon from '../../assets/svg/logout-icon.svg';
import Login from '../Login/Login';
import SignUp from '../SignUp/SignUp';

export default function Header() {
    /*Language*/
    let { t, i18n } = useTranslation();
    let changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    /*Dialog for login and register*/
    let [showLoginDialog, setShowLoginDialog] = useState(false);
    let [showSignupDialog, setShowSignupDialog] = useState(false);

    let openLoginDialog = () => {
        setShowLoginDialog(true);
    };

    let openSignupDialog = () => {
        setShowSignupDialog(true);
    };

    //Comprueba si el usuario esta logeado
    const [user, setUser] = useState(null);
    const updateUser = (userData) => {
        setUser(userData);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null); // Actualiza el estado user al cerrar sesión
    };

    return <>
        <Login showDialog={showLoginDialog} setShowDialog={setShowLoginDialog} updateUser={updateUser} openSignupDialog={openSignupDialog} />
        <SignUp showDialog={showSignupDialog} setShowDialog={setShowSignupDialog} openLoginDialog={openLoginDialog} />

        <div className='top-header'>

            <div className='top-header-content d-flex justify-content-end align-items-center mx-3 gap-3'>
                <select onChange={(e) => changeLanguage(e.target.value)}>
                    <option value="es">Español</option>
                    <option value="en">English</option>
                </select>
                {user ? (
                    <>
                        <span className='btn-p d-flex align-items-center gap-1'>
                            <img src={user_icon} alt='user icon' />
                            {user.user.name} {user.user.lastName}
                        </span>
                        <button className='btn-p d-flex align-items-center gap-1' onClick={handleLogout}>
                            <img src={logout_icon} alt='logout icon' />
                            {t('log_out')}
                        </button>
                    </>
                ) : (
                    <>
                        <button className='btn-p' onClick={openSignupDialog}>{t('sign_up')}</button>
                        <button className='btn-p' id='btn-login' onClick={openLoginDialog}>{t('log_in')}</button>
                    </>
                )}
            </div>
        </div>

        <div className='header'>
            <nav className="navbar" id="navbar">
                <div className="container-fluid">
                    <div className='nav-left-group'>
                        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <a className="navbar-brand" href="/">
                            <img src={logo_r_w} className="logo" alt="logo" />
                        </a>
                    </div>
                    <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
                        <div className="offcanvas-header">
                            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" style={{ margin: 0 }}>
                            </button>
                            <img src={logo_r} className="logo" alt='logo' />
                        </div>
                        <div className="offcanvas-body">
                            <ul className="navbar-nav">
                                <li className="nav-item">
                                    <a className="nav-link" href="/" onClick={nav}>{t('book_a_flight')}</a>
                                </li>
                                <li className="nav-item nav-link">
                                    {t('about_us')}
                                </li>
                                <li className="nav-item nav-link">
                                    {t('our_services')}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav >
        </div>

        <div className='bottom-header d-flex justify-content-center align-items-center'>
            <div className='container-1000 w-100 bottom-heder-content'>
                <div>
                    <h1>{t('header.title_1')} <br />{t('header.title_2')} <br /> {t('header.title_3')}</h1>
                    <button className='btn-p'>{t('header.more_info')}</button>
                </div>
            </div>
        </div>
    </>
}
