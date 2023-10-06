import React, { useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from '@mui/material/Tab';
import Ventes from "../pages/admin/Ventes";
import Users from "../pages/admin/Users";
import Media from "../pages/admin/Media";
import Bidding from "../pages/admin/Bidding";
import Legals from "../pages/admin/Legals";
import CurrentAuction from "./Admin/Auction/CurrentAuction";
import Billing from "../pages/admin/Billing";
import Auctioneer from "../pages/admin/Auctioneer";

const SubNavBar = () => {
    const [index, setIndex] = React.useState(0);

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
        <div className="subNavBar">
            <Tabs
                value={index}
                onChange={handleChange}
                textColor='inherit'
                indicatorColor="primary"
                centered
            >
                <Tab label="Ventes" />
                <Tab label="Utilisateurs" />
                <Tab label="Média" />
                <Tab label="Enchérissement" />
                <Tab label="Enchère en cours" />
                <Tab label="Facturation" />
                <Tab label="Document légaux" />
                <Tab label="Commissaire priseur" />

            </Tabs>
            {index === 0 && <Ventes/>}
            {index === 1 && <Users/>}
            {index === 2 && <Media/>}
            {index === 3 && <Bidding/>}
            {index === 4 && <CurrentAuction/>}
            {index === 5 && <Billing/>}
            {index === 6 && <Legals/>}
            {index === 7 && <Auctioneer/> }
        </div>
    )
}

export default SubNavBar;