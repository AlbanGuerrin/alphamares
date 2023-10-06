import React from 'react'
import { useTranslation } from "react-i18next";

const Contact = () => {
    const [t] = useTranslation();
    return (
        <div className='page'>
            <div className='title-page'>
                <h1>{t("Contact.Title")}</h1>
            </div>
            <div className='contact'>
                <div className='row'>
                    <img src="./img/contact_horse.jpg" alt="Contact horse" />
                    <div className='contact-info'>
                        <p>{t("Contact.Info")}</p>
                        <br />
                        <h2>{t("Contact.Call")}</h2>
                        <br />
                        <div className='details'>
                            <img src='./img/icons/phone.svg' alt='icon-phone' width='80vw' />
                            <a href="tel:0633346654" >+33 6 33 34 66 54</a>
                        </div>
                        <br />
                        <h2>{t("Contact.Write")}</h2>
                        <br />
                        <div className='details'>
                            <img src='./img/icons/envelope.svg' alt='icon-phone' width='80vw' />
                            <a href="mailto: contact@alphamares.com">contact@alphamares.com</a>
                        </div>
                    </div>
                </div>
                <br />
                <div className='social'>
                    <h2>{t("Contact.Follow")}</h2>
                    <div className='social-container'>
                        <a href="https://www.facebook.com/profile.php?id=100087215024602" target="_blank" rel="noreferrer">
                            <img src='./img/icons/facebook.svg' alt='Logo Facebook' />
                            <h3>Facebook</h3>
                        </a>
                        <br />
                        <a href="https://www.instagram.com/alpha.mares/" target="_blank" rel="noreferrer">
                            <img src='./img/icons/instagram.svg' alt='Logo Instagram' />
                            <h3>Instagram</h3>
                        </a>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Contact;