import React, { useContext, useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import Tabs from "@mui/material/Tabs";
import Tab from '@mui/material/Tab';
import { gold } from '../../App';
import LaunchIcon from '@mui/icons-material/Launch';
import { isImplantedEmbryo, isEmpty, isFrozenEmbryo, isFoal, isBroodmareEmpty, isYearling, isBroodmareFull, whenLot } from "../../utils/Utils";
import { useSelector } from 'react-redux';
import Slider from "./Slider";
import { UidContext } from '../AppContext';
import { Dialog } from "@mui/material";
import { useTranslation } from "react-i18next";


export default function Lot() {
    const [lot, setLot] = useState();
    const [auction, setAuction] = useState();
    let params = useParams()
    const user = useSelector((state) => state.userReducer);
    const [t, i18n] = useTranslation();

    let prevLot;
    let prevAuction;

    function fetchData() {
        axios.get(`${process.env.REACT_APP_API_URL}api/lot/lotAndAuction/${params.id}`)
            .then((res) => {
                if (res.data && JSON.stringify(prevLot) !== JSON.stringify(res.data.lot)) {
                    setLot(res.data.lot)
                    prevLot = res.data.lot;
                };
                if (res.data && JSON.stringify(prevAuction) !== JSON.stringify(res.data.auction)) {
                    setAuction(res.data.auction)
                    prevAuction = res.data.auction;
                };
            }
            )
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(() => fetchData(), 5000)
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="page page-lot">
            {!isEmpty(auction) && !isEmpty(lot) &&
                <div className="lot">
                    <div className="presentation">
                        <div className="left">
                            <NavLink to={`/auction/${auction._id}`}>
                                <button className="btn">{t('Lot.Back-Catalog')}</button>
                            </NavLink>
                            <br />
                            <h3>Lot {lot.number} - {t('Lot.' + lot.type)}</h3>
                            <br />
                            <h2>{i18n.language === "fr" ? lot.title : lot.titleEN}</h2>
                        </div>
                        <BidPanel lot={lot} auction={auction} user={user} />
                    </div>
                    <br />
                    <div className="images-and-pedigree">
                        <Slider lot={lot} />
                        <Pedigree lot={lot} />
                    </div>
                    <br />
                    <LotInfos lot={lot} />
                </div>
            }
        </div>
    )
}


function Pedigree(props) {
    const lot = props.lot;
    return (
        <div className="pedigree" >
            <div className="pedigree-container">
                <div className="row">
                    <div className="col">
                        <h4>{lot.pedigree.gen1.father}</h4>
                    </div>
                    <div className="col">
                        <h4>{lot.pedigree.gen2.GFPaternal}</h4>
                        <hr />
                        <h4>{lot.pedigree.gen2.GMPaternal}</h4>
                    </div>
                    <hr className="sep" style={{ width: '75%' }} />
                    <div className="col">
                        <h4>{lot.pedigree.gen3.GGFPF}</h4>
                        <hr />
                        <h4>{lot.pedigree.gen3.GGMPF}</h4>
                        <hr />
                        <h4>{lot.pedigree.gen3.GGFPM}</h4>
                        <hr />
                        <h4>{lot.pedigree.gen3.GGMPM}</h4>
                    </div>
                </div>

                <hr />
                <hr className="sep" />

                <div className="row">
                    <div className="col">
                        <h4>{lot.pedigree.gen1.mother}</h4>
                    </div>
                    <hr className="sep" style={{ width: '50%' }} />
                    <div className="col">
                        <h4>{lot.pedigree.gen2.GFMaternal}</h4>
                        <hr />
                        <h4>{lot.pedigree.gen2.GMMaternal}</h4>
                    </div>
                    <hr className="sep" style={{ width: '75%' }} />
                    <div className="col">
                        <h4>{lot.pedigree.gen3.GGFMF}</h4>
                        <hr />
                        <h4>{lot.pedigree.gen3.GGMMF}</h4>
                        <hr />
                        <h4>{lot.pedigree.gen3.GGFMM}</h4>
                        <hr />
                        <h4>{lot.pedigree.gen3.GGMMM}</h4>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function BidPanel(props) {
    const userData = props.user;
    const lot = props.lot;
    const auction = props.auction;
    const [terms, setTerms] = useState(false);
    const [step, setStep] = useState(0);
    const [bidPlus, setBidPlus] = useState(0);
    const [timerTo, setTimerTo] = useState("");
    const [notBidderAnymore, setNotBidderAnymore] = useState(false);
    const { uid } = useContext(UidContext);;
    const [t] = useTranslation();

    function stepCalcul() {
        if (isEmpty(lot.lastBid)) {
            if (lot.price < 1000) setStep(100);
            if (lot.price >= 1000 && 20000 > lot.price) setStep(500);
            if (lot.price >= 20000 && 50000 > lot.price) setStep(1000);
            if (50000 <= lot.price) setStep(2000);
        }
        else {
            if (lot.lastBid.amount < 1000) setStep(100);
            if (lot.lastBid.amount >= 1000 && 20000 > lot.lastBid.amount) setStep(500);
            if (lot.lastBid.amount >= 20000 && 50000 > lot.lastBid.amount) setStep(1000);
            if (50000 <= lot.lastBid.amount) setStep(2000);
        }
        setBidPlus(step);
    }

    function subBid() {
        if (bidPlus > step) {
            setBidPlus(bidPlus - step)
        }
    }

    function addBid() {
        setBidPlus(step + bidPlus)
    }

    function handleTerms(event) {
        setTerms(event.target.checked);
    }

    const sendBid = async () => {
        if (terms && bidPlus >= step) {
            setTerms(false);
            const bid = {
                bidderId: userData._id,
                auctionId: auction._id,
                lotId: lot._id,
                amount: isEmpty(lot.lastBid) ? lot.price + bidPlus : lot.lastBid.amount + bidPlus,
            }
            await axios.post(`${process.env.REACT_APP_API_URL}api/bid`, bid)
                .then((res) => { })//console.log("Bid created : " + { res }))
                .catch((err) => console.log(err))
        }
    }

    function numberWithPoint(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    function wasBidder(lot, uid) {
        if (!isEmpty(lot.bids)) {
            lot.bids.forEach(bid => {
                if (bid.bidderId === uid) {
                    setNotBidderAnymore(true);
                };
            });
        }
        else {
            setNotBidderAnymore(false);
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => stepCalcul(), [step]);
    useEffect(() => {
        wasBidder(lot, uid);
        if (whenLot(lot) === "coming") {
            const comingInterval = setInterval(() => {
                const diff = moment.duration(moment(lot.start).diff(moment()))
                setTimerTo(diff.hours() !== 0 ? (diff.hours() + "h " + diff.minutes() + "min " + diff.seconds() + "s") : ("") + diff.minutes() !== 0 ? (diff.minutes() + "min " + diff.seconds() + "s") : ("") + diff.seconds() + "s")
            }, 1000)
            return () => clearInterval(comingInterval);
        } else if (whenLot(lot) === "now") {
            const nowInterval = setInterval(() => {
                const diff = moment.duration(moment(lot.end).diff(moment()))
                setTimerTo(diff.hours() !== 0 ? (diff.hours() + "h " + diff.minutes() + "min " + diff.seconds() + "s") : ("") + diff.minutes() !== 0 ? (diff.minutes() + "min " + diff.seconds() + "s") : ("") + diff.seconds() + "s")
            }, 1000)
            return () => clearInterval(nowInterval);
        } else if (whenLot(lot) === "passed") {
            const diff = moment.duration(moment(moment()).diff(moment(lot.end)))
            if (diff.days() >= 1) {
                setTimerTo(diff.days() + " jours.")
            }
            else {
                const passedInterval = setInterval(() => {
                    setTimerTo(diff.hours() !== 0 ? (diff.hours() + "h " + diff.minutes() + "min " + diff.seconds() + "s") : ("") + diff.minutes() !== 0 ? (diff.minutes() + "min " + diff.seconds() + "s") : ("") + diff.seconds() + "s")
                }, 1000)
                return () => clearInterval(passedInterval);
            }
        }
    }, [auction, lot, terms, uid])

    return (
        <div className="bidPanel">
            {(whenLot(lot) === "now") && !isEmpty(uid) && userData.blocked &&
                <div className='bidPanel-container'>
                    <div className="blob">
                        <h1>{t('Lot.Panel.Current-Auction')}</h1>
                        {isEmpty(lot.lastBid) ? <h1 className="moove">{numberWithPoint(lot.price)} €</h1> : <h1 className="moove">{numberWithPoint(lot.lastBid.amount)}€</h1>}
                    </div>
                    <h2>{t('Lot.Panel.Ends-In')} <br /> <strong>{timerTo}</strong></h2>
                    <h2>{t('Lot.Panel.Blocked-Account')}</h2>
                </div>
            }
            {(whenLot(lot) === "now") && !isEmpty(uid) && !userData.blocked &&
                <div className='bidPanel-container'>
                    {!isEmpty(lot.lastBid) ?
                        lot.lastBid.bidderId === uid ?
                            <div className="YouFirst">
                                {t('Lot.Panel.You-Are-Holder')}
                            </div>
                            : notBidderAnymore ?
                                <div className="YouFirst">
                                    {t('Lot.Panel.You-Are-Not-Holder-Anymore')}
                                </div>
                                : <></>
                        : <></>
                    }
                    <div className="blob">
                        <h1>{t('Lot.Panel.Current-Auction')}</h1>
                        {isEmpty(lot.lastBid) ? <h1 className="moove">{numberWithPoint(lot.price)} €</h1> : <h1 className="moove">{numberWithPoint(lot.lastBid.amount)}€</h1>}
                    </div>
                    <h2>{t('Lot.Panel.Ends-In')}<br /> <strong>{timerTo}</strong></h2>
                    <div className="terms-container">
                        <input type="checkbox" id="terms" onChange={handleTerms} value={terms} checked={terms} />
                        <label htmlFor="terms">{t('Lot.Panel.I-Accept')} <a href={`${process.env.REACT_APP_API_URL}legals/CGU.pdf`} target="_blank" rel="noopener noreferrer" >{t('Lot.Panel.CGU')}</a>.</label>
                    </div>
                    <div className="btn-container">
                        <div className="btn-add-sub">
                            <div className="btna" onClick={subBid}>-</div>
                            {isEmpty(lot.lastBid) ? <h3>{numberWithPoint(lot.price + bidPlus)} €</h3> : <h3>{numberWithPoint(lot.lastBid.amount + bidPlus)} €</h3>}
                            <div className="btna" onClick={addBid}>+</div>
                        </div>
                        <div className="btn-lot">
                            <button disabled={(!terms || bidPlus === 0)} onClick={sendBid}>{t('Lot.Panel.Bid')} </button>
                        </div>
                    </div>
                </div>
            }
            {(whenLot(lot) === "now") && isEmpty(uid) && !userData.blocked &&
                <div className='bidPanel-container'>
                    <div className="blob">
                        <h1>{t('Lot.Panel.Current-Auction')}</h1>
                        {isEmpty(lot.lastBid) ? <h1 className="moove">{numberWithPoint(lot.price)} €</h1> : <h1 className="moove">{numberWithPoint(lot.lastBid.amount)}€</h1>}
                    </div>
                    <h2>{t('Lot.Panel.Ends-In')} <br /> <strong>{timerTo}</strong></h2>
                    <div className="btn-container">
                        <NavLink className="btn" to='/profil' state={"sign-up"}>
                            {t('Lot.Panel.Create-Account')}
                        </NavLink>
                    </div>
                </div>
            }
            {whenLot(lot) === "coming" && isEmpty(uid) &&
                <div className='bidPanel-container'>
                    <div className="blob">
                        <h1 style={{ whiteSpace: 'nowrap' }}>{t('Lot.Panel.Start-Auction')}</h1>
                        <h1>{numberWithPoint(lot.price)}€</h1>
                    </div>
                    <div>
                        <h5 style={{ fontWeight: '100' }}>{t('Lot.Panel.In')}</h5>
                        <h5>{timerTo}</h5>
                    </div>
                    <div className="btn-container">
                        <NavLink className="btn" to='/profil' state={"sign-up"}>
                            {t('Lot.Panel.Create-Account')}
                        </NavLink>
                    </div>
                </div>
            }
            {whenLot(lot) === "coming" && !isEmpty(uid) &&
                <div className='bidPanel-container'>
                    <div className="blob">
                        <h1 style={{ whiteSpace: 'nowrap' }}>{t('Lot.Panel.Start-Auction')}</h1>
                        <h1>{numberWithPoint(lot.price)}€</h1>
                    </div>
                    <div>
                        <h5 style={{ fontWeight: '100' }}>{t('Lot.Panel.In')}</h5>
                        <h5>{timerTo}</h5>
                    </div>
                </div>
            }
            {whenLot(lot) === "passed"
                &&
                <div className='bidPanel-container'>
                    {!isEmpty(lot.lastBid) &&
                        lot.lastBid.bidderId === uid &&
                        <div className="YouFirst">
                            {t('Lot.Panel.You-Are-Winner')}
                        </div>
                    }
                    <div className="blob">
                        <h1>{t('Lot.Panel.Last-Auction')}</h1>
                        {isEmpty(lot.lastBid) ? <h1>{numberWithPoint(lot.price)} €</h1> : <h1>{numberWithPoint(lot.lastBid.amount)}€</h1>}
                    </div>
                    <div>
                        <h5 style={{ fontWeight: '100' }}>{t('Lot.Panel.Finished')}</h5>
                        {/* <h5>{moment.duration(moment(moment()).diff(moment(lot.end))).hours()}h {moment.duration(moment(moment()).diff(moment(lot.end))).minutes()}min {moment.duration(moment(moment()).diff(moment(lot.end))).seconds()}s</h5> */}
                    </div>
                </div>
            }
        </div>
    )
}


function LotInfos(props) {
    const [index, setIndex] = useState(0);
    const lot = props.lot;
    const [openTVA, setOpenTVA] = React.useState(false);
    const {t, i18n} = useTranslation();

    const handleClickOpen = () => {
        setOpenTVA(true);
    };

    const handleClose = () => {
        setOpenTVA(false);
    };

    const handleChange = (event, newIndex) => {
        setIndex(newIndex);
    };

    function Info() {
        return (
            <div>
                {isFrozenEmbryo(lot) &&
                    <div className="row">
                        <div className="col">
                            <h4><strong>{t('Lot.Field.Type')}</strong> {t('Lot.' + lot.type)}</h4>
                            <h4><strong>{t('Lot.Field.Production-Date')}</strong> {moment(lot.productionDate).format('LL')}</h4>
                        </div>
                        <div className="col">
                            <h4><strong>{t('Lot.Field.Sexe')}</strong> {t('Lot.' + lot.sexe)}</h4>
                            <h4><strong>{t('Lot.Field.Seller')}</strong> {lot.sellerNationality} ({t('Lot.' + lot.sellerType)})</h4>
                        </div>
                        <div className="col">
                            <h4><strong>{t('Lot.Field.Location')}</strong> {lot.location}</h4>
                            <h4><strong>{t('Lot.Field.TVA')}</strong> {lot.tva} % <p onClick={handleClickOpen} className="calcul-TVA">{t('Lot.Field.Calculs-TVA')}</p></h4>
                        </div>
                    </div>}

                {isImplantedEmbryo(lot) &&
                    <div className="row">
                        <div className="col">
                            <h4><strong>{t('Lot.Field.Type')}</strong> {t('Lot.' + lot.type)}</h4>
                            <h4><strong>{t('Lot.Field.Location')}</strong> {lot.location}</h4>
                            {(lot.reproduction === 'ICSI' || lot.reproduction === 'Transfert') ?
                                <h4><strong>{t('Lot.Field.Age-Carrier')}</strong> {lot.carrierAge} {t('Lot.Field.Years')}</h4>
                                : <h4>{t('Lot.Field.Carrier-Infos')}</h4>
                            }
                            {(lot.reproduction === 'ICSI' || lot.reproduction === 'Transfert') &&
                                <h4><strong>{t('Lot.Field.Carrier-Deposit')}</strong> {lot.carrierForSale ? lot.bondCarrier : ''} €</h4>
                            }
                        </div>
                        <div className="col">
                            <h4><strong>{t('Lot.Field.Sexe')}</strong> {t('Lot.' + lot.sexe)}</h4>
                            <h4><strong>{t('Lot.Field.Reproduction-Type')}</strong> {lot.reproduction}</h4>
                            {(lot.reproduction === 'ICSI' || lot.reproduction === 'Transfert') &&
                                <h4><strong>{t('Lot.Field.Carrier-Size')}</strong> {lot.carrierSize} cm</h4>
                            }
                            <h4><strong>{t('Lot.Field.Carrier-For-Sale')}</strong> {lot.carrierForSale ? t('Lot.Field.Yes') : t('Lot.Field.No')}</h4>
                        </div>
                        <div className="col">
                            <h4><strong>{t('Lot.Field.Seller')}</strong> {lot.sellerNationality} ({t('Lot.' + lot.sellerType)})</h4>
                            <h4><strong>{t('Lot.Field.Due-Date')}</strong> {moment(lot.dueDate).format('LL')} </h4>
                            <h4><strong>{t('Lot.Field.TVA')}</strong> {lot.tva} % <p onClick={handleClickOpen} className="calcul-TVA">{t('Lot.Field.Calculs-TVA')}</p></h4>
                        </div>
                    </div>}

                {isFoal(lot) &&
                    <div className="row">
                        <div className="col">
                            <h4><strong>{t('Lot.Field.Type')}</strong> {t('Lot.' + lot.type)}</h4>
                            <h4><strong>{t('Lot.Field.Location')}</strong> {lot.location}</h4>
                            <h4><strong>{t('Lot.Field.Reproduction-Type')}</strong> {lot.reproduction}</h4>
                        </div>
                        <div className="col">
                            <h4><strong>{t('Lot.Field.Sexe')}</strong> {t('Lot.' + lot.sexe)}</h4>
                            <h4><strong>{t('Lot.Field.Seller')}</strong> {lot.sellerNationality} ({t('Lot.' + lot.sellerType)})</h4>
                            <h4><strong>{t('Lot.Field.Race')}</strong> {lot.race}</h4>
                        </div>
                        <div className="col">
                            <h4><strong>{t('Lot.Field.Birthdate')}</strong> {moment(lot.birthDate).format('LL')}</h4>
                            <h4><strong>{t('Lot.Field.TVA')}</strong> {lot.tva} % <p onClick={handleClickOpen} className="calcul-TVA">{t('Lot.Field.Calculs-TVA')}</p></h4>
                        </div>
                    </div>}

                {isBroodmareEmpty(lot) &&
                    <div className="row">
                        <div className="col">
                            <h4><strong>{t('Lot.Field.Type')}</strong> {t('Lot.' + lot.type)}</h4>
                            <h4><strong>{t('Lot.Field.Location')}</strong> {lot.location}</h4>
                            <h4><strong>{t('Lot.Field.Race')}</strong> {lot.race}</h4>
                        </div>
                        <div className="col">
                            <h4><strong>{t('Lot.Field.Birthdate')}</strong> {moment(lot.birthDate).format('LL')}</h4>
                            <h4><strong>{t('Lot.Field.Seller')}</strong> {lot.sellerNationality} ({t('Lot.' + lot.sellerType)})</h4>
                        </div>
                        <div className="col">
                            <h4><strong>{t('Lot.Field.Size')}</strong> {lot.size} cm</h4>
                            <h4><strong>{t('Lot.Field.TVA')}</strong> {lot.tva} % <p onClick={handleClickOpen} className="calcul-TVA">{t('Lot.Field.Calculs-TVA')}</p></h4>
                        </div>
                    </div>}

                {isBroodmareFull(lot) &&
                    <div className="row">
                        <div className="col">
                            <h4><strong>{t('Lot.Field.Type')}</strong> {t('Lot.' + lot.type)}</h4>
                            <h4><strong>{t('Lot.Field.Birthdate')}</strong> {moment(lot.birthDate).format('LL')}</h4>
                            <h4><strong>{t('Lot.Field.Seller')}</strong> {lot.sellerNationality} ({t('Lot.' + lot.sellerType)})</h4>
                            <h4><strong>{t('Lot.Field.Due-Date')}</strong> {moment(lot.dueDate).format('LL')} </h4>
                        </div>
                        <div className="col">
                            <h4><strong>{t('Lot.Field.Sexe')}</strong> {t('Lot.' + lot.sexe)}</h4>
                            <h4><strong>{t('Lot.Field.Location')}</strong> {lot.location}</h4>
                            <h4><strong>{t('Lot.Field.Race')}</strong> {lot.race}</h4>
                            <h4><strong>{t('Lot.Field.Selected-Stallion')}</strong> {lot.fatherFoal}</h4>
                        </div>
                        <div className="col">
                            <h4><strong>{t('Lot.Field.Size')}</strong> {lot.size} cm</h4>

                            <h4><strong>{t('Lot.Field.TVA')}</strong> {lot.tva} % <p onClick={handleClickOpen} className="calcul-TVA">{t('Lot.Field.Calculs-TVA')}</p></h4>
                        </div>
                    </div>}

                {isYearling(lot) &&
                    <div className="row">
                        <div className="col">
                            <h4><strong>{t('Lot.Field.Type')}</strong> {t('Lot.' + lot.type)}</h4>
                            <h4><strong>{t('Lot.Field.Location')}</strong> {lot.location}</h4>
                        </div>
                        <div className="col">
                            <h4><strong>{t('Lot.Field.Birthdate')}</strong> {moment(lot.birthDate).format('LL')}</h4>
                            <h4><strong>{t('Lot.Field.Seller')}</strong> {lot.sellerNationality} ({t('Lot.' + lot.sellerType)})</h4>
                        </div>
                        <div className="col">
                            <h4><strong>{t('Lot.Field.Race')}</strong> {lot.race}</h4>
                            <h4><strong>{t('Lot.Field.TVA')}</strong> {lot.tva} % <p onClick={handleClickOpen} className="calcul-TVA">{t('Lot.Field.Calculs-TVA')}</p></h4>

                        </div>
                    </div>
                }
                <br />

                {!isEmpty(lot.commentFR) && !isEmpty(lot.commentEN) &&
                    <div className="comment">
                        <h4><strong>{t('Lot.Field.Comment')}</strong></h4>
                        <h4>{i18n.language === "en-EN" ? lot.commentEN : lot.commentFR}</h4>
                    </div>
                }

                <br />
                <div className="insurance">
                    <h3>{t('Lot.Insurer1')}</h3>
                    <h3>{t('Lot.Insurer2')}<a href="tel:+33633346654">+33 6 33 34 66 54</a></h3>
                </div>
                <br />
                <TVADialog
                    open={openTVA}
                    onClose={handleClose}
                />
            </div>
        )
    }

    const BlackType = React.memo(() => {
        return (
            <object data={`${process.env.REACT_APP_API_URL}${lot.blackType}`} width="100%" height="1000vh" type="application/pdf" >
                <a href={`${process.env.REACT_APP_API_URL}${lot.blackType}`}>Pedigree Black Type</a>
            </object>
        )
    })

    function VetDocs() {
        return (
            <div>
                <h2>{t('Lot.Vet-Doc')} :</h2>
                <br />
                {!isEmpty(lot.veterinaryDocuments) &&
                    lot.veterinaryDocuments.map((doc) => {
                        return (
                            <div key={doc} className="veterinaryDoc">
                                <a href={`${process.env.REACT_APP_API_URL}${doc}`} target="_blank" rel="noreferrer" className="btn">{doc.split('.pdf')[0].split('Lot_').pop().split('_').slice(1)} <LaunchIcon /></a>
                                <br />
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    return (
        <div className="lot-infos">

            <Tabs
                value={index}
                onChange={handleChange}
                sx={{
                    '& .MuiTabs-indicator': { backgroundColor: 'transparent' },
                    '& .MuiTab-root': { color: "white", border: '3px solid', borderColor: gold, borderRadius: '15px', margin: '1vw' },
                    '& .Mui-selected': { color: "black", backgroundColor: gold },
                }}
                centered
            >
                <Tab label={t('Lot.General-Info')} />
                <Tab label={t('Lot.Black-Type')} />
                <Tab label={t('Lot.Vet-Doc')} />

            </Tabs>
            <hr />
            <br />
            {index === 0 && <Info />}
            {index === 1 && <BlackType />}
            {index === 2 && <VetDocs />}
        </div>
    )
}

function TVADialog(props) {
    const { open, onClose } = props;
    const { t } = useTranslation();

    const handleClose = () => {
        onClose();
    };


    return (
        <Dialog onClose={handleClose} open={open} className="dialog-TVA">
            <div className="dialog-TVA">
                <h2>{t('Lot.Dialog-TVA.Title')}</h2>
                <br />
                <ol>
                    <li>
                        {t('Lot.Dialog-TVA.1')}
                    </li>
                    <li>
                        {t('Lot.Dialog-TVA.2')}
                    </li>
                    <li>
                        {t('Lot.Dialog-TVA.3')}
                    </li>
                    <li>
                        {t('Lot.Dialog-TVA.4')}
                    </li>
                    <li>
                        {t('Lot.Dialog-TVA.5')}
                    </li>
                </ol>
            </div>
        </Dialog>
    );
}
