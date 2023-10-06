import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import CreateAuction from './CreateAuction';
import AuctionCardConfig from './AuctionCardConfig';
import { isEmpty } from '../../../utils/Utils';
import moment from 'moment';
import axios from 'axios';

function CreateAuctionDialog(props) {
    const { onClose, open } = props;

    return (
        <Dialog onClose={onClose} open={open} >
            <DialogTitle>
                Créer une vente
                <Button onClick={onClose} sx={{ position: 'absolute', right: 10, top: 10, }}>
                    &#10005;
                </Button>
            </DialogTitle>
            <CreateAuction onClose={onClose} registerOrUpdate={props.registerOrUpdate} />
        </Dialog>
    );
}

export default function AuctionsList() {
    const [auctions, setAuctions] = useState([]);
    const [open, setOpen] = React.useState(false);

    let previousAuction;

    function getAuctions() {
        axios.get(`${process.env.REACT_APP_API_URL}api/auction/`)
            .then((res) => {
                if (JSON.stringify(previousAuction) !== JSON.stringify(res.data)) {
                    setAuctions(res.data);
                    previousAuction = res.data;
                }
            })
            .catch((err) => console.log(err));
    }

    useEffect(() => {
        getAuctions();
        const interval = setInterval(() => getAuctions(), 5000);
        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='page'>
            <br />
            <Button variant="contained" onClick={() => setOpen(true)}> Créer une ventes</Button>
            <br />
            <div className='sales'>
                {!isEmpty(auctions[0]) &&
                    auctions.slice().sort((a,b) => moment(a.createdAt - b.createdAt)).reverse().map((auction) => (
                        <AuctionCardConfig key={auction._id} auction={auction} />
                    ))}
            </div>
            <CreateAuctionDialog open={open} onClose={() => setOpen(false)} registerOrUpdate="/register" />
        </div>
    );
}