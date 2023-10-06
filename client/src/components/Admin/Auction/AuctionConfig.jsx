import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import moment from 'moment';
import UpdateAuction from './UpdateAuction';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import LotCardConfig from '../Lot/LotCardConfig';
import { isEmpty } from '../../../utils/Utils';
import CreateLot from '../Lot/CreateLot';
import axios from 'axios';

export default function AuctionConfig() {
    const [auction, setAuction] = useState();
    const [lots, setLots] = useState();
    let params = useParams()

    const [openEdit, setOpenEdit] = useState(false);
    const [openLot, setOpenLot] = useState(false);

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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white' }}>
            <br />
            <div style={{ textAlign: 'center' }}>
                <h1>Configuration de la vente</h1>
            </div>
            <div className='col' style={{ marginLeft: '15%', marginTop: '3%', display: 'flex' }}>
                {!isEmpty(auction) &&
                    <div style={{ border: '3px solid', borderRadius: '20px', padding: '2%', color: 'rgb(239, 193, 109)' }}>
                        <h2 style={{ fontSize: '3rem', display: 'flex', gap: '20px' }}> Titre : <p style={{ fontSize: '2.8rem', color: 'white' }}>{auction.title}</p></h2>
                        <br />
                        <h2 style={{ fontSize: '2.5rem', display: 'flex', gap: '20px' }}> Sous-titre : <p style={{ fontSize: '2.2rem', color: 'white' }}>{auction.description}</p></h2>
                        <br />
                        <h2 style={{ fontSize: '1.8rem', display: 'flex', gap: '20px' }}> Début : <p style={{ fontSize: '1.6rem', color: 'white' }}>{moment(auction.start).format('LLL')}</p></h2>
                        <br />
                        <h2 style={{ fontSize: '1.8rem', display: 'flex', gap: '20px' }}> Fin : <p style={{ fontSize: '1.6rem', color: 'white' }}>{moment(auction.end).format('LLL')}</p></h2>
                        <br />
                        <Button variant='contained' onClick={() => setOpenEdit(true)} >Éditer</Button>
                    </div>}
            </div>
            <br />
            <h1>Lots :</h1>
            <br />
            <Button variant='contained' onClick={() => setOpenLot(true)} >Créer un lot</Button>
            <br />
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
                {!isEmpty(lots) &&
                    lots.slice().sort((a, b) => a.number - b.number).map((lot) => {
                        return <LotCardConfig key={lot._id} lot={lot} auction={auction} />
                    })
                }
            </div>
            {!isEmpty(auction) &&
                <div>
                    <UpdateAuctionDialog open={openEdit} onClose={() => setOpenEdit(false)} auction={auction} />
                    <CreateLotDialog open={openLot} onClose={() => setOpenLot(false)} auctionId={auction._id} nbLots={auction.catalogue.length} />
                </div>
            }
            <br />
        </div>
    )
}

function UpdateAuctionDialog(props) {
    const { onClose, selectedValue, open } = props;

    function handleClose() {
        onClose(selectedValue);
    };

    return (
        <Dialog onClose={handleClose} open={open} PaperProps={{ sx: { padding: '2%' } }}>
            <DialogTitle>Éditer la vente</DialogTitle>
            <UpdateAuction onClose={handleClose} auction={props.auction} />
        </Dialog>
    );
}

function CreateLotDialog(props) {
    const { open, onClose, selectedValue, auctionId, nbLots } = props;

    function handleClose() {
        onClose(selectedValue);
    };

    return (
        <Dialog onClose={handleClose} open={open} PaperProps={{ sx: { padding: '0 4% 0 4%' } }} fullWidth maxWidth="md">
            <DialogTitle>Créer un Lot</DialogTitle>
            <CreateLot onClose={handleClose} auctionId={auctionId} nbLots={nbLots} />
        </Dialog>
    );
}