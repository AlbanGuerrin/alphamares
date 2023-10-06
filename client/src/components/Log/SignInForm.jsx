import React, { useState } from 'react'
import axios from 'axios'
import { useTranslation } from "react-i18next";
import { NavLink } from 'react-router-dom';

const SignInform = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [t] = useTranslation()

  const handleLogin = (element) => {
    element.preventDefault(); // Empêche le comportement par défaut (rechargement de la page)
    const emailError = document.querySelector('.email.error');
    const passwordError = document.querySelector('.password.error');



    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}api/user/login`,
      withCredentials: true,
      data: {
        email,
        password,
      }
    })
      .then((res) => {
        if (res.data.errors) {
          emailError.innerHTML = res.data.errors.email ? t('Error.' + res.data.errors.email) : "";
          passwordError.innerHTML = res.data.errors.password ? t('Error.' + res.data.errors.password) : "";
        } else {
          window.location = '/'; // On va à Home si pas d'erreur, le token à été généré.
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
    <div className='sign-in-form'>
      <img src="/img/golden_horse.jpg" alt="Logo Alpha-Mares" />
      <form action="" onSubmit={handleLogin} id="sign-up-form">
        {props.registered ? 
          <div>
            <p className='confirm-registered'><strong>{t('Sign-in.Confirm-Registered1')}</strong></p>
            <p className='confirm-registered'>{t('Sign-in.Confirm-Registered2')}</p>
          </div>
        : ""}
        <h1>{t('Sign-in.Login')}</h1>
        <br />
        <label htmlFor="email">Email</label>
        <input type="text" autoComplete='username' name="email" id="email" onChange={(element) => setEmail(element.target.value)} value={email} />
        <div className='email error'></div>
        <br />
        <label htmlFor="password">{t('Sign-in.Password')}</label>
        <input type="password" autoComplete='current-password' name="password" id="password" onChange={(element) => setPassword(element.target.value)} value={password} />
        <div className='password error'></div>
        <br />
        <input type="submit" className='btn' value={t('Sign-in.Sign-in')} />
        <NavLink to="/profil/forgotten-password">Mot de passe oublié ?</NavLink>
        
      </form>
      <h2>{t('Sign-in.Login-To-Participate')}</h2>
    </div>

  )
}

export default SignInform