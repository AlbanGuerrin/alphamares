import React, {useEffect, useState} from 'react'
import { isEmpty } from '../utils/Utils';
import PostCard from '../components/Post/PostCard';
import { useTranslation } from 'react-i18next';
import axios from 'axios';


const Media = () => {
    const [posts, setPosts] = useState([]);
    const [t] = useTranslation();

    function getPosts() {
        axios.get(`${process.env.REACT_APP_API_URL}api/post/`)
            .then((res) => setPosts(res.data))
            .catch((err) => console.log(err));
    }

    useEffect(() => {
        getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className='page'>
            <div className='title-page'>
                <h1 >{t("Media.Title")}</h1>
            </div>
            {!isEmpty(posts[0]) &&
                posts.map((post) => {
                    return <PostCard post={post} key={post._id} />
                })
            }
            <br />
        </div>
    );
};

export default Media;