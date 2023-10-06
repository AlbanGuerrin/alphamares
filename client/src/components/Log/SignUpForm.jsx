import axios from 'axios';
import React, { useState } from 'react'
import SignInForm from "./SignInForm";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import MenuItem from '@mui/material/MenuItem';
import { countries } from './inputRessources';
import { isEmpty } from '../../utils/Utils';
import { useTranslation } from "react-i18next";
import { Criteria } from './ResetPassword';
import { bothPasswordSame, isPasswordValid } from '../../utils/passwordUtils';

const SignUpForm = () => {
  const [formSubmit, setFormSubmit] = useState(false);

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [controlPassword, setControlPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [adress, setAdress] = useState("");
  const [adressCity, setAdressCity] = useState("");
  const [adressCountry, setAdressCountry] = useState("");
  const [gender, setGender] = useState("");
  const [language, setLanguage] = useState("English");
  const [birthDate, setBirthDate] = useState("");
  const [type, setType] = useState("");
  const [tvaNumber, setTvaNumber] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [t] = useTranslation();

  const handleRegister = async (element) => {
    element.preventDefault();

    const terms = document.getElementById("terms");

    const nameError = document.querySelector('.name.error');
    const surnameError = document.querySelector('.surname.error');
    const emailError = document.querySelector('.email.error');
    const passwordError = document.querySelector('.password.error');
    const passwordConfirmError = document.querySelector(".password-confirm.error");
    const phoneNumberError = document.querySelector('.phoneNumber.error');
    const adressError = document.querySelector('.adress.error');
    const adressCityError = document.querySelector('.adressCity.error');
    const adressCountryError = document.querySelector('.adressCountry.error');
    const genderError = document.querySelector('.gender.error');
    const languageError = document.querySelector('.language.error');
    const dateError = document.querySelector('.birthDate.error');
    const typeError = document.querySelector('.type.error');
    const termsError = document.querySelector('.terms.error')
    const tvaNumberError = document.querySelector('.tvaNumber.error')
    const companyNameError = document.querySelector('.companyName.error')

    passwordConfirmError.innerHTML = ""; // On efface à chaque fois les erreurs
    termsError.innerHTML = "";

    nameError.innerHTML = "";
    surnameError.innerHTML = "";
    emailError.innerHTML = "";
    passwordError.innerHTML = "";
    phoneNumberError.innerHTML = "";
    adressError.innerHTML = "";
    adressCityError.innerHTML = "";
    adressCountryError.innerHTML = "";
    genderError.innerHTML = "";
    languageError.innerHTML = "";
    dateError.innerHTML = "";
    typeError.innerHTML = "";
    if (type === "Company") {
      tvaNumberError.innerHTML = ""
      companyNameError.innerHTML = ""
    };

    if (password !== controlPassword || !terms.checked) {
      if (password !== controlPassword)
        passwordConfirmError.innerHTML = "Les mots de passe ne corresponde pas"

      if (!terms.checked)
        termsError.innerHTML = "Veuillez accpeter les conditions générales"
    } else if (type === "Company" && isEmpty(tvaNumber)) {
      tvaNumberError.innerHTML = "Veuillez renseigner votre numéro de T.V.A.";
    }



    else {

      if (gender === "Monsieur" || gender === "Mr") {
        setGender('Male')
      } else {
        setGender('Female')
      }

      await axios({
        method: "post",
        url: `${process.env.REACT_APP_API_URL}api/user/register`,
        data: {
          name,
          surname,
          email,
          password,
          phoneNumber,
          adress,
          adressCity,
          adressCountry,
          gender,
          language,
          birthDate,
          type,
          tvaNumber,
          companyName
        }
      })
        .then((res) => {
          //console.log(res);
          if (res.data.errors) {
            console.log(res.data.errors);
            nameError.innerHTML = res.data.errors.name ? t('Error.' + res.data.errors.name) : "";
            surnameError.innerHTML = res.data.errors.surname ? t('Error.' + res.data.errors.surname) : "";
            emailError.innerHTML = res.data.errors.email ? t('Error.' + res.data.errors.email) : "";
            passwordError.innerHTML = res.data.errors.password ? t('Error.' + res.data.errors.password) : "";
            phoneNumberError.innerHTML = res.data.errors.phoneNumber ? t('Error.' + res.data.errors.phoneNumber) : "";
            adressError.innerHTML = res.data.errors.adress ? t('Error.' + res.data.errors.adress) : "";
            adressCityError.innerHTML = res.data.errors.adressCity ? t('Error.' + res.data.errors.adressCity) : "";
            adressCountryError.innerHTML = res.data.errors.adressCountry ? t('Error.' + res.data.errors.adressCountry) : "";
            genderError.innerHTML = res.data.errors.gender ? t('Error.' + res.data.errors.gender) : "";
            languageError.innerHTML = res.data.errors.language ? t('Error.' + res.data.errors.language) : "";
            dateError.innerHTML = res.data.errors.date ? t('Error.' + res.data.errors.date) : "";
            typeError.innerHTML = res.data.errors.type ? t('Error.' + res.data.errors.type) : "";
            tvaNumberError.innerHTML = res.data.errors.type ? t('Error.' + res.data.errors.tvaNumber) : "";
            companyNameError.innerHTML = res.data.errors.type ? t('Error.' + res.data.errors.companyName) : "";
          } else {
            setFormSubmit(true);
            window.scrollTo(0, 0)
          }
        })
        .catch((err) => console.log(err));
    }
  }

  return (
    <>
      <div className='title-sign-up'>
        <h1>
          {t("Sign-up.Create-Account")}
        </h1>
        <h3>
          {t("Sign-up.Sign-Up-To-Bid")}
        </h3>
      </div>
      {formSubmit ? (
        <>
          <SignInForm registered={true} />
          <span></span>
        </>
      )
        : (
          <div className='sign-up'>
            <img src="/img/golden_horse.jpg" alt="Logo Alpha-Mares" />
            <div className='sign-up-form'>
              <form action="" onSubmit={handleRegister} id="sign-up-form" className='form'>
                <div className='title'>
                  <h1>
                    Identification
                  </h1>
                </div>

                <div className='row'>
                  <div className='field'>
                    <label htmlFor="gender">{t('Sign-up.Gender')}</label>
                    <TextField
                      onChange={(element) => setGender(element.target.value)}
                      name="gender"
                      id="gender"
                      size='small'
                      sx={{ minWidth: "10vw" }}
                      select
                      required
                    >
                      {[{ label: 'Male' }, { label: 'Female' }].map((option) => (
                        <MenuItem key={option.label} value={option.label} >
                          {t("Sign-up." + option.label)}
                        </MenuItem>
                      ))}
                    </TextField>
                    <div className='gender error'></div>
                  </div>

                  <div className='field'>
                    <label htmlFor="name">{t('Sign-up.Surname')}</label>
                    <TextField name='name' id='name' size='small' onChange={(event) => setName(event.target.value)} value={name} required />
                    <div className='name error'></div>
                  </div>

                  <div className='field'>
                    <label htmlFor="surname">{t('Sign-up.Firstname')}</label>
                    <TextField name='surname' id='surname' size='small' onChange={(event) => setSurname(event.target.value)} value={surname} required />
                    <div className='surname error'></div>
                  </div>

                  <div className='field'>
                    <label htmlFor="phoneNumber">{t('Sign-up.Phone')}</label>
                    <TextField type='tel' name='phoneNumber' id='phoneNumber' size='small' onChange={(event) => setPhoneNumber(event.target.value)} value={phoneNumber} required />
                    <div className='phoneNumber error'></div>
                  </div>
                </div>


                <br />

                <div className='title'>
                  <h1>
                    {t('Sign-up.Address')}
                  </h1>
                </div>

                <div className='row'>
                  <div className='field'>
                    <label htmlFor="adress">{t('Sign-up.Address')}</label>
                    <TextField name='adress' id='adress' size='small' onChange={(event) => setAdress(event.target.value)} value={adress} required />
                    <div className='adress error'></div>
                  </div>

                  <div className='field'>
                    <label htmlFor="adressCity">{t('Sign-up.City')}</label>
                    <TextField name='adressCity' id='adressCity' size='small' onChange={(event) => setAdressCity(event.target.value)} value={adressCity} required />
                    <div className='adressCity error'></div>
                  </div>

                  <div className='field'>
                    <label htmlFor="adressCountry">{t('Sign-up.Country')}</label>
                    <Autocomplete
                      id="country-select"
                      options={countries}
                      autoHighlight
                      onChange={(element) => setAdressCountry(element.target.outerText)}
                      size="small"
                      sx={{ minWidth: "12vw" }}
                      getOptionLabel={(option) => option.label}
                      renderOption={(props, option) => (
                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} >
                          <img
                            loading="lazy"
                            width="20"
                            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                            srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                            alt=""
                          />
                          {option.label}
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          required
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password', // disable autocomplete and autofill
                          }}
                        />
                      )}
                    />
                    <div className='adressCountry error'></div>
                  </div>

                </div>

                <br />

                <div className='title'>
                  <h1>
                    {t('Sign-up.Your-Account')}
                  </h1>
                </div>

                <div className='row'>
                  <div className='field'>
                    <label htmlFor="email">{t('Sign-up.Mail')}</label>
                    <TextField type='email' name='email' id='email' size='small' onChange={(event) => setEmail(event.target.value)} value={email} required />
                    <div className='email error'></div>
                  </div>
                  <div className='field'>
                    <label htmlFor="password">{t('Sign-up.Password')}</label>
                    <TextField sx={isPasswordValid(password) || password==="" ? {border:"none"} : {border:"solid 3px orange"}} type='password' name='password' id='password' size='small' onChange={(event) => setPassword(event.target.value)} value={password} autoComplete='new-password' required />
                    <br />
                    <div className="reset-password">
                      <Criteria password={password} t={t} />
                    </div>
                    <div className='password error'></div>

                  </div>
                  <div className='field'>
                    <label htmlFor="password-conf">{t('Sign-up.Confirm-Password')}</label>
                    <TextField sx={ bothPasswordSame(password, controlPassword) || controlPassword==="" ? {border:"none"} : {border:"solid 3px orange"}} type='password' name='password' id='password-conf' size='small' onChange={(event) => setControlPassword(event.target.value)} value={controlPassword} autoComplete='new-password' required />
                    <div className='password-confirm error'></div>
                  </div>
                </div>

                <div className='row'>
                  <div className='field'>
                    <label htmlFor="language">{t('Sign-up.Language')}</label>
                    <TextField
                      onChange={(element) => setLanguage(element.target.value)}
                      name="language"
                      id="language"
                      size='small'
                      sx={{ minWidth: "10vw" }}
                      select
                      required
                    >
                      {[{ label: 'French' }, { label: 'English' }].map((option) => (
                        <MenuItem key={option.label} value={option.label} >
                          {t('Sign-up.' + option.label)}
                        </MenuItem>
                      ))}
                    </TextField>
                    <div className='language error'></div>
                  </div>
                  <div className='field'>
                    <label htmlFor="birthDate">{t('Sign-up.Birthdate')}</label>
                    <TextField type='date' name='birthDate' id='birthDate' size='small' onChange={(event) => setBirthDate(event.target.value)} value={birthDate} required />
                    <div className='birthDate error'></div>
                  </div>
                  <div className='field'>
                    <label htmlFor="type">{t('Sign-up.Type')}</label>
                    <div className='radio' id='radio'>
                      <input type="radio" name='type' id='Private' value="Private" onChange={(event) => setType(event.target.value)} required></input>
                      <label htmlFor="Private">{t('Sign-up.Private')}</label>
                      <input type="radio" name='type' id='Company' value="Company" onChange={(event) => setType(event.target.value)} required></input>
                      <label htmlFor="Company">{t('Sign-up.Company')}</label>
                    </div>
                    <div className='type error'></div>
                  </div>

                </div>
                <br />

                {type === "Company" &&
                  <div className='row'>
                    <div className='field'>
                      <label htmlFor="companyName">{t("Sign-up.Company-Name")}</label>
                      <TextField type='text' name='companyName' id='companyName' size='small' onChange={(event) => setCompanyName(event.target.value)} value={companyName} required />
                      <div className='companyName error'></div>
                    </div>
                    <br />
                    <div className='field'>
                      <label htmlFor="tvaNumber">{t("Sign-up.TVA-Number")}</label>
                      <TextField type='text' name='tvaNumber' id='tvaNumber' size='small' onChange={(event) => setTvaNumber(event.target.value)} value={tvaNumber} required />
                      <div className='tvaNumber error'></div>
                    </div>
                  </div>
                }

                <div className='terms'>
                  <input type="checkbox" id="terms" />
                  <div>
                    <label htmlFor="terms">{t('Sign-up.I-Accept')} <a href={`${process.env.REACT_APP_API_URL}legals/CGU.pdf`} target="_blank" rel="noopener noreferrer" >{t('Sign-up.CGU')}</a>.</label>
                    <div className='terms error'></div>
                  </div>
                </div>
                <br />
                <div className='submit'>
                  <input type="submit" className='btn' value={t("Sign-up.Validate")} />
                </div>
                <br />
              </form>
            </div>
          </div>

        )}
    </>
  )
}
export default SignUpForm

