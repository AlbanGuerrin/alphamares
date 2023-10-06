import { TableRow, TableCell } from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useState, useEffect } from "react";


export default function BidCard(props) {
    const bid = props.bid;
    const [user, setUser] = useState();

    function getUser() {
        axios.get(`${process.env.REACT_APP_API_URL}api/user/${bid.bidderId}`)
            .then((res) => setUser(res.data))
            .catch((err) => console.log(err));
    }

    useEffect(() => {
        getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div style={{ width: '100%' }}>
            {user !== undefined &&
                <TableRow sx={{ width: "100%", display: 'flex' }}>
                    <TableCell sx={{ flex: '2' }} align="left"><strong>{user.name} {user.surname}</strong> - ({user.type}) </TableCell>
                    <TableCell sx={{ flex: '2' }} align="left"> {user.email}</TableCell>
                    <TableCell sx={{ flex: '1' }} align="left"> {user.phoneNumber}</TableCell>
                    <TableCell sx={{ flex: '1' }} align="right"><strong>{bid.amount} €</strong></TableCell>
                    <TableCell sx={{ flex: '1' }} align="right">{moment(bid.createdAt).format('LLL')} </TableCell>
                </TableRow>
            }
        </div>
    )
}