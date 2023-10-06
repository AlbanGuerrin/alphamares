import React, { useEffect } from 'react'
import Tabs from "@mui/material/Tabs";
import Tab from '@mui/material/Tab';
import UpdateProfil from '../../components/Profil/UpdateProfil';
import Follows from '../../components/Profil/Follows';
import Bills from '../../components/Profil/Bills';
import { useTranslation } from 'react-i18next';


const Profil = () => {
    const [index, setIndex] = React.useState(0);
    const [t] = useTranslation();

    useEffect(() => {
        const storedIndex = sessionStorage.getItem('activeTab');
        if (storedIndex !== null) {
          setIndex(parseInt(storedIndex));
        }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (event, newIndex) => {
        setIndex(newIndex);
        sessionStorage.setItem('activeTab', newIndex.toString());
    };

    return (
        <div>
            <div className="subNavBar">
                <Tabs
                    value={index}
                    onChange={handleChange}
                    textColor='inherit'
                    indicatorColor="primary"
                    centered
                >
                    <Tab label={t('Infos.My-Infos')} />
                    <Tab label={t('Followed.My-Follows')} />
                    <Tab label={t('Bill.Bills')} />
                </Tabs>
                {index === 0 && <UpdateProfil/>}
                {index === 1 && <Follows />}
                {index === 2 && <Bills />}
            </div>
        </div>

    );
};

export default Profil;