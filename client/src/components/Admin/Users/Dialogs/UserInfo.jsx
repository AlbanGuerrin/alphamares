import React, { useState } from 'react';
import axios from 'axios';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch } from 'react-redux';
import { Button, MenuItem, TextField } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';


export default function UserInfos(props) {
    const { open, onClose, user } = props;
    const dispatch = useDispatch();
  
    const [activateForm, setActivateForm] = useState(false)
  
    const [userData, setUserData] = useState({
      name: user.name,
      surname: user.surname,
      email: user.email,
      password: '',
      job: user.job,
      phoneNumber: user.phoneNumber,
      adress: user.adress,
      adressCity: user.adressCity,
      adressCountry: user.adressCountry,
      gender: user.gender,
      language: user.language,
      birthDate: user.birthDate,
      type: user.type,
      tvaNumber: user.tvaNumber,
    });
  
    const handleChange = (event) => {
      setUserData({ ...userData, [event.target.name]: event.target.value });
    };
  
    const handleSubmit = () => {
      axios
        .put(`${process.env.REACT_APP_API_URL}api/user/${user._id}`, userData)
        .then((res) => {
          dispatch("GET_USERS");
        })
        .catch((err) => console.log(err));
      setActivateForm(false);
      onClose();
    };
  
    return (
      <Dialog onClose={onClose} open={open} fullWidth>
        <DialogTitle>Informations utilisateur</DialogTitle>
        <form style={{ display: 'flex', justifyContent: 'center', margin: '5%' }} noValidate autoComplete="off" onSubmit={handleSubmit}>
          <div>
            <div style={{ display: 'flex', gap: '5%' }}>
              <TextField
                id="name"
                name="name"
                label="Nom"
                type='text'
                value={userData.name}
                onChange={handleChange}
                minLength={1}
                maxLength={30}
                sx={{ width: '30vw', margin: '1% 5%' }}
                disabled={!activateForm}
              />
              <br />
              <TextField
                id="surname"
                name="surname"
                label="Prénom"
                value={userData.surname}
                onChange={handleChange}
                minLength={1}
                maxLength={30}
                sx={{ width: '30vw', margin: '1% 5%' }}
                disabled={!activateForm}
              />
            </div>
            <br />
            <div style={{ display: 'flex', gap: '5%' }}>
              <TextField
                id="email"
                name="email"
                label="Email"
                type="email"
                value={userData.email}
                onChange={handleChange}
                sx={{ width: '30vw', margin: '1% 5%' }}
                disabled={!activateForm}
              />
              <br />
              <TextField
                id="password"
                name="password"
                label="Mot de passe"
                type="password"
                value={userData.password}
                onChange={handleChange}
                minLength={6}
                maxLength={1024}
                sx={{ width: '30vw', margin: '1% 5%' }}
                disabled={!activateForm}
              />
            </div>
            <br />
            <div style={{ display: 'flex', gap: '5%' }}>
              <TextField
                id="phoneNumber"
                name="phoneNumber"
                label="Phone Number"
                value={userData.phoneNumber}
                onChange={handleChange}
                maxLength={30}
                sx={{ width: '30vw', margin: '1% 5%' }}
                disabled={!activateForm}
              />
              <br />
              <TextField
                id="adress"
                name="adress"
                label="Adress"
                value={userData.adress}
                onChange={handleChange}
                sx={{ width: '30vw', margin: '1% 5%' }}
                disabled={!activateForm}
              />
            </div>
            <br />
            <div style={{ display: 'flex', gap: '5%' }}>
              <TextField
                id="adressCountry"
                name="adressCountry"
                label="Country"
                value={userData.adressCountry}
                onChange={handleChange}
                sx={{ width: '30vw', margin: '1% 5%' }}
                disabled={!activateForm}
              />
              <br />
              <TextField
                id="language"
                name="language"
                label="Langue"
                value={userData.language}
                onChange={handleChange}
                sx={{ width: '30vw', margin: '1% 5%' }}
                disabled={!activateForm}
              />
            </div>
            <br />
            <div style={{ display: 'flex', gap: '5%' }}>
              <TextField
                onChange={handleChange}
                label="Civilité"
                name='gender'
                id="outlined-select-gender"
                defaultValue={userData.gender}
                sx={{ width: '30vw', margin: '1% 5%' }}
                disabled={!activateForm}
                select
              >
                {[{ label: 'Male' }, { label: 'Female' }].map((option) => (
                  <MenuItem key={option.label} value={option.label} >
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <br />
              <TextField
                id="birthDate"
                name="birthDate"
                type='date'
                label="Date de naissance"
                value={userData.birthDate.split('T')[0]}
                onChange={handleChange}
                sx={{ width: '30vw', margin: '1% 5%' }}
                disabled={!activateForm}
              />
            </div>
            <br />
            <div style={{ display: 'flex', gap: '5%' }}>
              <TextField
                onChange={handleChange}
                name='type'
                label="Type"
                id="type"
                defaultValue={userData.type}
                sx={{ width: '25vw', margin: '1% 5%' }}
                disabled={!activateForm}
                select
              >
                {[{ label: 'Private' }, { label: 'Company' }].map((option) => (
                  <MenuItem key={option.label} value={option.label} >
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <br />
              {userData.type === "Company" &&
                <TextField
                  id="tvaNumber"
                  name="tvaNumber"
                  label="N° TVA"
                  value={userData.tvaNumber}
                  onChange={handleChange}
                  sx={{ width: '30vw', margin: '1% 5%' }}
                  disabled={!activateForm}
                />
              }
            </div>
            <br />
            <div style={{ display: 'flex', justifyContent: 'center', gap: '5%' }}>
              <Button variant="contained" onClick={() => setActivateForm(!activateForm)} endIcon={<EditIcon />}>Modifier</Button>
              <br />
              <Button type='submit' variant="contained" endIcon={<SaveIcon />}>Enregistrer</Button>
            </div>
          </div>
  
        </form>
      </Dialog>
    );
  }