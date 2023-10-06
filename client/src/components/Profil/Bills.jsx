import React, { useContext, useEffect, useState } from "react";
import ReceiptRoundedIcon from '@mui/icons-material/ReceiptRounded';
import { UidContext } from "../AppContext";
import axios from "axios";
import { isEmpty } from "../../utils/Utils";
import { useTranslation } from "react-i18next";
import moment from "moment";

export default function Bills() {
    const {uid} = useContext(UidContext);;
    const [sales, setSales] = useState();
    const [t] = useTranslation();

    function getSales() {
        axios.get(`${process.env.REACT_APP_API_URL}api/user/sales/${uid}`)
            .then((res) => {
                const sales = res.data;
                setSales(sales);
            })
            .catch((err) => console.log(err));
    }

    function comparerParDate(sale1, sale2) {
        return moment(sale2.createdAt) - moment(sale1.createdAt);
      }

    useEffect(() => {
        getSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div>
            <br />
            <div style={{ textAlign: 'center' }}>
                <ReceiptRoundedIcon />
                <h1>{t('Bill.Bills')} : </h1>
            </div>
            <br />
            {!isEmpty(sales) &&
                <div className="bills">
                    {
                        sales.slice().sort(comparerParDate).map((sale, index) => {
                            return (
                                <a href={`${process.env.REACT_APP_API_URL}${sale.bill}`} target="_blank" rel="noreferrer" className="btn">
                                    {t('Bill.Bill')} {index + 1} :  {sale.lot.lastBid.auctionInfos} - {sale.lot.lastBid.lotInfos}
                                    <div>{moment(sale.updatedAt).format('L')}</div>
                                </a>
                            )
                        })

                    }
                </div>
            }
        </div>
    )

}