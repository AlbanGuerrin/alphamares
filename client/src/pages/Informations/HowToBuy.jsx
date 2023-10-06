import React from "react";
import LoginIcon from '@mui/icons-material/Login';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function HowtoBuy() {
    const [t] = useTranslation();

    return (
        <div className="page">
            <div className="title-page">
                <h1>{t('How-Buy.How-Buy')}</h1>
            </div>
            <div className="how-to-buy">
                <div className="container">
                    <hr />
                    <div className="row">
                        <div className="col">
                            <div className="circle">
                                <HowToRegIcon className="icon" />
                            </div>
                            <br />
                            <h3 className="title">{t('How-Buy.Step')} 1</h3>
                            <p className="text"><NavLink to='/profil' state={"sign-up"}>{t('How-Buy.Sign-up')}</NavLink> {t('How-Buy.to-Bid')}</p>
                        </div>
                        <div className="col">
                            <div className="circle">
                                <MarkEmailReadIcon className="icon" />
                            </div>
                            <br />
                            <h3 className="title">{t('How-Buy.Step')} 2</h3>
                            <p className="text">{t('How-Buy.Confirm-Email')}</p>
                        </div>
                        <div className="col">
                            <div className="circle">
                                <LoginIcon className="icon" />
                            </div>
                            <br />
                            <h3 className="title">{t('How-Buy.Step')} 3</h3>
                            <p className="text"><NavLink to='/profil' state={"sign-in"}>{t('How-Buy.Log-In')}</NavLink></p>
                        </div>
                        <div className="col">
                            <div className="circle">
                            <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide icon">
                                <path d="m9 9 5 12 1.774-5.226L21 14 9 9z"></path>
                                <path d="m16.071 16.071 4.243 4.243"></path>
                                <path d="m7.188 2.239.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656-2.12 2.122"></path>
                                </svg>
                            </div>
                            <br />
                            <h3 className="title">{t('How-Buy.Step')} 4</h3>
                            <p className="text">{t('How-Buy.Bid')}</p>
                        </div>
                    </div>
                    <br />
                </div>
                <br />
            </div>

        </div>
    )
}