import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

const Footer = () => {
    const [t] = useTranslation();

    return (
        <div className="footer">
            <hr style={{ width: "100%", textAlign: "center", height: "3px", border: "0", background: 'linear-gradient(to right, rgba(239, 193, 109, 0.2), rgba(239, 193, 109, 0.75), rgba(239, 193, 109, 0.2))' }} /> {/* 0.2, 0.75, 0.2 */}
            <div className="footer-container">
                <div>
                    <a href="mailto:contact@alphamares.com">
                        <h3>contact@alphamares.com</h3>
                    </a>
                    <a href="tel:+33633346654">
                        <h3>+33 6 33 34 66 54</h3>
                    </a>
                    <a href={`${process.env.REACT_APP_API_URL}legals/Copyright.pdf`} target="_blank" rel="noreferrer">
                        <h3>Copyright ©</h3>
                    </a>
                </div>
                <br />
                <div>
                    <a href={`${process.env.REACT_APP_API_URL}legals/CGU.pdf`} target="_blank" rel="noreferrer">
                        <h3>{t("Footer.Terms")}</h3>
                    </a>
                    <a href={`${process.env.REACT_APP_API_URL}legals/Politique_de_Confidentialité.pdf`} target="_blank" rel="noreferrer">
                        <h3>{t("Footer.Policy")}</h3>
                    </a>
                    <NavLink to='/notice'>
                        <h3>{t("Footer.Mentions")}</h3>
                    </NavLink>
                </div>
                <br />
                <div>
                    <h2>{t("Footer.Follow")}</h2>
                    <a href="https://www.facebook.com/profile.php?id=100087215024602" target="_blank" rel="noreferrer">
                        <div className="row">
                            <img src='./img/icons/facebook.svg' alt='Logo Facebook' />
                            <h3>Facebook</h3>
                        </div>
                    </a>
                    <a href="https://www.instagram.com/alpha.mares/" target="_blank" rel="noreferrer">
                        <div className="row">
                            <img src='./img/icons/instagram.svg' alt='Logo Instagram' />
                            <h3>Instagram</h3>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Footer;