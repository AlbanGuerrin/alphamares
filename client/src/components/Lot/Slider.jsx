import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { isEmpty } from "../../utils/Utils";

export default function Slider(props) {
    const [pictures, setPictures] = useState([]);
    const lot = props.lot;

    useEffect(() => {
        if (!isEmpty(lot.pictureMother)) setPictures(prev => [...prev, lot.pictureMother]);
        if (!isEmpty(lot.pictureFather)) setPictures(prev => [...prev, lot.pictureFather]);
        if (!isEmpty(lot.pictures[0])) {
            lot.pictures.forEach(function (picture) {
                setPictures(prev => [...prev, picture]);
            })
        }
        if (!isEmpty(lot.video)) {
            setPictures(prev => [...prev, lot.video]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Carousel
            // autoPlay
            interval={10000}
            infiniteLoop
            showStatus={false}
            showThumbs={true}
        >
            {!isEmpty(pictures) &&
                pictures.map((picture) => {
                    return picture.includes('http') ?
                        <iframe title="Video" src={`http://www.youtube.com/embed/${picture.split('/').pop()}`}></iframe>
                        :
                        <img key={picture} src={`${process.env.REACT_APP_API_URL}${picture}`} alt="Lot" />
                })
            }
        </Carousel>
    )
}