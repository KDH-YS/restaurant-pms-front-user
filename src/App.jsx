import Reserve from "./Router/ReservePage";
import ReservationStatus from "./Router/ReservationStatusPage"
import Manager from "./Router/ManagerPage";
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import "./css/App.css";

// 부트스트랩 임포트
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>        
        <Route path="/" element={<Reserve />} />
        <Route path="/reservationStatus" element={<ReservationStatus />} />
        <Route path="/manager" element={<Manager/>}/>        
      </Routes>
    </BrowserRouter>
  );
}
export default App;