import React, { useState, useEffect } from 'react';
import './Main.css';
import { useTranslation } from 'react-i18next';
import WebServices from '../../services/WebServices';
import formattedDate from '../../utils/formattedDate';
import plane_icon from '../../assets/images/airplane_icon.png';
import convertToAP from '../../utils/convertToAP';
import hotel_icon from '../../assets/svg/row-iconos/hotel.svg';
import coche_icon from '../../assets/svg/row-iconos/coche.svg';
import visitas_icon from '../../assets/svg/row-iconos/visitas-actividades.svg';
import chofer_icon from '../../assets/svg/row-iconos/servic-chofer.svg';
import traslados_icon from '../../assets/svg/row-iconos/translados.svg';
import avion_icon from '../../assets/svg/row-iconos/avion.svg';
import dubai from '../../assets/images/images-destinos/dubai.jpg';
import bangkok from '../../assets/images/images-destinos/bangkok.jpg';
import singapur from '../../assets/images/images-destinos/singapur.jpg';
import mexico from '../../assets/images/images-destinos/mexico.jpg';
import hanoi from '../../assets/images/images-destinos/hanoi.jpg';
import kuala_lumpur from '../../assets/images/images-destinos/kuala-lumpur.jpg';

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
                                max='10'
                                className='mx-1 counter'
                            />
                        </div>
                    </div>

                    <div className='col-6 col-md-3 d-flex justify-content-end'>
                        <button className='col-6 btn-p m-0' type='submit'>{t('flight.search_flights')}</button>
                    </div>

                </div>

            </form>

            <div class="servicios my-2 row container-1000 d-none col-lg-12 d-lg-flex">
                <div class="icon-box col-md-2">
                    <img src={hotel_icon} alt="icon" />
                    <p>{t('services.hotel')}</p>
                </div>
                <div class="icon-box col-4 col-md-2">
                    <img src={coche_icon} alt="icon" />
                    <p>{t('services.car')}</p>
                </div>
                <div class="icon-box col-4 col-md-2">
                    <img src={visitas_icon} alt="icon" />
                    <p>{t('services.activities')}</p>
                </div>
                <div class="icon-box col-4 col-md-2">
                    <img src={chofer_icon} alt="icon" />
                    <p>{t('services.group')}</p>
                </div>
                <div class="icon-box col-4 col-md-2">
                    <img src={traslados_icon} alt="icon" />
                    <p>{t('services.booking')}</p>
                </div>
                <div class="icon-box col-4 col-md-2">
                    <img src={avion_icon} alt="icon" />
                    <p>{t('services.route')}</p>
                </div>
            </div>

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

            <div className='destinos-container container-1000 w-100'>
                <div className='row m-0'>

                    <div className='col-12 text-center'>
                        <h3>{t('destinations.title')} <span>{t('destinations.title_span')}</span></h3>
                    </div>

                    <div class="col-12 col-md-6 col-lg-4 p-0">
                        <div class="box-destino text-center m-2">
                            <img src={dubai} alt="destino img" />
                            <p class="country m-0 m-2">{t('destinations.eau')}</p>
                            <h3 class="city m-0 m-2">{t('destinations.eau_city')}</h3>
                            <p class="msg m-0 m-2">{t('destinations.fare_msg')}</p>
                            <p class="price m-0 m-2">{t('destinations.from')} EUR 674*</p>
                        </div>
                    </div>

                    <div class="col-12 col-md-6 col-lg-4 p-0">
                        <div class="box-destino text-center m-2">
                            <img src={bangkok} alt="destino-img" />
                            <p class="country  m-0 m-2">{t('destinations.thailand')}</p>
                            <h3 class="city m-0 m-2">Bangkok</h3>
                            <p class="msg m-0 m-2">{t('destinations.fare_msg')}</p>
                            <p class="price m-0 m-2">{t('destinations.from')} EUR 719*</p>
                        </div>
                    </div>

                    <div class="col-12 col-md-6 col-lg-4 p-0">
                        <div class="box-destino text-center m-2">
                            <img src={singapur} alt="destino-img" />
                            <p class="country  m-0 m-2">SINGAPUR</p>
                            <h3 class="city m-0 m-2">Singapur</h3>
                            <p class="msg m-0 m-2">{t('destinations.fare_msg')}</p>
                            <p class="price m-0 m-2">{t('destinations.from')} EUR 739*</p>
                        </div>
                    </div>

                    <div class="col-12 col-md-6 col-lg-4 p-0">
                        <div class="box-destino text-center m-2">
                            <img src={mexico} alt="destino-img" />
                            <p class="country  m-0 m-2">MÉXICO</p>
                            <h3 class="city m-0 m-2">Ciudad de México</h3>
                            <p class="msg m-0 m-2">{t('destinations.fare_msg')}</p>
                            <p class="price m-0 m-2">{t('destinations.from')} EUR 788*</p>
                        </div>
                    </div>

                    <div class="col-12 col-md-6 col-lg-4 p-0">
                        <div class="box-destino text-center m-2">
                            <img src={hanoi} alt="destino-img" />
                            <p class="country  m-0 m-2">VIETNAM</p>
                            <h3 class="city m-0 m-2">{t('destinations.vietnam_city')}</h3>
                            <p class="msg m-0 m-2">{t('destinations.fare_msg')}</p>
                            <p class="price m-0 m-2">{t('destinations.from')} EUR 831*</p>
                        </div>
                    </div>

                    <div class="col-12 col-md-6 col-lg-4 p-0">
                        <div class="box-destino text-center m-2">
                            <img src={kuala_lumpur} alt="destino-img" />
                            <p class="country  m-0 m-2">MALASIA</p>
                            <h3 class="city m-0 m-2">Kuala Lumpur</h3>
                            <p class="msg m-0 m-2">{t('destinations.fare_msg')}</p>
                            <p class="price m-0 m-2">{t('destinations.from')} EUR 857*</p>
                        </div>
                    </div>

                    <div class="col-12 d-flex flex-column align-items-center justify-content-center mt-3">
                        <button class="btn-p btn-s mb-1">{t('destinations.more_fare')}</button>
                        <span class="msg">{t('destinations.conditions')}</span>
                    </div>

                </div>
            </div>

        </section>
    </>
}
