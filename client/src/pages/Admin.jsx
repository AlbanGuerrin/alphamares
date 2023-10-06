import React from 'react'
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SubNavBar from '../components/SubNavBar';
import Ventes from './admin/Ventes';

const Admin = () => {
    const userData = useSelector((state) => state.userReducer)
    return (
        (userData.isAdmin ?
            (
                <div className='admin'>
                    <SubNavBar />
                    <Routes>
                        <Route path={'/admin/ventes'} element={<Ventes />} />
                    </Routes>
                </div>
            )
            : (<h3 style={{ textAlign: "center", margin: "auto" }}>UNHAUTHORIZED</h3>)
        )
    );
};

export default Admin;