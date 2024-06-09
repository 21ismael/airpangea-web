import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import plane_icon from '../../assets/images/airplane_icon.png';
import user_icon from '../../assets/svg/user-icon-black.svg';
import credit_card from '../../assets/svg/credit-card.svg';
import convertToAP from '../../utils/convertToAP';
import getDate from '../../utils/getDate';
import { useNavigate } from 'react-router-dom';
import './Payment.css';
import './Print.css';
import codigo_barras from './9185553.png';
import paypal_logo from './paypal-logo.svg';
import logo_black from '../../assets/svg/logo-black.svg';

export default function Payment() {
    const { t } = useTranslation();
    const [flight, setFlight] = useState(null);
    const [passengers, setPassengers] = useState([null]);
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const [showDialog, setShowDialog] = useState(false);
    const printableRef = useRef();

    const openDialog = () => {
        setShowDialog(true);
    };

    const closeDialog = () => {
        setShowDialog(false);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedFlight = localStorage.getItem('flight');
        const addedPassengers = localStorage.getItem('addedPassengers');
        if (storedUser && storedFlight && addedPassengers) {
            setFlight(JSON.parse(storedFlight));
            setPassengers(JSON.parse(addedPassengers));
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handlePayAndPrint = () => {
        if (!email) {
            setErrorMessage('Por favor, introduzca su cuenat para realizar el pago.');
            return;
        }
        setShowDialog(false);
        window.print();
        navigate('/')
    };

    if (!flight) {
        return null;
    }

    let totalPrice = flight.price;
    if (passengers[0].fare === 'Regular') {
        totalPrice = totalPrice * 1.25;
    } else if (passengers[0].fare === 'Plus') {
        totalPrice = totalPrice * 1.5;
    }
    totalPrice = totalPrice * passengers.length;

    return (
        <>
            <div className='d-flex justify-content-center align-items-center buy-ticket'>
                <div className='container-1000 w-100' id="printable" ref={printableRef}>
                    <div className='logo-payment w-100 d-flex justify-content-center'>
                        <img src={logo_black} alt="logo" />
                    </div>

                    <div className='flight-title d-flex m-0 align-items-center'>
                        <h3>Información del vuelo </h3>
                        <img src={plane_icon} alt="Plane icon" />
                    </div>

                    {/* Información del vuelo seleccionado */}
                    <div className="flight-info">
                        <div className='row'>
                            <div className="col-4 col-md-2 date d-flex align-items-center">
                                <div className=''>{getDate(flight.departureDateTime)}</div>
                            </div>
                            <div className="col-8 col-md-5 cities d-flex align-items-center justify-content-end">
                                {flight.airportDeparture?.city} ----- <div className='codeAP'>{convertToAP(flight.id)}</div> ----- {flight.airportArrival?.city}
                            </div>
                            <div className="col-6 col-md-2 mt-2 fare d-flex flex-column justify-content-center">
                                {t('flight.fare')} <br /><span>{flight.price}€</span>
                            </div>
                            <div className="col-6 col-md-3 date d-flex align-items-center justify-content-end">
                                <div className=''>{getDate(flight.arrivalDateTime)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Información de pasajeros */}
                    <div className='flight-title d-flex m-0 align-items-center mt-4'>
                        <h3>Información de los pasajeros </h3>
                        <img src={user_icon} alt="User icon" className='user-icon' />
                    </div>
                    <div className="flight-info payment">
                        <div className='row'>
                            {passengers.map((passenger, index) => (
                                <div key={index} className='col-6 col-md-3'>
                                    <h5>Pasajero {index + 1}</h5>
                                    <p>Name: {passenger.passenger.name}</p>
                                    <p>Last Name: {passenger.passenger.lastName}</p>
                                    <p>Identity Number: {passenger.passenger.identityNumber}</p>
                                    <p>Fare: {passenger.fare}</p>
                                    <p>Seat: {passenger.seat}</p>
                                </div>
                            ))}

                            <img src={codigo_barras} alt='código de barras' />
                        </div>
                    </div>

                    {/* Pagar y descargar PDF */}
                    <div className='flight-title d-flex m-0 align-items-center mt-4'>
                        <h3>Información de Pago </h3>
                        <img src={credit_card} alt="Credit icon" className='credit-card' />
                    </div>
                    <div className="flight-info payment">
                        <div className='d-flex justify-content-between row'>
                            <div className='col-12 col-md-8'>
                                {passengers.length} x Pasajeros * (Precio Base + Incremento por tarifa) = {totalPrice} € + IVA
                            </div>
                            <button className='btn-p col-6 col-sm-4 mt-3 mt-sm-0' onClick={openDialog}>Pagar con Paypal</button>
                        </div>
                    </div>
                </div>
            </div>

            {showDialog && (
                <div className="dialog-overlay">
                    <div className="payment-dialog dialog">
                        <button className='btn-close' onClick={closeDialog}></button>
                        <div className='w-100 d-flex flex-column justify-content-center align-items-center mt-3'>
                            <img src={paypal_logo} alt="paypal logo" />
                            <h3>Pay with PayPal</h3>
                            <p>Enter your email to pay <b>{totalPrice}€</b> to <b>AirPangea S.L</b></p>
                            <input 
                                className='w-100' 
                                type='email' 
                                placeholder='Email or mobile number' 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {errorMessage && <p className="error-message">{errorMessage}</p>}
                            <button className='w-100 mt-3 btn-pay' onClick={handlePayAndPrint}>Confirm Pay and Download PDF</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
