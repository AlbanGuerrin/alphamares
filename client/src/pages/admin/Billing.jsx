import React, { useEffect, useState } from "react";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { BillingFileFR } from "../../components/Admin/BillingFile";
import axios from "axios";
import { isEmpty } from "../../utils/Utils";
import { Button, Dialog, DialogActions } from "@mui/material";
import { useTranslation } from "react-i18next";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import moment from "moment";
import BillingFileEN from "../../components/Admin/BillingFile";

export default function Billing() {
    const [auctions, setAuctions] = useState([]);
    const [t] = useTranslation();
    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    let prevAuctions;

    function getAuctionsWithSales() {
        axios.get(`${process.env.REACT_APP_API_URL}api/auction/auctionsWithSales/`)
            .then((res) => {
                if (JSON.stringify(prevAuctions) !== JSON.stringify(res.data)) {
                    setAuctions(res.data)
                    prevAuctions = res.data;
                }
            })
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        getAuctionsWithSales(auctions);
        const interval = setInterval(() => getAuctionsWithSales(auctions), 10000)
        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <br />
            <div style={{ textAlign: 'center' }}>
                <h1>Facturation</h1>
            </div>
            <br />
            {!isEmpty(auctions) &&
                <div style={{ textAlign: 'center', width: "85%" }}>
                    {auctions.slice().reverse().map((auctionWithSales) => {
                        return (
                            <div key={auctionWithSales.auction._id}>
                                <Accordion expanded={expanded === auctionWithSales.auction._id} onChange={handleChange(auctionWithSales.auction._id)}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1bh-content"
                                        id="panel1bh-header"
                                        sx={{ display: 'flex', gap: '10px' }}
                                    >
                                        <Typography sx={{ color: 'black', flex: '3', fontWeight: 'bold' }}>{auctionWithSales.auction.title}</Typography>
                                        <Typography sx={{ color: 'text.secondary', flex: '1' }}>{moment(auctionWithSales.auction.start).format('LL')}</Typography>
                                        <Typography sx={{ color: 'text.secondary', flex: '1' }}>{auctionWithSales.auction.sales !== undefined ? auctionWithSales.auction.sales.length : ''} ventes</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {auctionWithSales.sales.slice().map((sale) => {
                                            return (<SaleRow sale={sale} auction={auctionWithSales.auction} t={t} key={sale.sale._id} fetch={getAuctionsWithSales} />)
                                        })}
                                    </AccordionDetails>
                                </Accordion>
                                <br />
                            </div>
                        )
                    })}
                </div>}
        </div>
    )
}

const SaleRow = (props) => {
    const { sale, auction, t, fetch } = props;

    const [sending, setSending] = useState(false);
    const [openSend, setOpenSend] = useState(false);
    const [openInsert, setOpenInsert] = useState(false);

    return (
        <div key={sale.sale._id} style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between", whiteSpace: 'nowrap', margin: '2%' }}>
            <div style={{ textAlign: 'start', marginRight: "2vw", overflow: 'clip' }}>
                <Typography sx={{ color: 'black' }}><strong>Lot {sale.sale.lot.number} :</strong> {sale.sale.lot.title} ({t('Lot.' + sale.sale.lot.type)})</Typography>
                <Typography sx={{ color: 'black' }}><strong>Enchérisseur :</strong> {sale.user.name}  {sale.user.surname} ({sale.user.email} - {sale.user.phoneNumber})</Typography>
            </div>
            {!sale.sale.isBillSent ?
                <PDFDownloadLink document={sale.user.language === "English" ? <BillingFileEN sale={sale.sale} user={sale.user} auction={auction} /> : <BillingFileFR sale={sale.sale} user={sale.user} auction={auction} />} fileName={"Sale" + sale.sale._id + ".pdf"}>
                    {({ blob, url, loading, error }) => (
                        loading ?
                            <h1>Génération...</h1>
                            : <div style={{ display: 'flex', gap: '2%' }}>
                                <Button variant="contained" onClick={(e) => { e.preventDefault(); window.open(url, '_blank') }}>Facture automatique</Button>
                                <Button variant="contained" onClick={(e) => { e.preventDefault(); setOpenSend(true) }} sx={{ backgroundColor: "orange" }} disabled={sending}>Envoyer</Button>
                                <Button variant="contained" onClick={(e) => { e.preventDefault(); setOpenInsert(true) }} sx={{ backgroundColor: "orange" }} disabled={sending}>Insérer</Button>
                                <InputBillDialog open={openSend} message="envoyer facture automatique" insertType={false} sale={sale.sale} auction={auction} setSending={setSending} blob={blob} onClose={() => setOpenSend(false)} fetch={fetch} />
                                <InputBillDialog open={openInsert} message="envoyer une facture locale" insertType={true} sale={sale.sale} auction={auction} setSending={setSending} blob={blob} onClose={() => setOpenInsert(false)} fetch={fetch} />
                            </div>
                    )}
                </PDFDownloadLink>
                :
                <div>
                    <a href={`${process.env.REACT_APP_API_URL}${sale.sale.bill}`} target="_blank" rel="noreferrer" style={{ color: 'black', fontWeight: 'bold', textDecoration: 'underline', marginInline: '20px' }}>Facture</a>
                    <Button variant="contained" onClick={() => setOpenInsert(true)} sx={{ marginLeft: "5%" }} disabled={sending}>Insérer</Button>
                    <InputBillDialog open={openInsert} message="remplacer la facture actuelle" insertType={true} sale={sale.sale} auction={auction} setSending={setSending} blob={""} onClose={() => setOpenInsert(false)} fetch={fetch} />
                </div>
            }
        </div>
    )
}

const InputBillDialog = (props) => {

    const { open, insertType, message, sale, auction, setSending, blob, onClose, fetch } = props

    const [file, setFile] = useState(null);

    async function sendLocaleBill() {
        onClose();
        if (file) {
            const formData = new FormData();
            formData.append('saleId', sale._id);
            formData.append('userId', sale.userId);
            formData.append('auctionId', auction._id);
            formData.append('bill', file, sale._id + '.pdf');
            setSending(true);

            await axios.post(`${process.env.REACT_APP_API_URL}api/user/modifyBill/`, formData)
                .then(() => fetch())
                .catch((error) => console.error(error));
            setSending(false)
        }
    }

    async function sendGeneratedBill() {
        onClose();
        const formData = new FormData();
        formData.append('saleId', sale._id);
        formData.append('userId', sale.userId);
        formData.append('auctionId', auction._id);
        formData.append('bill', blob, sale._id + '.pdf');
        setSending(true);

        await axios.post(`${process.env.REACT_APP_API_URL}api/user/sendBill/`, formData)
            .then(() => fetch())
            .catch((error) => console.error(error));
        setSending(false)
    }

    function handleClose() {
        onClose();
        setFile(null);
    }

    return (
        <CommonDialog open={open} message={message} insertType={insertType} yesFunction={insertType ? sendLocaleBill : sendGeneratedBill} file={file} setFile={setFile} onClose={handleClose} />
    )
}

const CommonDialog = (props) => {
    const { open, message, insertType, yesFunction, file, setFile, onClose } = props;
    return (
        <Dialog onClose={onClose} open={open} className="confirm-dialog">
            <p className="message">Êtes-vous sûr de vouloir</p>
            <p className="message">{message} ?</p>
            {insertType &&
                <>
                    <br />
                    <input className="input-bill" type="file" name="localBill" id="localBill" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
                </>
            }
            <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                <button onClick={yesFunction} disabled={insertType ? !file : false}>Oui</button>
                <button onClick={onClose}>Non</button>
            </DialogActions>
        </Dialog>
    )
}