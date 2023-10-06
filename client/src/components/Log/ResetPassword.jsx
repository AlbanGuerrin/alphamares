import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { bothPasswordSame, containsNumber, containsUpperLower, isPasswordValid, passwordLongEnought } from "../../utils/passwordUtils";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";

export const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [t] = useTranslation();
    const [tokenIsValid, setTokenIsValid] = useState(null);
    const params = useParams();
    const [passwordSend, setPasswordSend] = useState(false);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}api/password/check-token/${params.token}/${params.email}`)
            .then((res) => {
                if (res.data.message === "Token valid") {
                    setTokenIsValid(true);
                }
                else setTokenIsValid(false);
            })
            .catch((err) => {
                // console.log(err);
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function sendNewPassword() {
        axios.put(`${process.env.REACT_APP_API_URL}api/password/reset-password/${params.token}/${params.email}`, { "password": password })
            .then((res) => {
                console.log(res.data.message);
                if (res.data.message === "Password reset") {
                    setPasswordSend("success");
                } else {
                    setPasswordSend('invalid');
                }
            })
            .catch((err) => {
                console.log(err);
                setPasswordSend('error');
            })
    }

    return (
        <div className="reset-password">
            <div className="page">
                <img src="/img/golden_horse.jpg" alt="Logo Alpha-Mares" />
                {tokenIsValid !== null ?
                    tokenIsValid ?
                        passwordSend === false ?
                            <form className="form-container" onSubmit=''>
                                <h1>{t('Reset-Password.Reset-Title')}</h1>
                                <br />
                                <h2>{t('Reset-Password.Complete-This')}</h2>
                                <br />
                                <div className="password-div">
                                    <input type="password" autoComplete="new-password" placeholder={t('Reset-Password.Placeholder-Password')} value={password} onChange={(e) => setPassword(e.target.value)} />
                                    {isPasswordValid(password) ? <CheckIcon className="ok-icon" /> : <CloseIcon className="no-icon" />}
                                </div>
                                <br />
                                <Criteria password={password} t={t} />
                                <br />
                                <div className="password-div">
                                    <input type="password" autoComplete="new-password" placeholder={t('Reset-Password.Placeholder-Confirm-Password')} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                    {bothPasswordSame(password, confirmPassword) ? <CheckIcon className="ok-icon" /> : <CloseIcon className="no-icon" />}
                                </div>
                                <br />
                                <button disabled={!isPasswordValid(password) || !bothPasswordSame(password, confirmPassword)} onClick={sendNewPassword} type="button">{t('Reset-Password.Send')}</button>
                            </form>
                            : <>
                                {/* PASSWORD SEND */}
                                {passwordSend === 'success' &&
                                    <div className="form-container">
                                        {/* SUCCESS */}
                                        <h1>{t('Reset-Password.Success.Title')}</h1>
                                        <h2>{t('Reset-Password.Success.Success')}</h2>
                                        <br />
                                        <img src="/img/logo-Alpha.png" style={{width:'70%', objectFit:'contain'}} alt="Alpha Mares" />
                                        <NavLink to='/profil' state={"sign-in"}>
                                            <button>{t('Reset-Password.Success.Login')}</button>
                                        </NavLink>
                                    </div>
                                }
                                {passwordSend === 'invalid' &&
                                    <div className="form-container">
                                        {/* TOKEN INVALID*/}
                                        <h1>{t('Reset-Password.Invalid-Token.Title')}</h1>
                                        <br />
                                        <h2>{t('Reset-Password.Invalid-Token.Invalid-Expired')}</h2>
                                        <h2>{t('Reset-Password.Invalid-Token.Ask-New-Link')}</h2>
                                        <br />
                                        <NavLink to={"/profil/forgotten-password"}>
                                            <button>{t('Reset-Password.Invalid-Token.Receive-New')}</button>
                                        </NavLink>
                                    </div>
                                }
                                {passwordSend === 'error' &&
                                    <div className="form-container">
                                        {/* ERROR*/}
                                        <h1>{t('Reset-Password.Error.Title')}</h1>
                                        <br />
                                        <h2>{t('Reset-Password.Error.Error')}</h2>
                                    </div>
                                }

                            </>

                        : <div id="Invalid-Token" className="form-container">
                            <h1>{t('Reset-Password.Invalid-Token.Title')}</h1>
                            <br />
                            <h2>{t('Reset-Password.Invalid-Token.Invalid-Expired')}</h2>
                            <h2>{t('Reset-Password.Invalid-Token.Ask-New-Link')}</h2>
                            <br />
                            <NavLink to={"/profil/forgotten-password"}>
                                <button>{t('Reset-Password.Invalid-Token.Receive-New')}</button>
                            </NavLink>
                        </div>

                    : <div id="Checking" className="form-container">
                        <h1 className="dots-loading">{t('Reset-Password.Checking.Title')}</h1>
                        <br />
                        <h2>{t('Reset-Password.Checking.Please-Wait')}</h2>
                    </div>
                }
            </div>
        </div>
    )
}

export const Criteria = (props) => {
    const { password, t } = props;

    return (
        <div className="criteria-container">
            <text className="criteria-title">{t('Reset-Password.Must-Contains')}</text>
            <div className="criteria">{passwordLongEnought(password) ? <CheckCircleIcon className="ok-icon" /> : <CancelIcon className="no-icon" />} {t('Reset-Password.Criteria-1')}</div>
            <div className="criteria">{containsUpperLower(password) ? <CheckCircleIcon className="ok-icon" /> : <CancelIcon className="no-icon" />} {t('Reset-Password.Criteria-2')}</div>
            <div className="criteria">{containsNumber(password) ? <CheckCircleIcon className="ok-icon" /> : <CancelIcon className="no-icon" />} {t('Reset-Password.Criteria-3')}</div>
        </div>
    )
}