import React from "react";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import moment from "moment";
import axios from "axios";
import { NavLink } from 'react-router-dom'
import ConfirmDialog from "../ConfirmDialog";


function AuctionCardConfig(props) {
    const auction = props.auction;
    const [open, setOpen] = React.useState(false);
    var now = moment();

    async function deleteAuction() {
        await axios.delete(`${process.env.REACT_APP_API_URL}api/auction/${auction._id}`)
            .then(res => alert(`${auction.title} : supprimée`))
            .catch(err => console.log(err));
        setOpen(false);
    }

    return (
        <>
            <Card className="card">
                <CardMedia
                    component="img"
                    alt="Auction picture"
                    image={`${process.env.REACT_APP_API_URL}${props.auction.picture}`}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {props.auction.title}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                        {(moment(props.auction.start).isBefore(now) && moment(props.auction.end).isAfter(now)) && "EN COURS"}
                        {(moment(props.auction.start).isAfter(now)) && "A VENIR"}
                        {(moment(props.auction.end).isBefore(now)) && "FINIT"}
                    </Typography>
                    <Typography gutterBottom variant="h7" component="div">
                        {moment(props.auction.start).calendar()}
                    </Typography>
                    <Typography gutterBottom variant="h7" component="div">
                        {moment(props.auction.end).calendar()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {props.auction.description}
                    </Typography>
                </CardContent>
                <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" >
                        <NavLink to={`/admin/auction/${props.auction._id}`} sx={{ color: 'white' }}> Configuration </NavLink>
                    </Button>
                    <IconButton aria-label="delete" onClick={() => setOpen(true)}><DeleteIcon /></IconButton>
                </CardActions>
            </Card>
            <ConfirmDialog message="supprimer la vente" open={open} yesFunction={deleteAuction} onClose={() => setOpen(false)}/>
        </>
    )
}

export default AuctionCardConfig;