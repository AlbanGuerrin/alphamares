import axios from "axios";
import React, { useEffect, useState } from "react";
import { isEmpty } from "../../utils/Utils";
import { useNavigate, useParams, } from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';


export default function EmailVerification() {
    let params = useParams();
    const [verified, setVerified] = useState();
    let navigate = useNavigate();

    useEffect(() => {
        axios.patch(`${process.env.REACT_APP_API_URL}api/verif/email-verification/${params.token}`, {"userId": params.userId})
            .then((res) => {
                console.log(res);
                if (res.data === "Email verifified successfully") {
                    setVerified(true);
                    setTimeout(() => {
                        navigate("/");
                    }, 5000);
                }
                else setVerified(false);
            })
            .catch((err) => {
                console.log(err);
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <div className="page">
            <div className='title-page'>
                <h1>Vérification adresse mail</h1>
            </div>
            {isEmpty(verified) ?
                <div>
                    <h3 className="dots-loading" style={{ fontSize: '2vw' }}>Vérification</h3>
                </div>
                : verified ?
                    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', fontSize: '2vw' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>Email vérifié <CheckCircleIcon style={{ width: "3vw", height: '3vw' }} /></h3>
                        <br />
                        <h3>Bienvenue sur Alpha Mares, vous allez être redirigé sur la page d'acceuil.</h3>
                    </div>
                    :
                    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', fontSize: '2vw' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>Lien de vérification expiré <ErrorIcon className='error' style={{ width: "3vw", height: '3vw'}} /></h3>
                        <br />
                        <h3>Bienvenue sur Alpha Mares, vous allez être redirigé sur la page d'acceuil.</h3>
                    </div>
            }
        </div>

    )
}