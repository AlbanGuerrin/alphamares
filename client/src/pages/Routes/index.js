import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'; // Routes remplace Switch et Redirect n'est pluss utilisé (Route "*" mtn) dans la react-router v6
import Catalog from '../Catalog';
import Contact from '../Contact';
import Home from '../Home';
import Media from '../Media';
import Service from '../Service';
import SignUp from '../SignUp';
import Footer from '../../components/Footer';
import NavBar from '../../components/NavBar';
import { useSelector } from 'react-redux';
import Auction from '../Auction';
import HowtoSell from '../Informations/HowToSell';
import HowtoBuy from '../Informations/HowToBuy';
import Lot from '../../components/Lot/Lot';
import LegalNotice from '../Informations/LegalNotice';
import Post from '../../components/Post/Post';
import EmailVerification from '../Utils/EmailVerification';
import { isEmpty } from '../../utils/Utils';
import ForgottenPassword from '../../components/Log/ForgottenPassword';
import { ResetPassword } from '../../components/Log/ResetPassword';
import { ScrollToTop } from '../Utils/ScrollToTop';

const Admin = lazy(() => import('../Admin'));
const AuctionConfig = lazy(() => import('../../components/Admin/Auction/AuctionConfig'));

const Index = () => {
    const userData = useSelector((state) => state.userReducer)
    return (
        <BrowserRouter>
            <div id='App' className='App'>
                <NavBar />
                <ScrollToTop />
                <Suspense>
                    <Routes>
                        <Route path="/" exact element={<Home />} />  {/* component remplacé par element dans v6*/}
                        <Route path='/auctions' exact element={<Catalog />} />
                        <Route path='/media' exact element={<Media />} />
                        <Route path='/service' exact element={<Service />} />
                        <Route path='/contact' exact element={<Contact />} />
                        <Route path='/catalog' exact element={<Catalog />} />
                        <Route path='/profil' exact element={<SignUp />} />
                        <Route path='/notice' exact element={<LegalNotice />} />

                        {!isEmpty(userData) &&
                            <Route>
                                <Route path='/admin/*' exact element={userData.isAdmin ? <Admin /> : <Navigate to="/home" />} />
                                <Route path="/admin/auction/:id" exact element={userData.isAdmin ? <AuctionConfig /> : <Navigate to="/home" />} />
                            </Route>
                        }

                        <Route path="*" element={<Home />} />  {/* Page redirigé si il y a une erreur : TODO faire une page 404. */}
                        <Route path='/email-verification/:token/:userId' exact element={<EmailVerification />} />

                        <Route path='/sell' exact element={<HowtoSell />} />
                        <Route path='/buy' exact element={<HowtoBuy />} />

                        <Route path="/auction/:id" exact element={<Auction />} />
                        <Route path="/lot/:id" exact element={<Lot />} />
                        <Route path="/media/:id" exact element={<Post />} />

                        <Route path='/profil/forgotten-password' exact element={<ForgottenPassword />} />
                        <Route path='/profil/reset-password/:token/:email' exact element={<ResetPassword />} />
                    </Routes>
                </Suspense>
                <Footer />
            </div>
        </BrowserRouter>
    );
};

export default Index;