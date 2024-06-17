import React from 'react';
import './SeatMapPlane.css';
import { useTranslation } from 'react-i18next';

export default function SeatMapPlane({ seats, selectedSeats }) {
    const { t } = useTranslation();

    const renderSeatMap = (seatLayout) => {
        let seatIndex = 0;
        return seatLayout.split('').map((seatType, index) => {
            let seatClass = 'seat';

            if (seatType === 'O') {
                seatClass += ' available';
                if (selectedSeats.includes(seatIndex)) {
                    seatClass += ' selected';
                }
                seatIndex++;
            } else if (seatType === 'X') {
                seatClass += ' unavailable';
            } else if (seatType === ' ') {
                seatClass = 'hall';
            }

            return <div key={index} className={seatClass}></div>;
        });
    };

    return (
        <>
            <div className='airplane-container p-3'>
                <div className='row py-0'>
                    <div className='seats d-flex flex-column gap-2'>
                        <div className='d-flex gap-2 align-items-center'>
                            <div className='seat-info seat selected'></div><label>{t("seatmap.selected")}</label>
                        </div>
                        <div className='d-flex gap-2 align-items-center'>
                            <div className='seat-info seat available'></div><label>{t("seatmap.available")}</label>
                        </div>
                        <div className='d-flex gap-2 align-items-center'>
                            <div className='seat-info seat unavailable'></div><label>{t("seatmap.not_available")}</label>
                        </div>
                    </div>
                </div>
                <div className="seatmap-container">
                    {renderSeatMap(seats)}
                </div>
            </div>
        </>
    );
}
