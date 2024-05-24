import React from 'react';
import { useTranslation } from 'react-i18next';
import './Header.css';
import nav from '../../utils/nav';
import logo_r_w from '../../assets/svg/logo-r-w.svg';
import logo_r from '../../assets/svg/logo-r.svg';

export default function Header() {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    return <>
        <div className='top-header'>
            <div className='top-header-content d-flex justify-content-end align-items-center mx-3 gap-3'>
                <select onChange={(e) => changeLanguage(e.target.value)}>
                    <option value="es">Español</option>
                    <option value="en">English</option>
                </select>
                <button>{t('sign_up')}</button>
                <button>{t('log_in')}</button>
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
                                <li className="nav-item nav-link">
                                    {t('log_out')}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav >
        </div>
    </>
}
