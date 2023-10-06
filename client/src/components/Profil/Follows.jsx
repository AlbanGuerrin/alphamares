import React, { useEffect } from "react";
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { useSelector } from 'react-redux';
import LotCard from "../Lot/LotCard";
import { useTranslation } from "react-i18next";
import { isEmpty } from "../../utils/Utils";
import axios from "axios";

export default function Follow() {
    const userData = useSelector((state) => state.userReducer)
    const [t] = useTranslation();
    const [lots, setLots] = React.useState([]);

    function getLots() {
        axios.get(`${process.env.REACT_APP_API_URL}api/user/followedLots/${userData._id}`)
            .then((res) => {
                    if (res.data !== "No followed lot") setLots(res.data)
                }
            )
            .catch((err) => console.log(err));
    }

    useEffect(() => {
        getLots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <br />
            <div style={{ textAlign: 'center' }}>
                <StarRoundedIcon />
                <h1>{t('Followed.Followed-Lot')} : {userData.followedLot.length}</h1>
            </div>
            <br />
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                {!isEmpty(lots) &&
                    lots.slice().reverse().map((lot) => (
                        <LotCard key={lot} lot={lot} public={true} />
                    ))}
            </div>
        </div>
    )

}