import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import DOMPurify from "dompurify";
import { isEmpty } from "../../utils/Utils";

export default function Post() {
    const [post, setPost] = useState();
    let params = useParams();

    const {i18n} = useTranslation();

    function getPost() {
        axios
            .get(`${process.env.REACT_APP_API_URL}api/post/${params.id}`)
            .then((res) => setPost(res.data))
            .catch((err) => console.log(err));
    }


    useEffect(() => {
        getPost()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            {!isEmpty(post) &&
                <div className="post">
                    {post.picture !== "" ?
                        <div className="img-container">
                            <img src={`${process.env.REACT_APP_API_URL}${post.picture}`} alt="Post" />
                            <h1 className="post-title">{i18n.language === "en-EN" ? post.titleEN : post.titleFR}</h1>
                        </div>
                        : <iframe
                            title="video"
                            src={post.video}>
                        </iframe>
                    }
                    <div className="post-text quill-text" dangerouslySetInnerHTML={{ __html: i18n.language === "en-EN" ? DOMPurify.sanitize(post.messageEN) : DOMPurify.sanitize(post.messageFR) }} />
                </div>}
        </>
    )
}