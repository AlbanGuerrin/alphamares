import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { whenAuction } from "../../utils/Utils";
import moment from "moment";
import { useTranslation } from "react-i18next";

export default function AuctionCard(props) {
    const auction = props.auction;
    const [timerTo, setTimerTo] = useState("");
    const [t, i18n] = useTranslation();

    useEffect(() => {
        if (whenAuction(auction) === "coming") {
            const interval = setInterval(() => {
                const diff = moment.duration(moment(auction.start).diff(moment()))
                setTimerTo(diff.hours() + "h " + diff.minutes() + "min " + diff.seconds() + "s.")
            }, 1000)
            return () => clearInterval(interval);
        } else if (whenAuction(auction) === "now") {
            const interval = setInterval(() => {
                const diff = moment.duration(moment(auction.end).diff(moment()))
                setTimerTo(diff.hours() + "h " + diff.minutes() + "min " + diff.seconds() + "s.")
            }, 1000)
            return () => clearInterval(interval);
        } else if (whenAuction(auction) === "passed") {
            setTimerTo(moment(auction.end).format("L"))
        }
    }, [auction, timerTo])


    return (
        <div className="card">
            {whenAuction(auction) === "now" &&
                <div className="info live-auction">
                    <p>{t('Home.Presented-Auction.In-Progress')}</p>
                    <div className="live-container">
                        <div className="dot"></div>
                        <p className="live title">LIVE</p>
                    </div>
                </div>
            }
            {whenAuction(auction) === "coming" &&
                <div className="info">
                    <p>{t('Home.Presented-Auction.To-come')}</p>
                </div>
            }
            <Card>
                <NavLink to={`/auction/${auction._id}`} >
                    <CardMedia>
                        <img src={`${process.env.REACT_APP_API_URL}${auction.picture}`} alt="Auction" />
                    </CardMedia>
                    <CardContent sx={{ paddingBottom: '0!important', padding: 0 }}>
                        <div className="content-container">
                            <h2 className="title-auction-card">
                                {i18n.language === "fr" ? auction.title : auction.titleEN}
                            </h2>
                            <Typography gutterBottom variant="h7" component="div">
                                {moment(auction.start).format('L')} - {moment(auction.end).format('L')}
                            </Typography>
                            <Typography gutterBottom variant="h6" component="div">
                                {whenAuction(auction) === "now" &&
                                    <div>
                                        {t('Auction-Card.End-In')} {timerTo}
                                    </div>
                                }
                                {whenAuction(auction) === "coming" && <div>
                                    {t('Auction-Card.In')} {timerTo}
                                </div>
                                }
                                {whenAuction(auction) === "passed" &&
                                    <div>
                                        {t('Auction-Card.Closed')} {timerTo}
                                    </div>
                                }
                            </Typography>
                            <p className="sub-title">
                                {i18n.language === "fr" ? auction.description : auction.descriptionEN}
                            </p>
                        </div>
                    </CardContent>
                </NavLink>
            </Card>
        </div>

    )

}