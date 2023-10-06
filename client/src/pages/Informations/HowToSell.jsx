import React, { useContext, useState } from "react";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { NavLink } from "react-router-dom";
import { UidContext } from "../../components/AppContext";
import { isEmpty } from "../../utils/Utils";
import { Card, InputAdornment, MenuItem, OutlinedInput, TextField } from "@mui/material";
import moment from "moment";
import { DatePicker } from "@mui/x-date-pickers";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function HowtoSell() {
    const {uid} = useContext(UidContext);
    const [step, setStep] = useState(2);
    const [t] = useTranslation();

    const [lot, setLot] = useState({
        type: 'Embryon gelé',
        father: '',
        mother: '',
        localisation: '',
        price: '',
    })
    const [birthDate, setBirthDate] = useState();
    const [pictures, setPictures] = useState();
    const [video, setVideo] = useState();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setLot({ ...lot, [name]: value });
    };


    const handlePicture = (event) => {
        const sizeError = document.querySelector('.size.error');
        var size = 0;
        console.log(event.target.files);
        for (const file of event.target.files) {
            size += file.size;
        };
        if (size < 10000000) {
            setPictures(event.target.files)
        } else {
            sizeError.innerHTML = "Fichiers trop lourds (max 10Mo)";
        }
    };

    const handleSummit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('userId', uid);
        formData.append('type', lot.type);
        formData.append('father', lot.father);
        formData.append('mother', lot.mother);
        formData.append('birthDate', birthDate);
        formData.append('localisation', lot.localisation);
        formData.append('price', lot.price);
        if (video) formData.append('video', video);
        if (pictures) {
            for (let i = 0; i < pictures.length; i++) {
                formData.append('pictures', pictures[i]);
            }
        }
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}api/proposal/send/`, formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            alert(t('How-Sell.Alert-succes'));
        } catch (error) {
            console.error(error);
            alert(t('How-Sell.Alert-failed'));
        }
    };

    return (
        <div className="page">
            <div className="title-page">
                <h1>{t('How-Sell.How-Sell')}</h1>
                <br />
                <h3>{t('How-Sell.3-steps')}</h3>
            </div>
            <div className="how-to-sell">
                <div className="container">
                    <hr />
                    <div className="row">
                        <div className="col">
                            <div className="circle">
                                <p>1</p>
                            </div>
                            <br />
                            <h3 className="title">{t('How-Sell.Step')} 1</h3>
                            <p className="text"><NavLink to='/profil' state={"sign-up"}>{t('How-Sell.Create-Account')}</NavLink> <br /> {t('How-Sell.Or')} <NavLink to='/profil' state={"sign-in"}>{t('How-Sell.Log-In')}</NavLink></p>
                        </div>
                        <div className="col">
                            <div className="circle">
                                <p>2</p>
                            </div>
                            <br />
                            <h3 className="title">{t('How-Sell.Step')} 2</h3>
                            <p className="text">{t('How-Sell.Enter-Infos')}</p>
                        </div>
                        <div className="col">
                            <div className="circle">
                                <p>3</p>
                            </div>
                            <br />
                            <h3 className="title">{t('How-Sell.Step')} 3</h3>
                            <p className="text">{t('How-Sell.Upload-Docs')}</p>
                        </div>
                    </div>
                </div>
                <br />

                {!isEmpty(uid) && step === 2 &&
                    <div className="form">
                        <Card>
                            <form>
                                <h1>{t('How-Sell.Step')} 2</h1>
                                <br />
                                <div className="field">
                                    <h2>{t('How-Sell.Type')} : </h2>
                                    <TextField select id="type" name="type" size="small" onChange={handleChange} sx={{ width: '50%' }} defaultValue="FrozenEmbryo" required >
                                        {[{ label: 'FrozenEmbryo' }, { label: 'ImplantedEmbryo' }, { label: 'Foal' }, { label: 'Yearling' }, { label: 'YoungHorse' }, { label: 'BroodmareFull' }, { label: 'BroodmareEmpty' }, { label: 'Stallion' }].map((option) => (
                                            <MenuItem key={option.label} value={option.label} >
                                                {t('Lot.' +option.label)}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </div>
                                <br />
                                <div className="field">
                                    <h2>{t('How-Sell.Father')} : </h2>
                                    <TextField id="father" name="father" size="small" onChange={handleChange} sx={{ width: '50%' }} required />
                                </div>
                                <br />
                                <div className="field">
                                    <h2>{t('How-Sell.Mother')} : </h2>
                                    <TextField id="mother" name="mother" size="small" onChange={handleChange} sx={{ width: '50%' }} required />
                                </div>
                                <br />
                                <div className="field">
                                    <h2>{t('How-Sell.Birthdate')} : </h2>
                                    <DatePicker id="birthDate" name="birthDate" size="small" onChange={(date) => setBirthDate(moment(date).format("LL"))} sx={{ width: '50%' }} required />
                                </div>
                                <br />
                                <div className="field">
                                    <h2>{t('How-Sell.Location')} : </h2>
                                    <TextField id="localisation" name="localisation" size="small" onChange={handleChange} sx={{ width: '50%' }} required />
                                </div>
                                <br />
                                <div className="field">
                                    <h2>{t('How-Sell.Price')} : </h2>
                                    <OutlinedInput type="number" id="price" name="price" size="small" onChange={handleChange} sx={{ width: '50%' }} required endAdornment={<InputAdornment position="end" sx={{ margin: "0 5%" }}>€</InputAdornment>} />
                                </div>
                                <br />
                                <button type="submit" onClick={() => setStep(3)}>{t('How-Sell.Next')}</button>
                            </form>
                        </Card>
                    </div>
                }

                {!isEmpty(uid) && step === 3 &&
                    <div className="form">
                        <Card>
                            <form>
                                <h1>{t('How-Sell.Step')} 3</h1>
                                <br />
                                <div className="recap">
                                    <h3>{t('How-Sell.Summary')} :</h3>
                                    <br />
                                    <h4><strong>{t('How-Sell.Type')} :</strong> {lot.type}</h4>
                                    <h4><strong>{t('How-Sell.Father')} :</strong> {lot.father}</h4>
                                    <h4><strong>{t('How-Sell.Mother')} :</strong> {lot.mother}</h4>
                                    <h4><strong>{t('How-Sell.Birthdate')} :</strong> {birthDate === undefined ? <p></p> : birthDate}</h4>
                                    <h4><strong>{t('How-Sell.Location')} :</strong> {lot.localisation}</h4>
                                    <h4><strong>{t('How-Sell.Price')} :</strong> {lot.price}</h4>
                                </div>
                                <br />
                                <button className='modif' onClick={() => setStep(2)}>{t('How-Sell.Modify')}</button>
                                <br />
                                <div className="field">
                                    <h2>{t('How-Sell.Images')} : </h2>
                                    <input type="file" id="pictures-upload" name="pictures" accept='.jpg, .jpeg, .png, .pdf' multiple style={{ width: '50%' }}
                                        onChange={(e) => handlePicture(e)}
                                    ></input>
                                    <div className='size error'></div>
                                </div>
                                <br />
                                <div className="field">
                                    <h2>{t('How-Sell.Video-Link')} : </h2>
                                    <TextField id="video" name="video" size="small" onChange={(event) => setVideo(event.target.value)} sx={{ width: '50%' }} />
                                </div>
                                <br />
                                <button type="submit" onClick={handleSummit}>{t('How-Sell.Send')}</button>
                            </form>
                        </Card>
                    </div>
                }

                <div className="infos">
                    <h2>{t('How-Sell.Trust-us')}</h2>
                    <br />
                    <h3>{t('How-Sell.Trust-us1')}</h3>
                    <br />
                    <NavLink to='/contact'>
                        <h3 className="btn">{t('How-Sell.Trust-us2')}<ArrowForwardIcon style={{ verticalAlign: 'middle' }}></ArrowForwardIcon></h3>
                    </NavLink>
                </div>
            </div>
        </div>
    )
}