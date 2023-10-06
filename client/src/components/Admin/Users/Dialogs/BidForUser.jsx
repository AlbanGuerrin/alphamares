import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import moment from 'moment';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { useTranslation } from 'react-i18next';
import { isEmpty } from '../../../../utils/Utils';
import { BidPanel } from '../../../Lot/Lot';

export default function BidForUser(props) {
    const { open, onClose, user } = props;
    const [currentAuction, setCurrentAuction] = useState();
    const [lots, setLots] = useState();

    let previousAuction;
    let previousLots;

    function getAuctions() {
        axios.get(`${process.env.REACT_APP_API_URL}api/auction/currentAuctionLots`)
            .then((res) => {
                if (res.data && JSON.stringify(previousLots) !== JSON.stringify(res.data.lots)) {
                    setLots(res.data.lots)
                    previousLots = res.data.lots;
                };
                if (res.data && JSON.stringify(previousAuction) !== JSON.stringify(res.data.auction)) {
                    setCurrentAuction(res.data.auction)
                    previousAuction = res.data.auction;
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
        <Dialog onClose={onClose} open={open} >
            <DialogTitle>Enchère en cours</DialogTitle>
            {isEmpty(currentAuction) ?
                <div style={{ textAlign: 'center', margin: '10px', fontSize: '1.5rem' }}><h4>Aucune enchère en cours</h4></div>
                : <div>
                    {!isEmpty(lots) && lots.map((lot) => (
                        <BidForUserRow key={lot._id} lot={lot} user={user} currentAuction={currentAuction} />
                    ))}
                </div>
            }
        </Dialog >
    );
}

function BidForUserRow(props) {
    const { lot, user, currentAuction } = props;
    const [openLot, setOpenLot] = useState(false);
    const [t] = useTranslation();

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' }, width: '100%' }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpenLot(!openLot)}
                    >
                        {openLot ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row"><strong>{lot.number} - {lot.title}</strong> ({t("Lot." + lot.type)})</TableCell>
                <TableCell align="right">{lot.bids.length} enchérissements</TableCell>
                <TableCell align="right">Fin de l'ennchère : {moment(lot.end).format('lll')}</TableCell>
                <TableCell align="right">{isEmpty(lot.lastBid) ? lot.price : lot.lastBid.amount} €</TableCell>
            </TableRow>
            <Collapse in={openLot} timeout="auto" unmountOnExit className='BidPanel-Cell'>
                <BidPanel lot={lot} user={user} auction={currentAuction} />
            </Collapse>
        </>
    )
}