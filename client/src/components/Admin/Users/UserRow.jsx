import React, { useState} from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDialog from "../ConfirmDialog";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { Button, IconButton, TableCell, TableRow } from '@mui/material';
import moment from 'moment';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Collapse from '@mui/material/Collapse';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import FollowedLots from './Dialogs/FollowedLots';
import Bids from './Dialogs/Bids';
import UserInfos from './Dialogs/UserInfo';
import BidForUser from './Dialogs/BidForUser';

export default function UserRow(props) {
  const user = props.user;
  const [open, setOpen] = useState(false);
  const [openFollowedLots, setOpenFollowedLots] = useState(false);
  const [openBids, setOpenBids] = useState(false);
  const [openUserInfos, setOpenUserInfos] = useState(false);
  const [openBidForUser, setOpenBidForUser] = useState(false);
  const [openConfirmResendVerificationEmail, setOpenConfirmResendVerificationEmail] = useState(false);
  const [openConfirmBlockAndUnblock, setOpenConfirmBlockAndUnblock] = useState(false);
  const [openConfirmDeleteUser, setOpenConfirmDeleteUser] = useState(false);

  async function deleteUser() {
    setOpenConfirmDeleteUser(false);
    axios.delete(`${process.env.REACT_APP_API_URL}api/user/${user._id}`)
      .then(res => {
        props.fetchUsers();
        alert(`Utilisateur ${user.email} supprimé`)
      })
      .catch(err => console.log(err));
  }

  async function reSendVerificationEmail() {
    setOpenConfirmResendVerificationEmail(false);
    await axios.post(`${process.env.REACT_APP_API_URL}api/verif/email-verification/${user.email}`, { userId: user._id, user: user })
      .then(res => {
        props.fetchUsers();
        alert("Mail de vérification envoyé")
      })
      .catch(err => alert("Erreur : " + err.response.data));
  }

  async function blockAndUnblock() {
    setOpenConfirmBlockAndUnblock(false);
    await axios.put(`${process.env.REACT_APP_API_URL}api/user/block/${user._id}`, { blocked: !user.blocked })
      .then(res => {
        props.fetchUsers();
        alert(`Utilisateur ${!user.blocked ? "bloqué" : "débloqué"}`)
      })
      .catch(err => alert("Erreur : " + err.response.data));
  }

  async function verifyUser() {
    await axios.put(`${process.env.REACT_APP_API_URL}api/user/verify/${user._id}`)
      .then(res => {
        props.fetchUsers();
        alert("Utilisateur" + !user.blocked ? "bloqué" : "débloqué");
      })
      .catch(err => alert("Erreur : " + err.response.data));
  }


  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">{user.isAdmin && <AdminPanelSettingsIcon />}</TableCell>
        <TableCell component="th" scope="row">{user.name}</TableCell>
        <TableCell align="right">{user.surname}</TableCell>
        <TableCell align="right">{user.email}</TableCell>
        <TableCell align="right">{user.phoneNumber}</TableCell>
        <TableCell align="right">{user.blocked ? <CancelIcon color='warning' /> : ' '}</TableCell>
        <TableCell align="right">{user.verified ? <CheckCircleIcon color='success' /> : < Button variant='contained' size='small' onClick={verifyUser} color='error'>vérifier</Button>}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                {user.name} {user.surname}
              </Typography>
              <div className='row'>
                <div className='col' style={{ width: '50%' }}>
                  <Typography style={{ color: 'black' }}>
                    Adresse : {user.adress + " " + user.adressCity}
                  </Typography>
                  <Typography style={{ color: 'black' }}>
                    Date de naissance : {moment(user.birthDate).format('L')}
                  </Typography>
                  <Typography style={{ color: 'black' }}>
                    Genre : {user.gender}
                  </Typography>
                  <Typography style={{ color: 'black' }}>
                    Type : {user.type}
                  </Typography>
                  {user.isAdmin ?
                    <Typography style={{ color: 'black' }}>
                      Admin : oui
                    </Typography>
                    :
                    <Typography style={{ color: 'black' }}>
                      Bloqué : {user.blocked ? "Oui" : "Non"}
                    </Typography>}
                </div>
                <div >
                  <div style={{ display: 'flex', gap: '5%' }}>
                    <Button variant="contained" size="small" onClick={() => setOpenUserInfos(true)}>Éditer</Button>
                    <Button variant="contained" size="small" onClick={() => setOpenConfirmResendVerificationEmail(true)} style={{ whiteSpace: 'normal' }}>Renvoyer mail de vérification</Button>
                    <IconButton aria-label="delete" disabled={user.isAdmin} onClick={() => setOpenConfirmDeleteUser(true)}><DeleteIcon /></IconButton>
                  </div>
                </div>
              </div>
              <br />
              <div className='row'>
                <Button variant="contained" size="small" onClick={() => setOpenBidForUser(true)}>Enchérir à sa place</Button>
                <Button variant="contained" size="small" onClick={() => setOpenFollowedLots(true)}>Historique des lots suivis</Button>
                <Button variant="contained" size="small" onClick={() => setOpenBids(true)}>Historique des enchères</Button>
                <Button variant="contained" size="small" disabled={user.isAdmin} onClick={() => setOpenConfirmBlockAndUnblock(true)}>{user.blocked ? "Débloquer" : "Bloquer"}</Button>
              </div>
              <br />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <FollowedLots
        open={openFollowedLots}
        onClose={() => setOpenFollowedLots(false)}
        user={user}
      />
      <Bids
        open={openBids}
        onClose={() => setOpenBids(false)}
        user={user}
      />
      <UserInfos
        open={openUserInfos}
        onClose={() => setOpenUserInfos(false)}
        user={user}
      />
      <BidForUser
        open={openBidForUser}
        onClose={() => setOpenBidForUser(false)}
        user={user}
      />
      <ConfirmDialog message="envoyer le mail de vérification à nouveau" open={openConfirmResendVerificationEmail} yesFunction={reSendVerificationEmail} onClose={() => setOpenConfirmResendVerificationEmail(false)} />
      <ConfirmDialog message="supprimer cet utilisateur de manière définitive" open={openConfirmDeleteUser} yesFunction={deleteUser} onClose={() => setOpenConfirmDeleteUser(false)} />
      <ConfirmDialog message={user.blocked ? "débloquer cet utilisateur" : "bloquer cet utilisateur"} open={openConfirmBlockAndUnblock} yesFunction={blockAndUnblock} onClose={() => setOpenConfirmBlockAndUnblock(false)} />
    </>
  )

}
