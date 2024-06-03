import React from 'react';
import './SeatMapPlane.css';

export default function SeatMapPlane({ seats }) {
    const renderSeatMap = (seatLayout) => {
        return seatLayout.split('').map((seatType, index) => {
            let seatClass = 'seat';

            if (seatType === 'X') {
                seatClass += ' unavailable';
            } else if (seatType === 'O') {
                seatClass += ' available';
            } else {
                seatClass += ' hall';
            }

            return <div key={index} className={seatClass}></div>;
        });
    };

    return <>
        <div className='airplane-container p-3'>
            <div className='row py-0'>
                <div className='seats d-flex flex-column gap-2'>
                    <div className='d-flex gap-2 align-items-center'>
                        <div className='seat available'></div><label>Available</label>
                    </div>
                    <div className='d-flex gap-2 align-items-center'>
                        <div className='seat unavailable'></div><label>Not Available</label>
                    </div>
                </div>
            </div>
            <div className="seatmap-container">
                {renderSeatMap(seats)}
            </div>
        </div>
    </>
}
