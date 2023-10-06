import React, { useContext } from 'react'
import Log from '../components/Log';
import { UidContext } from '../components/AppContext';
import Profil from './Profil/Profil';
import { useLocation } from 'react-router-dom';


const SignUp = (props) => {
    const {uid} = useContext(UidContext);
    const location = useLocation();
    return (
        <div >
            {uid ? (
                < Profil />
            ) : (
                <div style={{background: 'linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 50%, rgba(12,60,60,1) 100%)', minHeight:'80vh'}}>
                    <Log signin={(location.state === "sign-in")} signup={(location.state === "sign-up")}/>
                </div>
            )}
        </div>
    );
};

export default SignUp;