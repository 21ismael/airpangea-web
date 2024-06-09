import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import convertToAP from '../../utils/convertToAP';
import getDate from '../../utils/getDate';
import './BuyTicket.css';
import plane_icon from '../../assets/images/airplane_icon.png';
import bolsa from '../../assets/svg/fare-icons/bolsa.svg';
import asiento from '../../assets/svg/fare-icons/asiento.svg';
import prioridad from '../../assets/svg/fare-icons/prioridad.svg';
import equipaje_pequeño from '../../assets/svg/fare-icons/equipaje-pequeño.svg';
import equipaje_grande from '../../assets/svg/fare-icons/equipaje-grande.svg';
import fare_basic from '../../assets/images/images-fare/fare-basic.webp';
import fare_regular from '../../assets/images/images-fare/fare-regular.webp';
import fare_plus from '../../assets/images/images-fare/fare-plus.webp';
import SeatMapPlane from './SeatMapPlane';
import WebServices from '../../services/WebServices';

export default function BuyTicket() {
    const { t } = useTranslation();
    const [flight, setFlight] = useState(null);
    const [selectedFare, setSelectedFare] = useState(null);
    const [passengerCount, setPassengerCount] = useState(null);
    const [passengers, setPassengers] = useState([]);
    const navigate = useNavigate();
    const webServices = new WebServices();

    const [error, setError] = useState('');

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const storedFlight = localStorage.getItem('flight');
        const storedPassengerCount = localStorage.getItem('passengerCount');

        if (storedFlight && storedPassengerCount) {
            setFlight(JSON.parse(storedFlight));
            setPassengerCount(storedPassengerCount);

            const initialPassengers = Array.from({ length: storedPassengerCount }, () => ({
                name: '',
                lastName: '',
                identityNumber: '',
                userId: storedUser.user.id,
                fare: '',
                seat: ''
            }));

            setPassengers(initialPassengers);
        } else {
            navigate('/');
        }
    }, [navigate]);

    if (!flight) {
        return null;
    }

    const handleSubmit = async (event) => {
        try {
            const emptyFields = passengers.some(passenger => !passenger.name || !passenger.lastName || !passenger.identityNumber || !passenger.seat);
            if (emptyFields) {
                setError("Por favor, complete todos los campos y asigne un asiento diferente para cada pasajero.");
                return;
            }

            const selectedSeats = passengers.map(passenger => passenger.seat);
            const duplicates = selectedSeats.some((seat, index) => selectedSeats.indexOf(seat) !== index);
            if (duplicates) {
                setError("Por favor, asegúrate de que cada pasajero tenga un asiento único.");
                return;
            }

            if(!selectedFare) {
                setError("Debe seleccionar una tarifa");
                return;
            }

            const updatedPassengers = passengers.map(passenger => ({
                ...passenger,
                fare: selectedFare
            }));

            console.log(updatedPassengers);

            const addedPassengers = [];

            for (const passenger of updatedPassengers) {
                let newPassenger = {
                    passenger: {
                        userId: passenger.userId,
                        name: passenger.name,
                        lastName: passenger.lastName,
                        identityNumber: passenger.identityNumber
                    },
                    fare: passenger.fare,
                    seat: passenger.seat
                };

                const addedPassengerResponse = await webServices.addPassenger(newPassenger.passenger);
                const addedPassenger = {
                    id: addedPassengerResponse.id,
                    ...newPassenger
                };
                console.log("Passenger added successfully:", addedPassenger);
                addedPassengers.push(addedPassenger);
            }

            console.log(addedPassengers);
            localStorage.setItem('addedPassengers', JSON.stringify(addedPassengers));
            console.log("All passengers added successfully");
            navigate('/buy-ticket/pay');
        } catch (error) {
            console.error('Error adding passengers:', error);
        }
    };


    const handlePassengerChange = (index, field, value) => {
        const updatedPassengers = passengers.map((passenger, i) => (
            i === index ? { ...passenger, [field]: value } : passenger
        ));
        setPassengers(updatedPassengers);
    };

    const generateSeatOptions = () => {
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        const seats = [];
        let seatIndex = 0;

        if (flight) {
            const seatArray = flight.seats.split('').filter(s => s !== ' ');

            seatArray.forEach((seat, index) => {
                const row = rows[Math.floor(seatIndex / 3)];
                const seatNumber = (seatIndex % 3) + 1;
                if (seat === 'O') {
                    seats.push(`${row}${seatNumber}`);
                }
                seatIndex++;
            });
        }

        return seats;
    };


    return (
        <>
            <div className='d-flex justify-content-center align-items-center buy-ticket'>
                <div className='container-1000 w-100'>
                    <div className='flight-title d-flex m-0 align-items-center'>
                        <h3>Tu vuelo seleccionado</h3>
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

                    {/* Select fare */}
                    <div className='select-fare mt-4 mb-1'>
                        <div className='flight-title d-flex m-0 align-items-center'>
                            <h3>Elige tu tarifa</h3>
                            <img src={plane_icon} alt="Plane icon" />
                        </div>
                        <p className='fare-text'>*El tipo de tarifa seleccionada se aplica a todos los pasajeros</p>
                    </div>

                    <div className='row m-0 p-0 d-flex justify-content-center'>
                        <div className='col-10 col-md-4 my-2'>
                            <div
                                onClick={() => setSelectedFare("Basic")}
                                className={`fare-card text-center d-flex flex-column gap-1 ${selectedFare === "Basic" ? 'selected-fare' : ''}`}
                            >
                                <img src={fare_basic} alt="img" />
                                <p className="fare-title mt-2 mb-0">TARIFA <span>BASIC</span></p>
                                <div className='fare-sentence d-flex align-items-center mx-2 my-1'>
                                    <img src={bolsa} alt='icon' />
                                    <p className='m-0 mx-1'>Bolsa en cabina</p>
                                </div>
                                <div className='fare-sentence d-flex align-items-center mx-2 my-1'>
                                    <img src={asiento} alt='icon' />
                                    <p className='m-0 mx-1'>Asiento reservado</p>
                                </div>
                                <button className='new-price mt-auto mb-2'>Continuar por <span>{flight.price.toFixed(2)}€</span></button>
                            </div>
                        </div>

                        <div className='col-10 col-md-4 my-2'>
                            <div
                                onClick={() => setSelectedFare("Regular")}
                                className={`fare-card text-center d-flex flex-column gap-1 ${selectedFare === "Regular" ? 'selected-fare' : ''}`}
                            >
                                <img src={fare_regular} alt="img" />
                                <p className="fare-title mt-2 mb-0">TARIFA <span>REGULAR</span></p>
                                <div className='fare-sentence d-flex align-items-center mx-2 my-1'>
                                    <img src={bolsa} alt='icon' />
                                    <p className='m-0 mx-1'>Bolsa en cabina</p>
                                </div>
                                <div className='fare-sentence d-flex align-items-center mx-2 my-1'>
                                    <img src={asiento} alt='icon' />
                                    <p className='m-0 mx-1'>Asiento reservado</p>
                                </div>
                                <div className='fare-sentence d-flex align-items-center mx-2 my-1'>
                                    <img src={prioridad} alt='icon' />
                                    <p className='m-0 mx-1'>Prioridad de embarque</p>
                                </div>
                                <div className='fare-sentence d-flex align-items-center mx-2 my-1'>
                                    <img src={equipaje_pequeño} alt='icon' />
                                    <p className='m-0 mx-1'>Pieza de equipaje de 10kg</p>
                                </div>
                                <button className='new-price mt-auto mb-2'>Continuar por <span>{(flight.price * 1.25).toFixed(2)}€</span></button>
                            </div>
                        </div>

                        <div className='col-10 col-md-4 my-2'>
                            <div
                                onClick={() => setSelectedFare("Plus")}
                                className={`fare-card text-center d-flex flex-column gap-1 ${selectedFare === "Plus" ? 'selected-fare' : ''}`}
                            >
                                <img src={fare_plus} alt="img" />
                                <p className="fare-title mt-2 mb-0">TARIFA <span>PLUS</span></p>
                                <div className='fare-sentence d-flex align-items-center mx-2 my-1'>
                                    <img src={bolsa} alt='icon' />
                                    <p className='m-0 mx-1'>Bolsa en cabina</p>
                                </div>
                                <div className='fare-sentence d-flex align-items-center mx-2 my-1'>
                                    <img src={asiento} alt='icon' />
                                    <p className='m-0 mx-1'>Asiento reservado</p>
                                </div>
                                <div className='fare-sentence d-flex align-items-center mx-2 my-1'>
                                    <img src={prioridad} alt='icon' />
                                    <p className='m-0 mx-1'>Prioridad de embarque</p>
                                </div>
                                <div className='fare-sentence d-flex align-items-center mx-2'>
                                    <img src={equipaje_grande} alt='icon' />
                                    <p className='m-0 mx-1'>Pieza de equipaje de 20kg</p>
                                </div>
                                <button className='new-price mt-auto mb-2'>Continuar por <span>{(flight.price * 1.5).toFixed(2)}€</span></button>
                            </div>
                        </div>
                    </div>

                    {/*Insertar los pasajeros */}
                    <div className='row m-0 p-0 mt-4'>
                        <div>
                            <div className='flight-title d-flex m-0 align-items-center col-12'>
                                <h3>Pasajeros</h3>
                                <img src={plane_icon} alt="Plane icon" />
                            </div>
                            <p className='fare-text'>*Introduce los nombres tal como aparecen en el pasaporte o la documentación de viaje</p>
                        </div>
                        <div className='passengers mb-1 col-12 col-md-8'>
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            {Array.from({ length: passengerCount }).map((_, index) => (
                                <div key={index} className='passenger-form mb-3'>
                                    <h5>Pasajero {index + 1}</h5>
                                    <div className='row'>
                                        <div className='form-group col-6'>
                                            <label>Nombre</label>
                                            <input
                                                type="text"
                                                value={passengers[index]?.name}
                                                onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                                            />
                                        </div>
                                        <div className='form-group col-6'>
                                            <label>Apellido</label>
                                            <input
                                                type="text"
                                                value={passengers[index]?.lastName}
                                                onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                                            />
                                        </div>
                                        <div className='form-group col-8'>
                                            <label>Nº de pasaporte</label>
                                            <input
                                                type="text"
                                                value={passengers[index]?.identityNumber}
                                                onChange={(e) => handlePassengerChange(index, 'identityNumber', e.target.value)}
                                            />
                                        </div>
                                        <div className='form-group col-4'>
                                            <label>Asiento</label>
                                            <select
                                                name="seat"
                                                className="select-seat"
                                                value={passengers[index]?.seat}
                                                onChange={(e) => handlePassengerChange(index, 'seat', e.target.value)}
                                                disabled={!flight}
                                            >
                                                <option value="">Select Seat</option>
                                                {generateSeatOptions().map(seat => (
                                                    <option key={seat} value={seat}>
                                                        {seat}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/*Revision y pago*/}
                            <div className="d-flex justify-content-center my-4">
                                <button className="btn-p" onClick={handleSubmit}>Revisar y pagar</button>
                            </div>

                        </div>
                        <div className='col-12 col-md-4'>
                            <SeatMapPlane seats={flight.seats} />
                        </div>
                    </div>

                    {/*JSON.stringify(flight)*/}
                </div>
            </div>
        </>
    );
}
