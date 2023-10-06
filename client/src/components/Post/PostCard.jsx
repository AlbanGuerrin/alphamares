import React, { useState } from "react";
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { NavLink } from 'react-router-dom'
import { useTranslation } from "react-i18next";
// import DOMPurify from "dompurify";
import moment from "moment/moment";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import ConfirmDialog from "./../Admin/ConfirmDialog";
import axios from "axios";
import { CardActions } from "@mui/material";

export default function PostCard({ post, inAdmin, fetchPosts }) {
    const [t, i18n] = useTranslation();
    const [openConfirmDeletePost, setOpenConfirmDeletePost] = useState(false);

    async function deletePost() {

        setOpenConfirmDeletePost(false);
        await axios.delete(`${process.env.REACT_APP_API_URL}api/post/${post._id}`)
            .then(() => {
                fetchPosts();
                alert("Post supprimé")
            })
            .catch((err) => alert(err));
    }

    function handleDeletePost(event) {
        event.preventDefault();
        setOpenConfirmDeletePost(true);
    }

    return (
        <div className="postCard">
            <NavLink to={`/media/${post._id}`}>
                <Card >
                    <CardMedia
                        component={post.picture !== "" ? "img" : "iframe"}
                        alt="Picture of post"
                        image={post.picture !== "" ? `${process.env.REACT_APP_API_URL}${post.picture}` : post.video}
                    />
                    <CardContent >
                        <h1>
                            {i18n.language === "en-EN" ? post.titleEN : post.titleFR}
                        </h1>
                        <br />
                        <h2 className="date">{`${t("Media.PublishedOn")} ${moment(post.createdAt).format("L")}`}</h2>
                    </CardContent>
                    <CardActions sx={{ marginLeft: 'auto' }}>
                        {inAdmin &&
                            <IconButton sx={{ marginTop: 'auto' }} aria-label="delete" onClick={handleDeletePost}><DeleteIcon /></IconButton>
                        }
                    </CardActions>
                </Card>
            </NavLink>
            <ConfirmDialog message="supprimer ce post" yesFunction={deletePost} open={openConfirmDeletePost} onClose={() => setOpenConfirmDeletePost(false)} />
        </div>
    )
}