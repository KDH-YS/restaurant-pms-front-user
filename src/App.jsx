import ReserveMain from "./components/ReserveMain";
import Header from "./components/Header";
import Footer from "./components/Footer"
import MainPage from "./pages/restaurants/MainPage.js"

// 부트스트랩 임포트
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {BrowserRouter, Route, Router, Routes} from "react-router-dom";
import MenuPage from "./pages/restaurants/MenuPage.js";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Header/>
                <Routes>
                    <Route path="/" element={<ReserveMain/>}/>
                    <Route path="/home" element={<MainPage />} />
                    <Route path="/restaurant" element={<MenuPage/>} />
                </Routes>
                <Footer/>
            </div>
        </BrowserRouter>
    );
  }

export default App;