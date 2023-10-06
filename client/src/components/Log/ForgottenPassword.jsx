import axios from "axios";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";


export default function ForgottenPassword() {
    const [email, setEmail] = useState();
    const [mailSend, setEmailSend] = useState(false);
    const [unknowEmail, setUnknowEmail] = useState(false);
    const {t} = useTranslation();

    function sendEmail() {
        axios.post(`${process.env.REACT_APP_API_URL}api/password/sendMailResetPassword`, { email: email })
            .then((res) => {
                const data = res.data;
                if (data === "Email sent") {
                    setEmailSend(true);
                }
            })
            .catch((err) => {
                console.log(err);
                const data = err.response.data;
                if (data === "Email not found") {
                    setUnknowEmail(true);
                }
                console.log(data);
            })
    }


    return (
        <div className="reset-password">
            <div className="page">
                <img src="/img/golden_horse.jpg" alt="Logo Alpha-Mares" />
                <form className="form-container" >
                    <h1>{t('Reset-Password.Forgotten-Password')}</h1>
                    <br />
                    {!mailSend ?
                        <>
                            <p>{t('Reset-Password.Enter-Email')}</p>
                            <br />
                            <input type="text" name="email" id="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                            <div className='email error'>{unknowEmail ? t('Reset-Password.Error.No-Account') : ""}</div>
                            <br />
                            <input className='btn' value={t('Reset-Password.Send')} onClick={sendEmail} />
                        </>
                        :
                        <>
                            <p className="confirm">{`${t('Reset-Password.Confirm')} ${email}`}</p>
                            <br />
                            <br />
                            <p>{t('Reset-Password.No-Email')}</p>
                            <p>{t('Reset-Password.Verify-Spam')}</p>
                            <br />
                            <button onClick={sendEmail}>{t('Reset-Password.Resend')}</button>
                        </>
                    }
                </form>
            </div>
        </div>
    )
}