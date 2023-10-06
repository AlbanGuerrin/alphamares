import { Button } from '@mui/material';
import React, { useState } from 'react'
import axios from 'axios';


const Legals = () => {
    const [file, setFile] = useState();

    const uploadCGU = async () => {
        if (file) {
            const data = new FormData();
            data.append("file", file);

            await axios
                .post(`${process.env.REACT_APP_API_URL}api/utils/upload/cgu`, data)
                .then((res) => {
                    console.log('Success :' + res.data);
                })
                .catch((err) => console.log(err));
        } else{
            console.log('No file');
        }
    }

    const uploadPolitiqueConf = async () => {
        if (file) {
            const data = new FormData();
            data.append("file", file);

            await axios
                .post(`${process.env.REACT_APP_API_URL}api/utils/upload/politiqueconf`, data)
                .then((res) => {
                    console.log('Success :' + res.data);
                })
                .catch((err) => console.log(err));
        }else{
            console.log('No file');
        }
    }

    const uploadCopyright = async () => {
        if (file) {
            const data = new FormData();
            data.append("file", file);

            await axios
                .post(`${process.env.REACT_APP_API_URL}api/utils/upload/copyright`, data)
                .then((res) => {
                    console.log('Success :' + res.data);
                })
                .catch((err) => console.log(err));
        }else{
            console.log('No file');
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <br />
            <div style={{ textAlign: 'center' }}>
                <h1>Édition des documents légaux.</h1>
            </div>
            <br />
            <br />
            <h3>Condition générale d'utilisation :</h3>
            <label htmlFor='cgu'>Charger un document (pdf) :</label>
            <input type="file" id="cgu" name="cgu" accept='.pdf' style={{ maxWidth: "30%", color: "black" }} onChange={(e) => setFile(e.target.files[0])} />
            <br />
            <Button variant="contained" onClick={uploadCGU}>Enregistrer</Button>
            <br />
            <hr style={{ width: "40%", textAlign: "center", height: "3px", border: "0", backgroundColor: "white", background: "linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0))" }} />
            <br />
            <h3>Politique de confidentialité :</h3>
            <label htmlFor='politiqueConf'>Charger un document (pdf) :</label>
            <input type="file" id="politiqueConf" name="politiqueConf" accept='.pdf' style={{ maxWidth: "30%", color: "black" }} onChange={(e) => setFile(e.target.files[0])} />
            <br />
            <Button variant="contained" onClick={uploadPolitiqueConf}>Enregistrer</Button>
            <br />
            <hr style={{ width: "40%", textAlign: "center", height: "3px", border: "0", backgroundColor: "white", background: "linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0))" }} />
            <br />
            <h3>Copyright :</h3>
            <label htmlFor='copyright'>Charger un document (pdf) :</label>
            <input type="file" id="copyright" name="copyright" accept='.pdf' style={{ maxWidth: "30%", color: "black" }} onChange={(e) => setFile(e.target.files[0])} />
            <br />
            <Button variant="contained" onClick={uploadCopyright}>Enregistrer</Button>
            <br />
            <br />
        </div>
    );
};

export default Legals;