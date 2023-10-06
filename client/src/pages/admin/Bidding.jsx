import axios from 'axios';
import React, { useEffect, useState } from 'react'
import BidCard from '../../components/Bid/BidCard';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import moment from 'moment';
import { isEmpty } from '../../utils/Utils';

export default function Bidding() {
    const [auctions, setAuctions] = useState();

    let prevAuction;

    function getAuctions() {
        axios.get(`${process.env.REACT_APP_API_URL}api/auction/`)
            .then((res) => {
                if (res.data && JSON.stringify(prevAuction) !== JSON.stringify(res.data)) {
                    setAuctions(res.data)
                    prevAuction = res.data;
                }
            })
            .catch((err) => console.log(err))
    };

    useEffect(() => {
        getAuctions();
        const interval = setInterval(() => getAuctions(), 5000)
        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <br />
            <div style={{ textAlign: 'center' }}>
                <h1>Historique des enchérissements.</h1>
            </div>
            <br />
            <div style={{ rowGap: '10px', display: 'flex', flexDirection: 'column', width: "70%" }}>
                {!isEmpty(auctions) &&
                    <AuctionsAccordion auctions={auctions} />
                }
            </div>
            <br />
        </div>
    );
};

function AuctionsAccordion({ auctions }) {
    const [expanded, setExpanded] = useState(false);
    const [lotExpanded, setLotExpanded] = useState(false);
    const [catalogue, setCatalogue] = useState();

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
        getLots(panel);
    };

    const deployLot = (panel) => (event, isExpanded) => {
        setLotExpanded(isExpanded ? panel : false);
    };

    function getLots(auctionId) {
        axios.get(`${process.env.REACT_APP_API_URL}api/auction/lots/${auctionId}`)
            .then((res) => setCatalogue(res.data))
            .catch((err) => console.log(err));
    }

    return (
        <div>
            {auctions.slice().reverse().map((auction) => (
                <Accordion expanded={expanded === auction._id} onChange={handleChange(auction._id)} key={auction._id}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                        sx={{ display: 'flex', gap: '10px' }}
                    >
                        <Typography sx={{ color: 'black', flex: '2' }}>{auction.title}</Typography>
                        <Typography sx={{ color: 'text.secondary', flex: '1' }}>Date : {moment(auction.start).format('LLL')}</Typography>
                        <Typography sx={{ color: 'text.secondary', flex: '1' }}>{auction.catalogue.length} lots</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {!isEmpty(catalogue) &&
                            catalogue.slice().map((lot) => (
                                <Accordion expanded={lotExpanded === lot._id} onChange={deployLot(lot._id)}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1bh-content"
                                        id="panel1bh-header"
                                        sx={{ display: 'flex' }}
                                    >
                                        <Typography sx={{ color: 'black', flex: '3' }}>Lot {lot.number} - {lot.title}</Typography>
                                        <Typography sx={{ color: 'text.secondary', flex: '1' }}>{lot.type}</Typography>
                                        <Typography sx={{ color: 'text.secondary', flex: '1' }}>{lot.bids.length} enchérissements</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {lot.bids.slice().reverse().map((bid) => (
                                            <BidCard bid={bid} />
                                        ))}
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                    </AccordionDetails>
                </Accordion>
            ))}
        </div>
    )
}