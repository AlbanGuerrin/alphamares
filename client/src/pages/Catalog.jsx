import React, { useEffect, useState } from 'react'
import AuctionCard from '../components/Auction/AuctionCard';
import { isEmpty } from '../utils/Utils';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const Catalog = () => {
    const [auctions, setAuctions] = useState();
    const [t] = useTranslation();

    let prevAuctions;

    function getAuctions() {
        axios.get(`${process.env.REACT_APP_API_URL}api/auction/`)
            .then((res) => {
                if (res.data && JSON.stringify(prevAuctions) !== JSON.stringify(res.data)) {
                    setAuctions(res.data);
                    prevAuctions = res.data;
                }
            })
            .catch((err) => console.log(err));
    }

    useEffect(() => {
            getAuctions();
            const interval = setInterval(() => getAuctions(), 5000);
            return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className='page'>
            <div className="title-page">
                <h1>{t("Sales.Title")}</h1>
            </div>
            <div className='sales'>
                {!isEmpty(auctions) &&
                    auctions.slice().reverse().map((auction) => (
                        <AuctionCard key={auction._id} auction={auction} />
                    ))
                }
            </div>
        </div>
    );
};

export default Catalog;