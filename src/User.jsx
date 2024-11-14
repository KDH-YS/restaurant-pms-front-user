import RestaurantsInfo from "./components/RestaurantsInfo";
import Header from "./components/Header";
import Footer from "./components/Footer"

import MenuPage from "./pages/restaurants/MenuPage.js";
import MainPage from "./pages/restaurants/MainPage.js";

import {BrowserRouter, Route, Router, Routes} from "react-router-dom";

// 부트스트랩 임포트
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Restaurants() {
    return (
        <>
            <Header/>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/restaurant" element={<MenuPage/>} />                    
                <Route path="/restaurant/info" element={<RestaurantsInfo/>}/>
            </Routes>
            <Footer/>
        </>
        
    );
  }

export default Restaurants;