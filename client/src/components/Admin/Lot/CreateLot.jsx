import React, { useState } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import MenuItem from '@mui/material/MenuItem';
import axios from "axios";
import { countries } from "../../Log/inputRessources";
import { isEmbryo } from "../../../utils/Utils";
import Select from '@mui/material/Select';

function CreateLot(props) {
    const [pictures, setPictures] = useState();
    const [pictureMother, setPictureMother] = useState();
    const [pictureFather, setPictureFather] = useState();
    const [veterinaryDocuments, setVeterinaryDocuments] = useState();
    const [blackType, setBlackType] = useState();

    const [lot, setLot] = useState({
        number: props.nbLots + 1,
        title: '',
        titleEN: '',
        name: '',
        type: 'FrozenEmbryo',
        sexe: 'Male',
        race: '',
        location: '',
        price: '',
        tva: '20',
        father: '',
        mother: '',
        GFPaternal: '',
        GMPaternal: '',
        GFMaternal: '',
        GMMaternal: '',
        GGFPF: '',
        GGMPF: '',
        GGFPM: '',
        GGMPM: '',
        GGFMF: '',
        GGMMF: '',
        GGFMM: '',
        GGMMM: '',
        reproduction: 'ICSI',
        sellerNationality: '',
        sellerType: 'Company',
        dueDate: '',
        birthDate: '',
        productionDate: '',
        size: '',
        carrierSize: '',
        carrierAge: '',
        carrierForSale: 'No',
        bondCarrier: '',
        fatherFoal: '',
        auction: '',
        commentFR: '',
        commentEN: '',
        video: '',
    })

    const handleChange = (event) => {
        const { name, value } = event.target;
        setLot({ ...lot, [name]: value });
        // console.log(lot.commentFR);
    };

    const handleAutoCompleteChange = (event) => {
        const name = "sellerNationality";
        const value = event.target.outerText;
        setLot({ ...lot, [name]: value });
    }

    const handlePictures = (e) => {
        setPictures(e.target.files);
    }

    const handlePictureMother = (e) => {
        setPictureMother(e.target.files[0]);
    }

    const handlePictureFather = (e) => {
        setPictureFather(e.target.files[0]);
    }

    const handleVeterinaryDocuments = (e) => {
        setVeterinaryDocuments(e.target.files);
    }

    const handleBlackType = (e) => {
        setBlackType(e.target.files[0]);
    }


    const handleSummit = async () => {
        // Check validity of form
        const form = document.getElementById('form-lot');
        if (!form.checkValidity()) {
            return
        }
        const data = new FormData();
        data.append("number", lot.number);
        data.append("title", lot.title);
        data.append("titleEN", lot.titleEN);
        data.append("name", lot.name);
        data.append("type", lot.type);
        data.append("race", lot.race);
        data.append("sexe", lot.sexe);
        data.append("location", lot.location);
        data.append("price", lot.price);
        data.append("tva", lot.tva);
        data.append('pedigree.gen1.father', lot.father);
        data.append('pedigree.gen1.mother', lot.mother);
        data.append('pedigree.gen2.GFPaternal', lot.GFPaternal);
        data.append('pedigree.gen2.GMPaternal', lot.GMPaternal);
        data.append('pedigree.gen2.GFMaternal', lot.GFMaternal);
        data.append('pedigree.gen2.GMMaternal', lot.GMMaternal);
        data.append('pedigree.gen3.GGFPF', lot.GGFPF);
        data.append('pedigree.gen3.GGMPF', lot.GGMPF);
        data.append('pedigree.gen3.GGFPM', lot.GGFPM);
        data.append('pedigree.gen3.GGMPM', lot.GGMPM);
        data.append('pedigree.gen3.GGFMF', lot.GGFMF);
        data.append('pedigree.gen3.GGMMF', lot.GGMMF);
        data.append('pedigree.gen3.GGFMM', lot.GGFMM);
        data.append('pedigree.gen3.GGMMM', lot.GGMMM);
        data.append("reproduction", lot.reproduction);
        data.append("sellerNationality", lot.sellerNationality);
        data.append("sellerType", lot.sellerType);
        data.append("dueDate", lot.dueDate);
        data.append("birthDate", lot.birthDate);
        data.append("productionDate", lot.productionDate);
        data.append("size", lot.size);
        data.append("carrierSize", lot.carrierSize);
        data.append("carrierAge", lot.carrierAge);
        data.append("bondCarrier", lot.bondCarrier);
        data.append("carrierForSale", lot.carrierForSale);
        data.append("fatherFoal", lot.fatherFoal);
        data.append("candidacyAccepted", true);
        data.append("auction", props.auctionId);
        data.append("video", lot.video);
        data.append("commentFR", lot.commentFR);
        data.append("commentEN", lot.commentEN);
        if (pictures) {
            for (let i = 0; i < pictures.length; i++) {
                data.append('pictures', pictures[i]);
            }
        }
        if (pictureMother) data.append("pictureMother", pictureMother);
        if (pictureFather) data.append("pictureFather", pictureFather);
        if (veterinaryDocuments) {
            for (let i = 0; i < veterinaryDocuments.length; i++) {
                data.append('veterinaryDocuments', veterinaryDocuments[i]);
            }
        }
        if (blackType) data.append("blackType", blackType);
        await axios
            .post(`${process.env.REACT_APP_API_URL}api/lot/register/`, data)
            .then((res) => {
                console.log("Lot created : " + { res });
            })
            .catch((err) => console.log(err.message));
    }

    return (
        <div >
            <form id="form-lot">
                <div style={{ width: '100%' }}> {/* REQUIRED */}
                    <label htmlFor="required" style={{ fontWeight: 'bold' }}>Informations de base (required*) :</label>
                    <div id="required" style={{ border: '1px solid', borderRadius: '10px', borderColor: 'grey', padding: '2%', width: '100%' }}>

                        <div style={{ display: 'flex', gap: '2%' }}>
                            <div style={{ flex: '1' }}>
                                <label htmlFor="number">N° du lot* : </label>
                                <br />
                                <Select
                                    id="number"
                                    name="number"
                                    size="small"
                                    onChange={handleChange}
                                    defaultValue={props.nbLots + 1}
                                    required
                                    trim="true"
                                >
                                    {Array(props.nbLots + 1).fill().map((_, index) => (
                                        <MenuItem value={index + 1}>{index + 1}</MenuItem>
                                    ))}
                                </Select>
                            </div>
                            <div style={{ flex: '4' }}>
                                <label htmlFor="title">Titre du lot* :</label>
                                <br />
                                <TextField type="text" id="title" name="title" size="small" style={{ width: '100%' }} onChange={handleChange} required trim="true" />
                            </div>
                            <div style={{ flex: '4' }}>
                                <label htmlFor="titleEN">Titre du lot en anglais* :</label>
                                <br />
                                <TextField type="text" id="title" name="titleEN" size="small" style={{ width: '100%' }} onChange={handleChange} required trim="true" />
                            </div>
                            <div style={{ flex: '1' }}>
                                <label htmlFor="type">Type* :</label>
                                <br />
                                <TextField select id="type" name="type" size="small" onChange={handleChange} defaultValue="FrozenEmbryo" required >
                                    {[{ label: 'FrozenEmbryo' }, { label: 'ImplantedEmbryo' }, { label: 'Foal' }, { label: 'Yearling' }, { label: 'YoungHorse' }, { label: 'BroodmareFull' }, { label: 'BroodmareEmpty' }, { label: 'Stallion' }].map((option) => (
                                        <MenuItem key={option.label} value={option.label} >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>
                            <div>
                                <label htmlFor="sexe">Sexe* :</label>
                                <br />
                                <TextField select id="sexe" name="sexe" size="small" onChange={handleChange} defaultValue="Male" required >
                                    {[{ label: 'Male' }, { label: 'Female' }, { label: 'Unsexed' }].map((option) => (
                                        <MenuItem key={option.label} value={option.label} >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>
                        </div>

                        <br />
                        <div style={{ display: 'flex', gap: '2%' }}>
                            <div style={{ flex: '2' }}>
                                <label htmlFor="reproduction">Type de reproduction* :</label>
                                <br />
                                <TextField select id="reproduction" name="reproduction" size="small" style={{ width: '100%' }} onChange={handleChange} defaultValue="ICSI" required >
                                    {[{ label: 'ICSI' }, { label: 'Transfer' }, { label: 'Natural' }, { label: 'N/A' }].map((option) => (
                                        <MenuItem key={option.label} value={option.label} >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>
                            <div style={{ flex: '3' }}>
                                <label htmlFor="location">Localisation* :</label>
                                <br />
                                <TextField type="text" id="location" name="location" size="small" sx={{ width: '100%' }} onChange={handleChange} required trim="true" />
                            </div>

                            <div style={{ flex: '3' }}>
                                <label htmlFor="sellerNationality">Nationalité vendeur* :</label>
                                <br />
                                <Autocomplete
                                    id="sellerNationality"
                                    name="sellerNationality"
                                    options={countries}
                                    autoHighlight
                                    onChange={handleAutoCompleteChange}
                                    size="small"
                                    style={{ backgroundColor: 'white', borderRadius: '18px' }}
                                    getOptionLabel={(option) => option.label}
                                    renderOption={(props, option) => (
                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} >
                                            <img
                                                loading="lazy"
                                                width="20"
                                                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                                srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                                                alt=""
                                            />
                                            {option.label}
                                        </Box>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            name="sellerNationality"
                                            //label="Choose a country"
                                            style={{ color: 'white', border: 'none' }}
                                            required
                                            inputProps={{
                                                ...params.inputProps,
                                                autoComplete: 'new-password', // disable autocomplete and autofill
                                            }}
                                        />
                                    )}
                                />
                            </div>
                            <div style={{ flex: '2' }}>
                                <label htmlFor="sellerType">Type vendeur* :</label>
                                <br />
                                <TextField select id="sellerType" name="sellerType" size="small" onChange={handleChange} sx={{ width: '100%' }} defaultValue="Private" required >
                                    {[{ label: 'Private' }, { label: 'Company' }].map((option) => (
                                        <MenuItem key={option.label} value={option.label} >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </div>
                            <div style={{ flex: '2' }}>
                                <label htmlFor="price">Prix* :</label>
                                <br />
                                <TextField type="number" id="price" name="price" size="small" InputProps={{ endAdornment: '€' }} onChange={handleChange} required />
                            </div>
                            <div style={{ flex: '1' }}>
                                <label htmlFor="tva">TVA (%)* :</label>
                                <br />
                                <TextField type="number" id="tva" name="tva" size="small" InputProps={{ endAdornment: '%' }} onChange={handleChange} defaultValue={20} required />
                            </div>
                        </div>

                        <br />

                        <div>
                            <label htmlFor="pedigree">Pedigree* :</label>
                            <br />
                            <div id="pedigree" style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                                    <TextField type="text" name="father" label="Père" size="small" onChange={handleChange} required />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <TextField type="text" name="mother" label="Mère" size="small" onChange={handleChange} required />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                                    <TextField type="text" name="GFPaternal" label="Grand-Père (Père)" size="small" onChange={handleChange} required />
                                    <TextField type="text" name="GMPaternal" label="Grand-Mère (Père)" size="small" onChange={handleChange} required />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <TextField type="text" name="GFMaternal" label="Grand-Père (Mère)" size="small" onChange={handleChange} required />
                                    <TextField type="text" name="GMMaternal" label="Grand-Mère (Mère)" size="small" onChange={handleChange} required />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                                    <TextField type="text" name="GGFPF" label="Arrière GP paternel (Père)" size="small" onChange={handleChange} required />
                                    <TextField type="text" name="GGMPF" label="Arrière GM paternel (Père)" size="small" onChange={handleChange} required />

                                    <TextField type="text" name="GGFMF" label="Arrière GP maternel (Père)" size="small" onChange={handleChange} required />
                                    <TextField type="text" name="GGMMF" label="Arrière GM maternel (Père)" size="small" onChange={handleChange} required />
                                    <br />
                                    <TextField type="text" name="GGFPM" label="Arrière GP paternel (Mère)" size="small" onChange={handleChange} required />
                                    <TextField type="text" name="GGMPM" label="Arrière GM paternel (Mère)" size="small" onChange={handleChange} required />

                                    <TextField type="text" name="GGFMM" label="Arrière GP maternel (Mère)" size="small" onChange={handleChange} required />
                                    <TextField type="text" name="GGMMM" label="Arrière GM maternel (Mère)" size="small" onChange={handleChange} required />
                                </div>

                            </div>
                        </div>


                    </div>
                </div>

                <br />

                {(lot.type !== 'FrozenEmbryo' && lot.type !== 'ImplantedEmbryo') &&
                    <div style={{ width: '100%' }}> {/* LIVING */}
                        <label htmlFor="Living" style={{ fontWeight: 'bold' }}>Informations pour les lots vivants :</label>
                        <div id="Living" style={{ border: '1px solid', borderRadius: '10px', padding: '2%', width: '100%' }}>
                            <div style={{ display: 'flex', gap: '5%' }}>
                                <div >
                                    <label htmlFor="name">Nom :</label>
                                    <br />
                                    <TextField type="text" id="name" name="name" size="small" onChange={handleChange} trim="true" />
                                </div>
                                <br />
                                <div >
                                    <label htmlFor="birthDate">Date de naissance :</label>
                                    <br />
                                    <TextField type="text" id="birthDate" name="birthDate" size="small" onChange={handleChange} trim="true" />
                                </div>
                                <br />
                                <div>
                                    <label htmlFor="race">Race :</label>
                                    <br />
                                    <TextField type="text" id="race" name="race" size="small" onChange={handleChange} trim="true" />
                                </div>
                            </div>
                        </div>
                    </div>
                }

                <br />

                {lot.type === 'ImplantedEmbryo' &&
                    <div style={{ width: '100%' }}> {/* ImplantedEMBRYO */}
                        <label htmlFor="Embryo" style={{ fontWeight: 'bold' }}>Informations pour les embryons implantés :</label>
                        <div id="Embryo" style={{ border: '1px solid', borderRadius: '10px', padding: '2%', width: '100%' }}>
                            <div style={{ display: 'flex', gap: '5%' }}>
                                <div>
                                    <label htmlFor="dueDate">Date de terme :</label>
                                    <br />
                                    <TextField type="date" id="dueDate" name="dueDate" size="small" onChange={handleChange} />
                                </div>
                                <br />
                                <div>
                                    <label htmlFor="bondCarrier">Caution porteuse (HT€) :</label>
                                    <br />
                                    <TextField type="number" id="bondCarrier" name="bondCarrier" size="small" onChange={handleChange} />
                                </div>
                                <br />
                                <div>
                                    <label htmlFor="carrierForSale">Porteuse à vendre :</label>
                                    <br />
                                    <TextField select id="carrierForSale" name="carrierForSale" size="small" onChange={handleChange} defaultValue="No" style={{ width: '100%' }} >
                                        {[{ label: 'Yes' }, { label: 'No' }, { label: 'N/A' }].map((option) => (
                                            <MenuItem key={option.label} value={option.label} >
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </div>
                            </div>
                            <br />
                            {(lot.reproduction === 'ICSI' || lot.reproduction === 'Transfer') && <div>
                                <label htmlFor="ICSIorTransfert" style={{ fontWeight: 'bold' }}>Informations pour les ICSI ou Transfer :</label>
                                <div id="ICSIorTransfert" style={{ border: '1px solid', borderRadius: '10px', padding: '2%', width: '90%' }}>
                                    <div style={{ display: 'flex', gap: '5%' }}>
                                        <div>
                                            <label htmlFor="carrierAge">Age porteuse :</label>
                                            <br />
                                            <TextField type="number" id="carrierAge" name="carrierAge" size="small" onChange={handleChange} />
                                        </div>
                                        <br />
                                        <br />
                                        <div>
                                            <label htmlFor="carrierSize">Taille porteuse (cm) :</label>
                                            <br />
                                            <TextField type="number" id="carrierSize" name="carrierSize" size="small" onChange={handleChange} />
                                        </div>
                                    </div>

                                </div>
                            </div>}
                        </div>
                    </div>
                }

                {lot.type === 'FrozenEmbryo' &&
                    <div style={{ width: '100%' }}> {/* FrozenEMBRYO */}
                        <label htmlFor="Embryo" style={{ fontWeight: 'bold' }}>Informations pour les embryons congelés :</label>
                        <div id="Embryo" style={{ border: '1px solid', borderRadius: '10px', padding: '2%', width: '100%' }}>
                            <div style={{ display: 'flex', gap: '5%' }}>
                                <div>
                                    <label htmlFor="dueDate">Date de poduction :</label>
                                    <br />
                                    <TextField type="date" id="dueDate" name="productionDate" size="small" onChange={handleChange} />
                                </div>
                            </div>

                        </div>
                    </div>
                }

                <br />

                {lot.type === 'BroodmareFull' &&
                    <div style={{ width: '100%' }}> {/* BROODMAREFULL */}
                        <label htmlFor="BroodmareFull" style={{ fontWeight: 'bold' }}>Informations pour les poulinières pleines :</label>
                        <div id="BroodmareFull" style={{ border: '1px solid', borderRadius: '10px', padding: '2%', width: '100%' }}>
                            <div style={{ display: 'flex', gap: '5%' }}>
                                <div>
                                    <label htmlFor="dueDate">Date de terme :</label>
                                    <br />
                                    <TextField type="date" id="dueDate" name="dueDate" size="small" onChange={handleChange} />
                                </div>
                                <br />
                                <div>
                                    <label htmlFor="fatherFoal">Père du poulain :</label>
                                    <br />
                                    <TextField type="text" id="fatherFoal" name="fatherFoal" size="small" onChange={handleChange} />
                                </div>

                            </div>
                        </div>
                    </div>
                }

                <br />

                {(lot.type === 'YoungHorse' || lot.type === 'BroodmareFull' || lot.type === 'BroodmareEmpty' || lot.type === 'Stallion') &&
                    <div style={{ width: '100%' }}> {/* YOUNGHORSE, BROODMAREFULL, BROODMAREEMPTY, STALLION */}
                        <label htmlFor="YOUNGHORSE-BROODMAREFULL-BROODMAREEMPTY-STALLION" style={{ fontWeight: 'bold' }}>Informations pour les chevaux :</label>
                        <div id="YOUNGHORSE-BROODMAREFULL-BROODMAREEMPTY-STALLION" style={{ border: '1px solid', borderRadius: '10px', padding: '2%', width: '100%' }}>
                            <div style={{ display: 'flex', gap: '5%' }}>
                                <div>
                                    <label htmlFor="size">Taille (cm) :</label>
                                    <br />
                                    <TextField type="number" id="size" name="size" size="small" onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                }

                <br />
                <div>
                    <label htmlFor="comment" style={{ fontWeight: 'bold' }}>Commentaire :</label>
                    <div id="comment" style={{ display: 'flex', gap:'5%', border: '1px solid', borderRadius: '10px', padding: '2%', width: '100%' }} >
                        <div style={{flex:'1'}}>
                            <label htmlFor="commentFR">Commentaire FR :</label>
                            <br />
                            <textarea style={{border:'1px lightGrey solid', borderRadius:'4px', width:'100%'}} id="commentFR" name="commentFR" size="small" onChange={handleChange} />
                        </div>
                        <div style={{flex:'1'}}>
                            <label htmlFor="commentEN">Commentaire EN :</label>
                            <br />
                            <textarea style={{border:'1px lightGrey solid', borderRadius:'4px', width:'100%'}} id="commentEN" name="commentEN" size="small" onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <br />

                {/* MEDIA */}
                <div >
                    <label htmlFor='video'>Video du lot (lien YouTube) :</label>
                    <br />
                    <TextField type="texte" id="video" name="video" size="small" onChange={handleChange} />
                    <br />
                </div>

                <div >
                    <label htmlFor='pictures'>Charger des images du lot:</label>
                    <input type="file" id="pictures-upload" name="pictures" accept='.jpg, .jpeg, .png' multiple
                        onChange={(e) => handlePictures(e)}
                    ></input>
                    <br />
                </div>
                {isEmbryo(lot) &&
                    <div>
                        <br />
                        <div >
                            <label htmlFor='pictureMother'>Charger photo de la mère :</label>
                            <input type="file" id="pictureMother-upload" name="pictureMother" accept='.jpg, .jpeg, .png'
                                onChange={(e) => handlePictureMother(e)}
                            ></input>
                            <br />
                        </div>
                        <br />
                        <div >
                            <label htmlFor='pictureFather'>Charger photo du père :</label>
                            <input type="file" id="pictureFather-upload" name="pictureFather" accept='.jpg, .jpeg, .png'
                                onChange={(e) => handlePictureFather(e)}
                            ></input>
                            <br />
                        </div>
                    </div>}
                <br />
                <div >
                    <label htmlFor='veterinaryDocuments'>Charger des documents vétérinaires :</label>
                    <input type="file" id="veterinaryDocuments-upload" name="veterinaryDocuments" accept='.pdf' multiple
                        onChange={(e) => handleVeterinaryDocuments(e)}
                    ></input>
                    <br />
                </div>
                <br />
                <div >
                    <label htmlFor='blackType'>Charger le Black Type :</label>
                    <input type="file" id="blackType-upload" name="blackType" accept='.pdf'
                        onChange={(e) => handleBlackType(e)}
                    ></input>
                    <br />
                </div>
                <br />
                <button type="submit" onClick={handleSummit}>Créer</button>
                <br />
            </form>
            <br />
        </div>
    )
}

export default CreateLot