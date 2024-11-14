import ReserveMain from "./components/ReserveMain";
import MyPage from "./components/MyPage";
import Header from "./components/Header";
import Footer from "./components/Footer"

// 부트스트랩 임포트
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {BrowserRouter, Route, Router, Routes} from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Header/>
                <Routes>
                    <Route path="/" element={<ReserveMain/>}/>
                    <Route path="/MyPage" element={<MyPage/>}/>
                </Routes>
                <Footer/>
            </div>
        </BrowserRouter>
    );
}

export default App;