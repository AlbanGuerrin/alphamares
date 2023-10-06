import React from 'react'
import AuctionsList from '../../components/Admin/Auction/AuctionsList';

const Ventes = () => {
    return (
        <div >
            <br />
            <div style={{textAlign : 'center'}}>
                <h1>Administration des ventes</h1>
            </div>
            <br />
            < AuctionsList/>
            <br />
        </div>
    );
};

export default Ventes;