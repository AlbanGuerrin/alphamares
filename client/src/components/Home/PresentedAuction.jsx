import moment from "moment";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { isEmpty } from "../../utils/Utils";
import { useTranslation } from "react-i18next";

export default function PresentedAuction(props) {
    const [t, i18n] = useTranslation();

    const [timerTo, setTimerTo] = useState()

    useEffect(() => {
        if (props.type === 'To come') {
            const interval = setInterval(() => setTimerTo(moment.duration(moment(props.displayedAuction.start).diff(moment()))), 1000)
            return () => clearInterval(interval);
        } else if (props.type === 'In progress') {
            const interval = setInterval(() => setTimerTo(moment.duration(moment(props.displayedAuction.end).diff(moment()))), 1000)
            return () => clearInterval(interval);
        } else if (props.type === 'Previous') {
            const interval = setInterval(() => setTimerTo(moment(props.displayedAuction.end).fromNow()), 1000)
            return () => clearInterval(interval);
        }
    }, [timerTo, props])

    return (
        <div className="presented-auction">
            {props.type === 'To come' && <h1 className="title">{t('Home.Presented-Auction.To-come')}</h1>}
            {props.type === 'Previous' && <h1 className="title">{t('Home.Presented-Auction.Closed')}</h1>}
            {props.type === 'In progress' &&
                <div className="live-auction">
                    <h1 className="title">{t('Home.Presented-Auction.In-Progress')}</h1>
                    <div className="live-container">
                        <div className="dot"></div>
                        <p className="live title">LIVE</p>
                    </div>
                </div>
            }
            <div className="card-auction">
                <NavLink to={`/auction/${props.displayedAuction._id}`} >
                    <h2 style={{ fontWeight: "800" }}>{i18n.language === "en-EN" ? props.displayedAuction.titleEN : props.displayedAuction.title}</h2>
                    {(!isEmpty(timerTo) && (props.type === 'In progress')) && <h3>{t('Home.Presented-Auction.End')} {timerTo.hours()}h {timerTo.minutes()}min {timerTo.seconds()}s</h3>}
                    {(!isEmpty(timerTo) && props.type === 'To come') && <h3>{t('Home.Presented-Auction.In')} {timerTo.hours()}h {timerTo.minutes()}min {timerTo.seconds()}s</h3>}
                    {(!isEmpty(timerTo) && (props.type === 'Previous')) && <h3>{timerTo}</h3>}
                    {/* <h5 className="description" >{props.displayedAuction.description}</h5> */}
                    <button className="btn activate">{t('Home.Presented-Auction.See-Catalog')}</button>
                </NavLink>
            </div>
        </div>

    )
}