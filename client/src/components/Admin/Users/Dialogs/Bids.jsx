import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import moment from 'moment';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { NavLink } from 'react-router-dom';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { isEmpty } from '../../../../utils/Utils';

export default function Bids(props) {
    const { open, onClose, user } = props;
    const [bids, setBids] = useState();

    function getBids(userId) {
        axios.get(`${process.env.REACT_APP_API_URL}api/user/bids/${userId}`)
            .then((res) => {
                if (res.data !== "No bid" && JSON.stringify(res.data) !== JSON.stringify(bids))
                    setBids(res.data)
            })
            .catch((err) => console.log(err));
    }

    function comparerParDate(bid1, bid2) {
        return moment(bid2.createdAt) - moment(bid1.createdAt);
    }

    useEffect(() => {
        getBids(user._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Dialog onClose={onClose} open={open} fullWidth>
            <DialogTitle>Enchères</DialogTitle>
            {isEmpty(bids) ?
                <div style={{ textAlign: 'center', margin: '10px', fontSize: '1.5rem' }}><h4>Aucune enchère</h4></div>
                : <Table sx={{ width: '80%', margin: 'auto', marginBlock: "2%" }}>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontWeight: "700" }}>Titre de la Vente</TableCell>
                            <TableCell style={{ fontWeight: "700" }} align="right">N° du Lot - Nom de Lot</TableCell>
                            <TableCell style={{ fontWeight: "700" }} align="right">Montant</TableCell>
                            <TableCell style={{ fontWeight: "700" }} align="right">Date et heure</TableCell>
                            <TableCell style={{ fontWeight: "700" }} align="right">Gagnant</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bids.sort(comparerParDate).map((bid) => (
                            <TableRow key={bid._id}>
                                <TableCell>{bid.auctionInfos}</TableCell>
                                <TableCell align="right"><NavLink to={`/lot/${bid.lotId}`} style={{ color: "black", textDecoration: 'underline' }} >{bid.lotInfos}</NavLink></TableCell>
                                <TableCell align="right">{bid.amount} €</TableCell>
                                <TableCell align="right">{moment(bid.createdAt).format("LLL")}</TableCell>
                                <TableCell align="right">{bid.win !== undefined ? <EmojiEventsIcon /> : '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            }
        </Dialog>
    );
}
