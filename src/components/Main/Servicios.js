import React from 'react';
import { useTranslation } from 'react-i18next';
import hotel_icon from '../../assets/svg/row-iconos/hotel.svg';
import coche_icon from '../../assets/svg/row-iconos/coche.svg';
import visitas_icon from '../../assets/svg/row-iconos/visitas-actividades.svg';
import chofer_icon from '../../assets/svg/row-iconos/servic-chofer.svg';
import traslados_icon from '../../assets/svg/row-iconos/translados.svg';
import avion_icon from '../../assets/svg/row-iconos/avion.svg';

export default function Servicios() {
    const { t } = useTranslation();

    return <>
        <div className="servicios my-2 row container-1000 d-none col-lg-12 d-lg-flex">
            <div className="icon-box col-md-2">
                <img src={hotel_icon} alt="icon" />
                <p>{t('services.hotel')}</p>
            </div>
            <div className="icon-box col-4 col-md-2">
                <img src={coche_icon} alt="icon" />
                <p>{t('services.car')}</p>
            </div>
            <div className="icon-box col-4 col-md-2">
                <img src={visitas_icon} alt="icon" />
                <p>{t('services.activities')}</p>
            </div>
            <div className="icon-box col-4 col-md-2">
                <img src={chofer_icon} alt="icon" />
                <p>{t('services.group')}</p>
            </div>
            <div className="icon-box col-4 col-md-2">
                <img src={traslados_icon} alt="icon" />
                <p>{t('services.booking')}</p>
            </div>
            <div className="icon-box col-4 col-md-2">
                <img src={avion_icon} alt="icon" />
                <p>{t('services.route')}</p>
            </div>
        </div>
    </>
}