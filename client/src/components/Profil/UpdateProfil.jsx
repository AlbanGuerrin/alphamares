import React, { useEffect, useState } from 'react';
import { TextField, Button, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import MenuItem from '@mui/material/MenuItem';
import { updateProfil } from '../../actions/user.actions';
import { useTranslation } from 'react-i18next';
import validator from 'validator'


export default function UpdateProfile() {
    const userData = useSelector((state) => state.userReducer)
    const [loading, setLoading] = useState(true);
    const [activateForm, setActivateForm] = useState(false)
    const [t] = useTranslation();


    const [user, setUser] = useState({
        name: userData.name,
        surname: userData.surname,
        email: userData.email,
        password: '',
        job: userData.job,
        phoneNumber: userData.phoneNumber,
        adress: userData.adress,
        adressCity: userData.adressCity,
        adressCountry: userData.adressCountry,
        gender: userData.gender,
        language: userData.language,
        birthDate: userData.birthDate,
        type: userData.type,
        tvaNumber: userData.tvaNumber,
        companyName: userData.companyName,
    });
    const [correctPhoneNumber, setCorrectPhoneNumber] = useState(true);

    const dispatch = useDispatch();

    const handleChange = (event) => {
        setUser({ ...user, [event.target.name]: event.target.value });
        if (event.target.name === "phoneNumber") {
            setCorrectPhoneNumber(validator.isMobilePhone(event.target.value.trim()));
            console.log(event.target.value.trim());
        }
    };

    const handleSubmit = () => {
        dispatch(updateProfil(userData._id, user));
        setActivateForm(false);
    };

    useEffect(() => {
        if (userData !== undefined) {
            setLoading(false);
            setUser(userData);
        }
    }, [userData])

    return (
        <div>
            <br />
            <div style={{ textAlign: 'center' }}>
                <img src="././img/icons/person.svg" alt="icon profil" width={50}></img>
                <h1>{t('Infos.My-Infos')}</h1>
            </div>
            <Paper elevation={6} className="update-profil" >
                {!loading &&
                    <form className="form" autoComplete="off" onSubmit={handleSubmit}>
                        <div className="row-resp">
                            <TextField
                                className='text-field'
                                id="name"
                                name="name"
                                label={t('Infos.Surname')}
                                type='text'
                                value={user.name || ''}
                                onChange={handleChange}
                                minLength={1}
                                maxLength={30}
                                disabled={!activateForm}
                                required
                            />
                            <br />
                            <TextField
                                className='text-field'
                                id="surname"
                                name="surname"
                                label={t('Infos.Firstname')}
                                value={user.surname || ''}
                                onChange={handleChange}
                                minLength={1}
                                maxLength={30}
                                disabled={!activateForm}
                                required
                            />
                        </div>
                        <br />
                        <div className="row-resp">
                            <TextField
                                className='text-field'
                                id="email"
                                name="email"
                                label="Email"
                                type="email"
                                value={user.email || ''}
                                onChange={handleChange}
                                disabled={!activateForm}
                                required
                            />
                            <br />
                            <TextField
                                className='text-field'
                                id="password"
                                name="password"
                                label={t('Infos.Password')}
                                type="password"
                                value={user.password || ''}
                                onChange={handleChange}
                                minLength={6}
                                maxLength={1024}
                                disabled={!activateForm}
                            />
                        </div>
                        <br />
                        <div className="row-resp">
                            <TextField
                                className='text-field'
                                id="phoneNumber"
                                name="phoneNumber"
                                label={t('Infos.Phone')}
                                value={user.phoneNumber || ''}
                                onChange={handleChange}
                                maxLength={30}
                                error={!correctPhoneNumber}
                                disabled={!activateForm}
                                required
                            />
                            <br />
                            <TextField
                                className='text-field'
                                id="adress"
                                name="adress"
                                label={t('Infos.Address')}
                                value={user.adress || ''}
                                onChange={handleChange}
                                disabled={!activateForm}
                                required
                            />
                        </div>
                        <br />
                        <div className="row-resp">
                            <TextField
                                className='text-field'
                                id="adressCountry"
                                name="adressCountry"
                                label={t('Infos.Country')}
                                value={user.adressCountry || ''}
                                onChange={handleChange}
                                disabled={!activateForm}
                                required
                            />
                            <br />
                            <TextField
                                className='text-field'
                                id="language"
                                name="language"
                                label={t('Infos.Language')}
                                value={user.language || ''}
                                onChange={handleChange}
                                disabled={!activateForm}
                                required
                            />
                        </div>
                        <br />
                        <div className="row-resp">
                            <TextField
                                className='text-field'
                                onChange={handleChange}
                                label={t('Infos.Gender')}
                                id="outlined-select-gender"
                                name='gender'
                                value={user.gender || ''}
                                disabled={!activateForm}
                                required
                                select
                            >
                                {[{ label: 'Male' }, { label: 'Female' }].map((option) => (
                                    <MenuItem key={option.label} value={option.label} >
                                        {t('Infos.' + option.label)}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <br />
                            <TextField
                                className='text-field'
                                id="birthDate"
                                name="birthDate"
                                type='date'
                                label={t('Infos.Birthdate')}
                                value={user.birthDate === undefined ? user.birthDate : user.birthDate.split('T')[0]}
                                onChange={handleChange}
                                disabled={!activateForm}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </div>
                        <br />
                        <div className="row-resp">
                            <TextField
                                className='text-field'
                                onChange={handleChange}
                                label="Type"
                                id="type"
                                name="type"
                                value={user.type || ''}
                                disabled={!activateForm}
                                required
                                select
                            >
                                {[{ label: 'Private' }, { label: 'Company' }].map((option) => (
                                    <MenuItem key={option.label} value={option.label} >
                                        {t('Infos.' + option.label)}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <br />
                            {user.type === "Company" &&
                                <TextField
                                    className='text-field'
                                    id="companyName"
                                    name="companyName"
                                    label={t('Infos.Company-Name')}
                                    value={user.companyName || ''}
                                    onChange={handleChange}
                                    disabled={!activateForm}
                                    required
                                />}
                        </div>
                        <br />
                        <div className="row-resp">
                            {user.type === "Company" &&
                                <TextField
                                    className='text-field'
                                    id="tvaNumber"
                                    name="tvaNumber"
                                    label={t('Infos.TVA-Number')}
                                    value={user.tvaNumber || ''}
                                    onChange={handleChange}
                                    disabled={!activateForm}
                                    required
                                />}
                        </div>
                        <br />
                        <div className="row-resp">
                            <Button variant="contained" onClick={() => setActivateForm(!activateForm)} endIcon={<EditIcon />}>{t('Infos.Modify')}</Button>
                            <br />
                            <Button type='submit' variant="contained" endIcon={<SaveIcon />}>{t('Infos.Save')}</Button>
                        </div>
                    </form>
                }
                <br />

            </Paper>
        </div>
    );

}

