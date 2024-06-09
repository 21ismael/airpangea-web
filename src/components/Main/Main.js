import React, { useState, useEffect } from 'react';
import './Main.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import WebServices from '../../services/WebServices';
import formattedDate from '../../utils/formattedDate';
import plane_icon from '../../assets/images/airplane_icon.png';
import convertToAP from '../../utils/convertToAP';
import Servicios from './Servicios';
import Destinos from './Destinos';
import img_1 from '../../assets/images/imagenesSobreNosotros/a380-sky-view-w300x300.jpg';
import img_2 from '../../assets/images/imagenesSobreNosotros/sunlight-baths-the-blyde-river-canyon-w300x300.jpg';
import img_3 from '../../assets/images/imagenesSobreNosotros/emirates-group-staff-group-photo-m300x300.jpg';
import img_4 from '../../assets/images/imagenesSobreNosotros/family-planting-tree-w300x300.jpg';

export default function Main() {
    const { t } = useTranslation();
    const [originCountry, setOriginCountry] = useState('');
    const [originAirport, setOriginAirport] = useState('');
    const [destinationCountry, setDestinationCountry] = useState('');
    const [destinationAirport, setDestinationAirport] = useState('');
    const [passengerCount, setPassengerCount] = useState(1);
    const [scheduledFlights, setScheduledFlights] = useState([]);
    const [uniqueDepartureCountries, setUniqueDepartureCountries] = useState([]);
    const [filteredAirports, setFilteredAirports] = useState([]);
    const [filteredDestinationCountries, setFilteredDestinationCountries] = useState([]);
    const [filteredDestinationAirports, setFilteredDestinationAirports] = useState([]);
    const [filteredFlights, setFilteredFlights] = useState([]);

    const [user, setUser] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        const webServices = new WebServices();
        const fetchScheduledFlights = async () => {
            try {
                const flights = await webServices.getScheduledFlights();
                setScheduledFlights(flights);
                const countries = new Set(flights.map(flight => flight.airportDeparture.country));
                setUniqueDepartureCountries([...countries]);
            } catch (error) {
                console.error('Failed to fetch scheduled flights', error);
            }
        };

        fetchScheduledFlights();
    }, []);

    useEffect(() => {
        if (originCountry) {
            const airports = scheduledFlights
                .filter(flight => flight.airportDeparture.country === originCountry)
                .map(flight => ({
                    iata: flight.airportDeparture.iata,
                    name: flight.airportDeparture.name
                }));

            const uniqueAirports = Array.from(new Set(airports.map(a => a.iata)))
                .map(iata => airports.find(a => a.iata === iata));

            setFilteredAirports(uniqueAirports);
        } else {
            setFilteredAirports([]);
        }
    }, [originCountry, scheduledFlights]);

    useEffect(() => {
        if (originAirport) {
            const flightsFromAirport = scheduledFlights.filter(flight => flight.airportDeparture.iata === originAirport);
            const destinationCountries = new Set(flightsFromAirport.map(flight => flight.airportArrival.country));
            setFilteredDestinationCountries([...destinationCountries]);
        } else {
            setFilteredDestinationCountries([]);
        }
    }, [originAirport, scheduledFlights]);

    useEffect(() => {
        if (originAirport && destinationCountry) {
            const flightsFromAirportToCountry = scheduledFlights.filter(
                flight => flight.airportDeparture.iata === originAirport && flight.airportArrival.country === destinationCountry
            );
            const destinationAirports = new Set(flightsFromAirportToCountry.map(flight => flight.airportArrival.iata));
            setFilteredDestinationAirports([...destinationAirports]);
        } else {
            setFilteredDestinationAirports([]);
        }
    }, [originAirport, destinationCountry, scheduledFlights]);

    const handleSubmit = (e) => {
        e.preventDefault();

        localStorage.removeItem('flight');

        const currentDate = new Date();
        const filtered = scheduledFlights.filter(flight =>
            flight.airportDeparture.country === originCountry &&
            flight.airportDeparture.iata === originAirport &&
            flight.airportArrival.country === destinationCountry &&
            flight.airportArrival.iata === destinationAirport &&
            flight.status === "Scheduled" &&
            new Date(flight.departureDateTime) > currentDate
        );
        setFilteredFlights(filtered);
        alert(JSON.stringify(filtered));
    };

    const flightSelected = (flight) => {
        const userStored = JSON.parse(localStorage.getItem('user'));
        alert(JSON.stringify(userStored))

        if (!userStored) {
            const button = document.getElementById('btn-login');
            if (button) {
                button.click();
            }
        } else {
            alert(JSON.stringify(flight));
            localStorage.setItem('flight', JSON.stringify(flight));
            localStorage.setItem('passengerCount', passengerCount)
            navigate('/buy-ticket');
        }
    };

    return <>
        <section className='flight d-flex flex-column gap-3'>
            <form onSubmit={handleSubmit} className='container-1000 d-flex flex-column'>
                <div className='flight-title d-flex'>
                    <h3>{t('flight.search_flights')}</h3>
                    <img src={plane_icon} />
                </div>
                <div className='row'>
                    <div className='d-flex gap-2 align-items-center col-12 mb-3'>
                        <label>{t('flight.from')}</label>
                        <select value={originCountry} onChange={(e) => setOriginCountry(e.target.value)} className='select-country'>
                            <option value=''>{t('flight.country')}</option>
                            {uniqueDepartureCountries.map(country => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                        </select>
                        <select value={originAirport} onChange={(e) => setOriginAirport(e.target.value)}>
                            <option value=''>{t('flight.select_airport')}</option>
                            {filteredAirports.map(airport => (
                                <option key={airport.iata} value={airport.iata}>
                                    {airport.name} ({airport.iata})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='d-flex gap-2 align-items-center col-12 col-md-6 mb-3'>
                        <label>{t('flight.to')}</label>
                        <select value={destinationCountry} onChange={(e) => setDestinationCountry(e.target.value)} className='select-country'>
                            <option value=''>{t('flight.country')}</option>
                            {filteredDestinationCountries.map(country => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                        </select>
                        <select value={destinationAirport} onChange={(e) => setDestinationAirport(e.target.value)}>
                            <option value=''>{t('flight.select_airport')}</option>
                            {filteredDestinationAirports.map(iata => {
                                const airport = scheduledFlights.find(flight => flight.airportArrival.iata === iata).airportArrival;
                                return (
                                    <option key={iata} value={iata}>
                                        {airport.name} ({iata})
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className='mb-2 col-6 col-md-3 d-flex gap-3'>
                        <div className='d-flex gap-2'>
                            <label className='m-0'>{t('flight.passengers')}</label>
                            <input
                                type='number'
                                value={passengerCount}
                                onChange={(e) => setPassengerCount(e.target.value)}
                                min='1'
                                max='4'
                                className='mx-1 counter'
                            />
                        </div>
                    </div>

                    <div className='col-6 col-md-3 d-flex justify-content-end'>
                        <button className='col-6 btn-p m-0' type='submit'>{t('flight.search_flights')}</button>
                    </div>

                </div>
            </form>

            <Servicios />

            <div className="filtered-flights container-1000 w-100 mt-1">
                {filteredFlights.length > 0 && (
                    <div>
                        <div className='flight-title d-flex'>
                            <h3>{t('flight.available_flights')}</h3>
                            <img src={plane_icon} />
                        </div>

                        <ul>
                            {filteredFlights.map(flight => (
                                <li key={flight.id}>
                                    <div className="flight-info">
                                        <div className='row'>
                                            <div className="col-4 col-md-2 departure-date d-flex align-items-center">{formattedDate(flight.departureDateTime)}</div>
                                            <div className="col-8 col-md-5 cities d-flex align-items-center justify-content-end">
                                                {flight.airportDeparture.city} ----- <div className='codeAP'>{convertToAP(flight.id)}</div> ----- {flight.airportArrival.city}
                                            </div>
                                            <div className="col-6 col-md-2 fare d-flex flex-column justify-content-center">{t('flight.fare')} <br /><span>{flight.price}€</span></div>
                                            <div className='col-6 col-md-3 btn-flight d-flex justify-content-end align-items-center'>
                                                <button className="btn-p m-0" onClick={() => flightSelected(flight)}>{t('flight.select')}</button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <Destinos />

            <div class="row d-none d-xxl-flex justify-content-center px-5 mx-5">
                <div class="col-12 text-center mb-3">
                    <h2 class="titulo-acerca-nosotros">Acerca de nosotros</h2>
                    <p class="texto-acerca-nosotros">Conozca más en profundidad nuestra historia, nuestro negocio y las iniciativas en materia de sostenibilidad.</p>
                </div>
                <div className='col-8'>
                    <div class="row px-5 mx-5">
                        <div class="d-flex flex-column align-items-center text-center gap-4 col-md-3" href="">
                            <img class="img-acerca-nosotros " src={img_1} alt="" />
                            <span class="link-sobre-nosotros">Nuestro negocio</span>
                        </div>
                        <div class="d-flex flex-column align-items-center text-center gap-4 col-md-3" href="">
                            <img class="img-acerca-nosotros " src={img_2} alt="" />
                            <span class="link-sobre-nosotros">Nuestro planeta</span>
                        </div>
                        <div class="d-flex flex-column align-items-center text-center gap-4 col-md-3" href="">
                            <img class="img-acerca-nosotros " src={img_3} alt="" />
                            <span class="link-sobre-nosotros">Nuestro equipo</span>
                        </div>
                        <div class="d-flex flex-column align-items-center text-center gap-4 col-md-3" href="">
                            <img class="img-acerca-nosotros " src={img_4} alt="" />
                            <span class="link-sobre-nosotros">Nuestras comunidades</span>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    </>
}
