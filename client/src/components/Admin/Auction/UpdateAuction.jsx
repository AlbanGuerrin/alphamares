import React, { useState } from 'react';
import axios from 'axios';

function CreateAuction(props) {
    const [formData, setFormData] = useState({
        title: props.auction.title,
        titleEN: props.auction.titleEN,
        start: props.auction.start,
        end: props.auction.end,
        description: props.auction.description,
        descriptionEN: props.auction.descriptionEN,
    });

    const [file, setFile] = useState();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData();
        data.append("title", formData.title)
        data.append("titleEN", formData.titleEN)
        data.append("start", formData.start)
        data.append("end", formData.end)
        data.append("description", formData.description)
        data.append("descriptionEN", formData.descriptionEN)
        data.append("commission", formData.commission)
        data.append("picture", file)
        axios.put(`${process.env.REACT_APP_API_URL}api/auction/${props.auction._id}`, data)
        .then((res) => {
                props.onClose()
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    };

    return (
        <div style={{ margin: "5% 1%", padding: "5%" }}>
            <form onSubmit={handleSubmit}>
                <label>
                    Titre :
                    <input type="text" name="title" value={formData.title} onChange={handleChange} 
                        minLength={3}
                        maxLength={30}
                        style={{border: "1px solid"}}
                    />
                </label>
                <br />
                <label>
                    Titre en anglais :
                    <input type="text" name="titleEN" value={formData.titleEN} onChange={handleChange} 
                        minLength={3}
                        maxLength={30}
                        style={{border: "1px solid"}}
                    />
                </label>
                <br />
                <label>
                    Début :
                    <input
                        type="datetime-local"
                        name="start"
                        value={formData.start}
                        onChange={handleChange}
                        style={{border: "1px solid"}}
                    />
                </label>
                <br />
                <label>
                    Fin :
                    <input
                        type="datetime-local"
                        name="end"
                        value={formData.end}
                        onChange={handleChange}
                        style={{border: "1px solid"}}
                    />
                </label>
                <br />
                <label>
                    Description:
                    <textarea type="text" name="description" value={formData.description} onChange={handleChange}
                        minLength={3}
                        maxLength={300}
                        style={{border: "1px solid"}}
                    />
                </label>
                <br />
                <label>
                    Description en anglais :
                    <textarea type="text" name="descriptionEN" value={formData.descriptionEN} onChange={handleChange}
                        minLength={3}
                        maxLength={300}
                        style={{border: "1px solid"}}
                    />
                </label>
                <label htmlFor='file'>Charger une image</label>
                <input type="file" id='file' name='file' accept='.jpg, .jpeg, .png' onChange={(e) => setFile(e.target.files[0])}/>
                <br />
                <button type="submit">Éditer la vente</button>
            </form>
        </div>
    );
}

export default CreateAuction;