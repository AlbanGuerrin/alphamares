import React, { useState } from "react";
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { isEmpty } from "../../utils/Utils";
import axios from "axios";

export default function FollowLotHandler(props) {
    const userData = useSelector((state) => state.userReducer);
    const [isFollowedByUser, setIsFollowedByUser] = useState(false);
    const lotId = props.lotId;

    const handleFollow = (event) => {
        event.preventDefault();
        if (isFollowedByUser){
            setIsFollowedByUser(!isFollowedByUser);
            axios.patch(`${process.env.REACT_APP_API_URL}api/user/unfollow/${userData._id}`, {idToUnFollow : lotId})
            .then((res) => console.log(res))
            .catch((err) => console.error(err))
        }
        else{
            setIsFollowedByUser(!isFollowedByUser);
            axios.patch(`${process.env.REACT_APP_API_URL}api/user/follow/${userData._id}`, {idToFollow : lotId})
            .then((res) => console.log(res))
            .catch((err) => console.error(err))
        }
    }

    useEffect(() => {
        if (!isEmpty(userData)) {
            if (!isEmpty(userData.followedLot)) {
                if (userData.followedLot.includes(lotId)) {
                    setIsFollowedByUser(true);
                } else setIsFollowedByUser(false);
            }
        }
    }, [userData, lotId])

    return (
        <div className='follow'>
            <div className="container" onClick={handleFollow}>
                {isFollowedByUser && (<StarRoundedIcon />)}
                {isFollowedByUser === false && <div>
                    <StarBorderRoundedIcon className="border" />
                    <StarRoundedIcon className="full" />
                </div>}
            </div>
        </div>
    )
}