import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import FollowLotHandler from '../Auction/FollowLotHandler';
import { NavLink } from 'react-router-dom';
import { isEmbryo, isEmpty, whenLot, numberWithPoint } from '../../utils/Utils';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { UidContext } from '../AppContext';


function LotCard(props) {
    const lot = props.lot;
    const [timerTo, setTimerTo] = useState("");
    const { uid } = useContext(UidContext);
    const [t, i18n] = useTranslation();

    useEffect(() => {
        if (!isEmpty(lot)) {
            if (whenLot(lot) === "coming") {
                const comingInterval = setInterval(() => {
                    const diff = moment.duration(moment(lot.start).diff(moment()))
                    setTimerTo(diff.hours() !== 0 ? (diff.hours() + "h " + diff.minutes() + "min " + diff.seconds() + "s") : ("") + diff.minutes() !== 0 ? (diff.minutes() + "min " + diff.seconds() + "s") : ("") + diff.seconds() + "s")
                }, 1000)
                return () => clearInterval(comingInterval);
            }
            if (whenLot(lot) === "now") {
                const nowInterval = setInterval(() => {
                    const diff = moment.duration(moment(lot.end).diff(moment()))
                    setTimerTo(diff.hours() !== 0 ? (diff.hours() + "h " + diff.minutes() + "min " + diff.seconds() + "s") : ("") + diff.minutes() !== 0 ? (diff.minutes() + "min " + diff.seconds() + "s.") : ("") + diff.seconds() + "s.")
                }, 1000)
                return () => clearInterval(nowInterval);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lot.end, lot.start]);

    return (
        <div className="card">
            {!isEmpty(props) &&
                <NavLink to={`/lot/${lot._id}`}>
                    <Card>
                        {isEmbryo(lot) &&
                            <CardMedia>
                                <div className="split-image-container">
                                    <img src={`${process.env.REACT_APP_API_URL}${lot.pictureFather}`} alt="Father" className='left' />
                                    <img src={`${process.env.REACT_APP_API_URL}${lot.pictureMother}`} alt="Mother" className="right" />
                                    <div>
                                        <div className='border' />
                                    </div>
                                </div>
                                <FollowLotHandler lotId={lot._id} />
                            </CardMedia>
                        }
                        {!isEmbryo(lot) &&
                            <CardMedia>
                                <div>
                                    <img src={`${process.env.REACT_APP_API_URL}${lot.pictures[0]}`} alt="Lot" />
                                </div>
                                <FollowLotHandler lotId={lot._id} />
                            </CardMedia>
                        }
                        <div className='parents-or-name'>
                            {isEmbryo(lot) ?
                                <> <p>{lot.pedigree.gen1.father}</p> X <p>{lot.pedigree.gen1.mother}</p></>
                                : <p>{lot.name}</p>
                            }
                        </div>
                        <CardContent>
                            <h2>Lot {lot.number} - {t('Lot.' + lot.type)}</h2>
                            <hr />
                            <h1>{i18n.language === "fr" ? lot.title : lot.titleEN}</h1>
                            <hr />
                            <h2>{lot.pedigree.gen1.father} X {lot.pedigree.gen2.GFMaternal}</h2>
                            <br />
                            {whenLot(lot) === "now" &&
                                <div className='chrono-price'>
                                    <h1>{timerTo}</h1>
                                    <div className='sep'>|</div>
                                    {isEmpty(lot.lastBid) ? <h1>{numberWithPoint(lot.price)} €</h1> : <h1>{numberWithPoint(lot.lastBid.amount)} €</h1>}
                                </div>
                            }
                        </CardContent>
                        <div className='Action'>
                            {whenLot(lot) === "now" &&
                                <div className='open'>
                                    {!isEmpty(lot.lastBid) && lot.lastBid.bidderId === uid ?
                                        <h1 className='holder'>{t('Auction.YouHolder')}</h1>
                                        : <h1>{t('Auction.Bid')}</h1>
                                    }
                                </div>
                            }
                            {whenLot(lot) === "passed" &&
                                <div className='closed'>
                                    {isEmpty(lot.lastBid) ?
                                        <h1>{t('Auction.Closed')}</h1>
                                        :
                                        <div>
                                            {lot.lastBid.bidderId === uid ?
                                                <h1 className='you-won'>{t('Auction.Won')}</h1>
                                                :
                                                <h1>{t('Auction.Closed')}</h1>
                                            }
                                        </div>
                                    }
                                </div>
                            }
                            {whenLot(lot) === "coming" &&
                                <div className='coming'>
                                    <h1>{t('Auction.In')} {timerTo}</h1>
                                </div>
                            }

                        </div>
                    </Card>
                </NavLink>
            }
        </div>
    )
}

export default LotCard;
