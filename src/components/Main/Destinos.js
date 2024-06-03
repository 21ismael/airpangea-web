import React from 'react';
import { useTranslation } from 'react-i18next';
import dubai from '../../assets/images/images-destinos/dubai.jpg';
import bangkok from '../../assets/images/images-destinos/bangkok.jpg';
import singapur from '../../assets/images/images-destinos/singapur.jpg';
import mexico from '../../assets/images/images-destinos/mexico.jpg';
import hanoi from '../../assets/images/images-destinos/hanoi.jpg';
import kuala_lumpur from '../../assets/images/images-destinos/kuala-lumpur.jpg';

export default function Servicios() {
    const { t } = useTranslation();

    return <>
        <div className='destinos-container container-1000 w-100'>
                <div className='row m-0'>

                    <div className='col-12 text-center'>
                        <h3>{t('destinations.title')} <span>{t('destinations.title_span')}</span></h3>
                    </div>

                    <div className="col-12 col-md-6 col-lg-4 p-0">
                        <div className="box-destino text-center m-2">
                            <img src={dubai} alt="destino img" />
                            <p className="country m-0 m-2">{t('destinations.eau')}</p>
                            <h3 className="city m-0 m-2">{t('destinations.eau_city')}</h3>
                            <p className="msg m-0 m-2">{t('destinations.fare_msg')}</p>
                            <p className="price m-0 m-2">{t('destinations.from')} EUR 674*</p>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-4 p-0">
                        <div className="box-destino text-center m-2">
                            <img src={bangkok} alt="destino-img" />
                            <p className="country  m-0 m-2">{t('destinations.thailand')}</p>
                            <h3 className="city m-0 m-2">Bangkok</h3>
                            <p className="msg m-0 m-2">{t('destinations.fare_msg')}</p>
                            <p className="price m-0 m-2">{t('destinations.from')} EUR 719*</p>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-4 p-0">
                        <div className="box-destino text-center m-2">
                            <img src={singapur} alt="destino-img" />
                            <p className="country  m-0 m-2">SINGAPUR</p>
                            <h3 className="city m-0 m-2">Singapur</h3>
                            <p className="msg m-0 m-2">{t('destinations.fare_msg')}</p>
                            <p className="price m-0 m-2">{t('destinations.from')} EUR 739*</p>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-4 p-0">
                        <div className="box-destino text-center m-2">
                            <img src={mexico} alt="destino-img" />
                            <p className="country  m-0 m-2">MÉXICO</p>
                            <h3 className="city m-0 m-2">Ciudad de México</h3>
                            <p className="msg m-0 m-2">{t('destinations.fare_msg')}</p>
                            <p className="price m-0 m-2">{t('destinations.from')} EUR 788*</p>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-4 p-0">
                        <div className="box-destino text-center m-2">
                            <img src={hanoi} alt="destino-img" />
                            <p className="country  m-0 m-2">VIETNAM</p>
                            <h3 className="city m-0 m-2">{t('destinations.vietnam_city')}</h3>
                            <p className="msg m-0 m-2">{t('destinations.fare_msg')}</p>
                            <p className="price m-0 m-2">{t('destinations.from')} EUR 831*</p>
                        </div>
                    </div>

                    <div className="col-12 col-md-6 col-lg-4 p-0">
                        <div className="box-destino text-center m-2">
                            <img src={kuala_lumpur} alt="destino-img" />
                            <p className="country  m-0 m-2">MALASIA</p>
                            <h3 className="city m-0 m-2">Kuala Lumpur</h3>
                            <p className="msg m-0 m-2">{t('destinations.fare_msg')}</p>
                            <p className="price m-0 m-2">{t('destinations.from')} EUR 857*</p>
                        </div>
                    </div>

                    <div className="col-12 d-flex flex-column align-items-center justify-content-center mt-3">
                        <button className="btn-p btn-s mb-1">{t('destinations.more_fare')}</button>
                        <span className="msg">{t('destinations.conditions')}</span>
                    </div>

                </div>
            </div>
    </>
}