import React, { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom'
import { UidContext } from './AppContext';
import { useTranslation } from "react-i18next";
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Button from '@mui/material/Button';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import cookie from 'js-cookie';
import axios from 'axios';
import moment from 'moment';


function NavBar() {
    const { uid, setUid } = useContext(UidContext);
    const userData = useSelector((state) => state.userReducer) // recupère les data grâce au reducer
    const isAdmin = userData.isAdmin;
    const dispatch = useDispatch();

    const [t, i18n] = useTranslation();
    const [openDrawer, setOpenDrawer] = useState(false);
    const [language, setLanguage] = useState(i18n.language);

    const removeCookie = (key) => {
        if (window !== "undefined") { // Si la fenêtre n'est pas inactif
            cookie.remove(key, { expires: 1 });
        }
    }

    const logout = () => {
        axios({
            method: 'get',
            url: `${process.env.REACT_APP_API_URL}api/user/logout`,
            withCredentials: true,
        })
            .then(() => {
                dispatch({ type: 'LOGOUT' });
                removeCookie('jwt')
                setUid(null);
            })
            .catch((err) => console.log(err))
        window.location = "/";
    }

    const toggleDrawer = () => {
        setOpenDrawer(!openDrawer);
    }

    function toogleLanguage(event) {
        if (event.target.value !== language) {
            setLanguage(event.target.value);
            i18n.changeLanguage(event.target.value);
            moment.locale(event.target.value);
        }
    }

    function Menu() {
        return (
            <nav>
                <ul className='menu' >
                    <li>
                        <NavLink to='/auctions' onClick={() => setOpenDrawer(false)}>
                            <h5>{t('Navbar.Sales')}</h5>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/service' onClick={() => setOpenDrawer(false)}>
                            <h5>{t('Navbar.Services')}</h5>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/media' onClick={() => setOpenDrawer(false)}>
                            <h5>{t('Navbar.Media')}</h5>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to='/contact' onClick={() => setOpenDrawer(false)}>
                            <h5>{t('Navbar.Contact')}</h5>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        )
    }

    function Home() {
        return (
            <nav>
                <div className='logo'>
                    <NavLink to="/" onClick={() => setOpenDrawer(false)}>
                        <div className='dynamicIcon'>
                            <div className='outlinedIcon'>
                                <img src='./img/icons/home.svg' alt='icon' />
                            </div>
                            <div className='filledIcon'>
                                <img src='./img/icons/home-filled.svg' alt='icon' />
                            </div>
                        </div>
                    </NavLink>
                </div>
            </nav>
        )
    }

    function Language() {
        return (
            <nav>
                <div className='language'>
                    {language === "fr-FR" && <img src='./img/icons/french_flag.svg' alt='french flag' />}
                    {language === "en-EN" && <img src='./img/icons/UK_flag.svg' alt='UK flag' />}
                    <select value={language} onChange={toogleLanguage}  >
                        <option value="fr-FR">
                            FR
                        </option>
                        <option value="en-EN">EN</option>
                    </select>
                </div>
            </nav>
        )
    }

    return (
        <nav className='NavBar'>
            <Button className='hamburger-menu' onClick={toggleDrawer}><MenuRoundedIcon className='hamburger-icon'></MenuRoundedIcon></Button>
            <div className='nav-container' >
                {language && <Language />}
                <Home />
                <Menu />
            </div>
            <div className='btn-container'>
                {uid ? (
                    <ul>
                        {userData.isAdmin &&
                            <li>
                                <NavLink className="btn" style={{ display: { isAdmin } ? 'block' : 'none' }} to='/admin'>
                                    Admin
                                </NavLink>
                            </li>}
                        <li className='name'>
                            <NavLink className="btn" to='/profil'>
                                {t('Navbar.Profile')}{/* {userData.name} {userData.surname}  */}
                            </NavLink>
                        </li>
                        <li className='btn'>
                            <Button onClick={logout}>
                                {t('Navbar.Logout')}
                            </Button>
                        </li>

                    </ul>
                ) : (
                    <ul>
                        <li>
                            <NavLink className="btn" to='/profil' state={"sign-up"}  >
                                {t('Navbar.Sign-up')}
                            </NavLink>
                        </li>
                        <li>
                            <NavLink className="btn" to='/profil' state={"sign-in"}  >
                                {t('Navbar.Sign-in')}
                            </NavLink>
                        </li>
                    </ul>
                )}
            </div>
            <SwipeableDrawer
                anchor='left'
                open={openDrawer}
                onClose={toggleDrawer}
                onOpen={toggleDrawer}
                PaperProps={{
                    sx: {
                        backgroundColor: "black",
                        padding: "10% 5% 5% 5%",
                        fontSize: 'calc(1rem + 3vw)',
                    }
                }}
            >
                {
                    <>
                        <Home />
                        <Language />
                        <Menu />
                    </>
                }
            </SwipeableDrawer>
        </nav>
    )
};

export default NavBar;