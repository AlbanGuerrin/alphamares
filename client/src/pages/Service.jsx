import React from 'react'
import { useTranslation } from 'react-i18next';
import truck from './../assets/img/services/service_truck.jpg'
import foal from './../assets/img/services/service_foal.jpg'
import horse from './../assets/img/services/service_horse.jpg'
import dressage from './../assets/img/services/service_dressage.jpg'


const Service = () => {
    const [t] = useTranslation();

    return (
        <div className='page'>
            <div className='title-page'>
                <h1>{t('Services.Title1')}</h1>
                <br />
                <p className='h-service'>{t('Services.Title2')}</p>
            </div>
            <div className='services' >
                <div style={{ gridColumnStart: '1', gridColumnEnd: '3', gridRow: '1', alignItems: 'center'}}>
                    <hr style={{marginTop: 0}}/>
                </div>
                <div style={{ gridColumn: '1', gridRow: '2', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                    <img src={truck} alt="Camion VL" />
                </div>
                <div style={{ gridColumn: '2', gridRow: '2' }}>
                    <div className='col'>
                        <h3 className='title'>{t('Services.Transport.title')}</h3>
                        <p>{t('Services.Transport.text')}</p>
                    </div>
                </div>

                <div style={{ gridColumnStart: '1', gridColumnEnd: '3', gridRow: '4', alignItems: 'center' }}>
                    <hr/>
                </div>
                <div style={{ gridColumn: '2', gridRow: '5', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                    <img src={foal} alt="Foal" />
                </div>
                <div style={{ gridColumn: '1', gridRow: '5', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                    <div className='col'>
                        <h3 className='title'>{t('Services.Boarding.title')}</h3>
                        <p>{t('Services.Boarding.text')}</p>
                    </div>
                </div>


                <div style={{ gridColumnStart: '1', gridColumnEnd: '3', gridRow: '6', alignItems: 'center' }}>
                    <hr/>
                </div>
                <div style={{ gridColumn: '1', gridRow: '7', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                    <img src={horse} alt="Care" />
                </div>
                <div style={{ gridColumn: '2', gridRow: '7' }}>
                    <div className='col'>
                        <h3 className='title'>{t('Services.Care.title')}</h3>
                        <p>{t('Services.Care.text')}</p>
                    </div>
                </div>

                <div style={{ gridColumnStart: '1', gridColumnEnd: '3', gridRow: '8', alignItems: 'center' }}>
                    <hr/>
                </div>
                <div style={{ gridColumn: '2', gridRow: '9', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                    <img src={dressage} alt="Dressage" />
                </div>
                <div style={{ gridColumn: '1', gridRow: '9' }}>
                    <div className='col'>
                        <h3 className='title'>{t('Services.Valorisation.title')}</h3>
                        <p>{t('Services.Valorisation.text')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Service;