import React, { Suspense, useEffect, useState } from 'react';
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



export default function FollowedLots(props) {
    const { open, onClose, user } = props;
    const [lots, setLots] = useState();
  
    function getLots() {
      axios.get(`${process.env.REACT_APP_API_URL}api/user/followedLotsInfos/${user._id}`)
        .then((res) => {
            if (res.data !== "No followed lot") setLots(res.data)
          }
        )
        .catch((err) => console.log(err));
    }
  
    function comparerParDate(lot1, lot2) {
      return moment(lot2.auction.start) - moment(lot1.auction.start);
    }
  
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => getLots(),[])
  
    return (
      <Dialog onClose={onClose} open={open} fullWidth>
        <DialogTitle>Lots suivis</DialogTitle>
        <Suspense>
          {lots === undefined ?
            <div style={{ textAlign: 'center', margin: '10px', fontSize: '1.5rem' }}><h4>Aucun lot en favori</h4></div>
            :
            <Table sx={{ width: '80%', margin: 'auto', marginBlock: "2%" }}>
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: "700" }}>Titre de la Vente</TableCell>
                  <TableCell style={{ fontWeight: "700" }} align="right">N° du Lot</TableCell>
                  <TableCell style={{ fontWeight: "700" }} align="right">Nom de Lot</TableCell>
                  <TableCell style={{ fontWeight: "700" }} align="right">Date et heure de la vente</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lots.sort(comparerParDate).map((lot) => (
                  <TableRow key={lot.lot._id}>
                    <TableCell>{lot.auction.title}</TableCell>
                    <TableCell align="right"><NavLink to={`/lot/${lot._id}`} style={{ color: "black", textDecoration: 'underline' }}>{lot.lot.number}</NavLink></TableCell>
                    <TableCell align="right">{lot.lot.title}</TableCell>
                    <TableCell align="right">{moment(lot.auction.start).format('LLL')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          }
        </Suspense>
      </Dialog>
    );
  }