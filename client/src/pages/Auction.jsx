import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { isEmpty } from '../utils/Utils';
import LotCard from '../components/Lot/LotCard';
import { useTranslation } from 'react-i18next';

const Auction = () => {
    const [auction, setAuction] = useState();
    const [lots, setLots] = useState();
    let params = useParams()
    const [t, i18n] = useTranslation();

    let previousAuction = null;
    let previousLots = null;

    function getAuction() {
        axios.get(`${process.env.REACT_APP_API_URL}api/auction/${params.id}`)
            .then((res) => {
                if (res !== undefined && JSON.stringify(previousAuction) !== JSON.stringify(res.data)) {
                    setAuction(res.data)
                    previousAuction = res.data;
                }
            })
            .catch((err) => console.log(err));
    }

    function getLotsOfAuction() {
        axios.get(`${process.env.REACT_APP_API_URL}api/auction/lots/${params.id}`)
            .then((res) => {
                if (res !== undefined && JSON.stringify(previousLots) !== JSON.stringify(res.data)) {
                    setLots(res.data);
                    previousLots = res.data;
                }
            })
            .catch((err) => console.log(err));
    }

    useEffect(() => {
        getAuction();
        getLotsOfAuction();
        const interval = setInterval(() => {
            getAuction();
            getLotsOfAuction();
        }, 5000);
        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='auction'>
            <div className='row-resp'>
                {!isEmpty(auction) && <div className='title'>
                    <br />
                    <h1>{i18n.language === "fr" ? auction.title : auction.titleEN}</h1>
                    <h2>{i18n.language === "fr" ? auction.description : auction.descriptionEN}</h2>
                    <br />
                    <br />
                    <h3>{t('Auction.Begin')} {i18n.language === "fr" ? moment(auction.start).format('D MMMM YYYY - HH:mm') : moment(auction.start).format('MMMM D, YYYY - HH:mm')}</h3>
                    <h3>{t('Auction.End')} {i18n.language === "fr" ? moment(auction.end).format('D MMMM YYYY - HH:mm') : moment(auction.end).format('MMMM D, YYYY - HH:mm')}</h3>
                    <h3>{t('Auction.Hour')}, GMT+2</h3>
                    <br />
                    <br />
                    <h3>{t('Auction.Commission')}  {auction.commission} %</h3>
                </div>}
                <br />
                <div>
                    <img src="/img/auction_horse.jpg" alt="Horse" width={'100%'} />
                </div>
            </div>
            <br />
            <div className='lots'>
                {!isEmpty(auction) && !isEmpty(lots) &&
                    lots.slice().sort((a,b) => a.number - b.number).map((lot) => {
                        return <LotCard key={lot._id} lot={lot} />
                    })
                }
            </div>
            <br />
        </div>
    );
};

export default Auction;