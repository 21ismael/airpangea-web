import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import apple_icon from '../../assets/svg/apple-icon.svg';
import google_icon from '../../assets/svg/google-icon.svg';
import WebServices from '../../services/WebServices';

export default function Login({ showDialog, setShowDialog, updateUser, openSignupDialog}) { 
    const webServices = new WebServices();
    
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

   

    const resetFields = () => {
        setEmail('');
        setPassword('');
    };

    let closeDialog = () => {
        setShowDialog(false);
        setErrorMessage('');
        resetFields();
    };

    const changeDialog = () => {
        closeDialog(); 
        openSignupDialog();
    }

    const handleLogin = async (event) => {
        event.preventDefault();

        if (!email || !password) {
            setErrorMessage(t('login.empty_field_error'));
            return;
        }
    
        const loginData = {
            email,
            password
        };
    
        try {
            const data = await webServices.auth(loginData);
    
            alert(`User info: ${JSON.stringify(data)}`);
            localStorage.setItem('user', JSON.stringify(data));
            updateUser(data);
            closeDialog();
            resetFields();
            setErrorMessage("");
        } catch (error) {
            console.error('Error in Login component:', error);
            setErrorMessage(t('login.invalid_credentials_error'));
        }

        console.log(errorMessage)
    };

    return (
        <>
            {showDialog && (
                <div className="dialog-overlay">
                    <div className="dialog">
                        <button onClick={closeDialog} className='btn-close'></button>
                        <div className="form-container" onClick={(e) => e.stopPropagation()}>
                            <p className="title">{t('login.title')}</p>

                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                            
                            <form className="form" onSubmit={handleLogin}>
                                <input
                                    type="email"
                                    className="input"
                                    placeholder={t('login.email_placeholder')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <div className='d-flex flex-column'>
                                    <input
                                        type="password"
                                        className="input"
                                        placeholder={t('login.password_placeholder')}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <p className="page-link">
                                        <span className="page-link-label">{t('login.forgot_password')}</span>
                                    </p>
                                </div>
                                <button className="form-btn btn-p" type="submit">{t('login.log_in')}</button>
                            </form>
                            <p className="sign-up-label">
                                {t('login.sign_up_prompt')} <span className="sign-up-link" onClick={changeDialog}>{t('login.sign_up')}</span>
                            </p>

                            <div className="buttons-container">
                                <div className="apple-login-button">
                                    <img src={apple_icon} alt='apple icon' />
                                    <span>{t('login.login_with_apple')}</span>
                                </div>
                                <div className="google-login-button">
                                    <img src={google_icon} alt='google icon' />
                                    <span>{t('login.login_with_google')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
