import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { isEmpty } from "../../../utils/Utils";
import Button  from "@mui/material/Button";
import UpdateAuction from './UpdateAuction';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import { TableRow, TableCell } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDialog from './../ConfirmDialog'

export default function CurrentAuction() {
    const [currentAuction, setCurrentAuction] = useState();
    const [lots, setLots] = useState();

    const [openEdit, setOpenEdit] = useState(false);
    const [openConfirmClose, setOpenConfirmClose] = useState(false);

    let previousAuction;
    let previousLots;


    const handleClickEdit = () => {
        setOpenEdit(true);
    }

    const handleClose = () => {
        if (openEdit) setOpenEdit(false);
    };

    function closeAuction() {
        setOpenConfirmClose(false);
        if (!isEmpty(currentAuction)) {
            axios.patch(`${process.env.REACT_APP_API_URL}api/auction/close/${currentAuction._id}`)
                .then((res) => alert("Enchère fermée avec succès !"))
                .catch((err) => alert("Erreur : " + err))
        }
    }

    function getAuctions() {
        axios.get(`${process.env.REACT_APP_API_URL}api/auction/currentAuctionLots`)
            .then((res) => {
                if (res !== undefined && JSON.stringify(previousLots) !== JSON.stringify(res.data.lots)) {
                    setLots(res.data.lots)
                    previousLots = res.data.lots; 
                };
                if (res !== undefined && JSON.stringify(previousAuction) !== JSON.stringify(res.data.auction)) {
                    setCurrentAuction(res.data.auction)
                    previousAuction = res.data.auction;
                };
            })
            .catch((err) => console.log(err));
    }


    useEffect(() => {
        getAuctions();
        const interval = setInterval(() => getAuctions(), 3000);
        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <br />
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                <h1>Enchère en cours</h1>
            </div>
            <br />
            {!isEmpty(currentAuction) ?
                <div style={{ width: "90%" }}>
                    <div className='col'>
                        <div>
                            <div style={{ border: '3px solid', borderRadius: '20px', padding: '5%', color: 'rgb(239, 193, 109)', }}>
                                <h2 style={{ fontSize: '3rem', display: 'flex', gap: '20px' }}> Titre : <p style={{ fontSize: '2.8rem', color: 'white' }}>{currentAuction.title}</p></h2>
                                <br />
                                <h2 style={{ fontSize: '2.5rem', display: 'flex', gap: '20px' }}> Sous-titre : <p style={{ fontSize: '2.2rem', color: 'white' }}>{currentAuction.description}</p></h2>
                                <br />
                                <h2 style={{ fontSize: '1.8rem', display: 'flex', gap: '20px' }}> Début : <p style={{ fontSize: '1.6rem', color: 'white' }}>{moment(currentAuction.start).format('LLL')}</p></h2>
                                <br />
                                <h2 style={{ fontSize: '1.8rem', display: 'flex', gap: '20px' }}> Fin : <p style={{ fontSize: '1.6rem', color: 'white' }}>{moment(currentAuction.end).format('LLL')} (dernier lot : {moment(currentAuction.end).add(currentAuction.catalogue.length * 5, 'm').format('LLL')})</p></h2>
                                <br />
                                <Button variant='contained' onClick={handleClickEdit} >Éditer</Button>
                                <Button sx={{ marginInline: '5%' }} variant="contained" onClick={() => setOpenConfirmClose(true)} disabled={!moment(currentAuction.end).add(currentAuction.catalogue.length * 5, 'm').isBefore(moment())} >Cloturer la vente</Button>
                            </div>
                            <br />
                            <div>
                                {!isEmpty(lots) &&
                                    lots.slice().sort((a, b) => a.number - b.number).map((lot) => (
                                        <Accordion expanded={true}>
                                            <AccordionSummary
                                                aria-controls="panel1bh-content"
                                                id="panel1bh-header"
                                                sx={{ display: 'flex' }}
                                            >
                                                <Typography sx={{ color: 'black', flex: '1' }}> <strong>{lot.number} - {lot.title}</strong> </Typography>
                                                <Typography sx={{ color: 'text.secondary', flex: '1' }}>{lot.type}</Typography>
                                                <Typography sx={{ color: 'text.secondary', flex: '1' }}>{lot.bids.length} enchérissements</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                {!isEmpty(lot.bids) &&
                                                    lot.bids.slice().reverse().map((bid, index) => (
                                                        <BidCard bid={bid} key={bid._id} isLast={index === 0} />
                                                    ))
                                                }
                                            </AccordionDetails>
                                        </Accordion>
                                    )
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <UpdateAuctionDialog open={openEdit} onClose={handleClose} auction={currentAuction} />
                    <ConfirmDialog message="cloturer la vente" open={openConfirmClose} onClose={() => setOpenConfirmClose(false)} yesFunction={closeAuction} />
                </div>
                :
                <h2 style={{ margin: 'auto' }}>Pas d'enchère en cours</h2>
            }
            <br />
        </div>
    )
}

function UpdateAuctionDialog(props) {
    const { open, onClose, auction } = props;

    return (
        <Dialog onClose={onClose} open={open} PaperProps={{ sx: { padding: '2%' } }}>
            <DialogTitle>Éditer la vente</DialogTitle>
            <UpdateAuction onClose={onClose} auction={auction} />
        </Dialog>
    );
}


function BidCard(props) {
    const { bid, isLast } = props;
    const [user, setUser] = useState();

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    function getUser() {
        axios.get(`${process.env.REACT_APP_API_URL}api/user/${bid.bidderId}`)
            .then((res) => {
                const user = res.data;
                setUser(user);
            })
            .catch((err) => console.log(err))
    }

    async function deleteBid() {
        setOpenConfirmDialog(false);
        await axios.delete(`${process.env.REACT_APP_API_URL}api/bid/${bid._id}`, bid)
            .then((res) => alert('Enchère supprimée !'))
            .catch((err) => alert('Erreur : ' + err));
    }

    useEffect(() => {
        getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div style={{ width: '100%' }}>
            {user !== undefined &&
                <TableRow sx={{ width: "100%", display: 'flex' }}>
                    <TableCell sx={{ flex: '6', padding: '5px 2px' }} align="left"><strong>{user.name} {user.surname}</strong> - ({user.type}) </TableCell>
                    <TableCell sx={{ flex: '6', padding: '5px 2px' }} align="left"> {user.email}</TableCell>
                    <TableCell sx={{ flex: '4', padding: '5px 2px' }} align="left"> {user.phoneNumber}</TableCell>
                    <TableCell sx={{ flex: '4', padding: '5px 2px' }} align="right"><strong>{bid.amount} €</strong></TableCell>
                    <TableCell sx={{ flex: '4', padding: '5px 2px' }} align="right">{moment(bid.createdAt).format('LLL')} </TableCell>
                    <TableCell sx={{ flex: '1', padding: '5px 2px' }} align="right">{isLast && <DeleteIcon className="delete" onClick={() => setOpenConfirmDialog(true)} />}</TableCell>
                </TableRow>
            }
            {openConfirmDialog &&
                <ConfirmDialog message={"supprimer cette enchère"} open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)} yesFunction={deleteBid} />
            }
        </div>
    )
}