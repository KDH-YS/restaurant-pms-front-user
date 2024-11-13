import Reserve from "./components/Reserve";
import ReservationStatus from "./components/ReservationStatus"
import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import "./css/App.css";

// 부트스트랩 임포트
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <BrowserRouter>
    <Header></Header>
      <Routes>        
        <Route path="/" element={<Reserve />} />
        <Route path="/ReservationStatus" element={<ReservationStatus />} />        
      </Routes>
      <Footer></Footer>
    </BrowserRouter>
  );
}
export default App;