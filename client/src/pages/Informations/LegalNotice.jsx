import React from "react";
import { useTranslation } from "react-i18next";
export default function LegalNotice() {
    const [t] = useTranslation();

    return (
        <div className="page">
            <div className='title-page'>
                <h1 >{t('Legal-Notice.Legal-Notice')}</h1>
            </div>
            <div className='legal-notice'>
                <p>{t('Legal-Notice.Legal-Notice1')} <a href="https://www.alphamares.com" target="_blank" rel="noreferrer">www.alphamares.com</a> {t('Legal-Notice.Legal-Notice2')}</p>
                <br />
                <p>{t('Legal-Notice.Legal-Notice3')} <a href="mailto: contact@alphamares.com">contact@alphamares.com</a>.</p>
                <div className='row'>
                    <img src="./img/logo-Alpha.png" alt="Alpha Mares Logo" />
                    <div className='column'>
                        <h2>{t('Legal-Notice.Editor')}</h2>
                        <p><strong>{t('Legal-Notice.Company-Name')} :</strong> Alpha Mares</p>
                        <p><strong>{t('Legal-Notice.Company-Status')} :</strong> Société à Responsabilité Limitée</p>
                        <p><strong>{t('Legal-Notice.RCS')} :</strong> Alençon B 950 761 262</p>
                        <p><strong>{t('Legal-Notice.Capital')} :</strong> 4000 Euros</p>
                        <p><strong>{t('Legal-Notice.VAT-Number')} :</strong> FR59950761262</p>
                        <p><strong>{t('Legal-Notice.Company-Headquarter')} :</strong> 1 Route de la Pouprière 61250 Semallé</p>
                        <p><strong>{t('Legal-Notice.Email')} :</strong> <a href="mailto: contact@alphamares.com">contact@alphamares.com</a></p>
                        <p><strong>{t('Legal-Notice.Legal-Representative')} :</strong> Benoist Gicquel des Touches</p>
                        <p><strong>{t('Legal-Notice.Publication-Director')} :</strong> Benoist Gicquel des Touches</p>
                        <br />
                        <h2>{t('Legal-Notice.Host')}</h2>
                        <p><strong>SAS PulseHeberg</strong></p>
                        <p><strong>{t('Legal-Notice.Host-Status')} :</strong> Société par Actions Simplifiée</p>
                        <p><strong>{t('Legal-Notice.Host-Headquarter')} :</strong> 9, Boulevard de Strasbourg 83000 Toulon</p>
                        <p><strong>{t('Legal-Notice.Email')} :</strong> <a href="mailto: contact@pulseheberg.com">contact@pulseheberg.com</a></p>
                        <p><strong>{t('Legal-Notice.Website')} :</strong> <a href="http://www.pulseheberg.com" target="_blank" rel="noreferrer">http://www.pulseheberg.com</a></p>
                    </div>
                </div>
            </div>

        </div>
    )
}