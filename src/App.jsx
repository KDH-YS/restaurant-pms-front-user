import User from "./Router/User.jsx";
import Contact from "./Router/Contact.jsx";
import Restaurant from "./Router/Restaurant.jsx"
import RestaurantInfo from "./Router/RestaurantInfo.jsx"
import ReservePage from "./Router/Reserve.jsx"
import ReservationStatusPage from "./Router/ReservationStatusPage.jsx";
import ReserveMainPage from "./Router/ReserveMainPage.jsx"
import Mypage from "./Router/Mypage.jsx"
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<User />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Restaurant" element={<Restaurant />} />
          <Route path="/Restaurant/info" element={<RestaurantInfo />} />
          <Route path="/Reserve" element={<ReservePage />} />
          <Route path="/ReservationStatus" element={<ReservationStatusPage/>} />
          <Route path="/Reservemain" element={<ReserveMainPage/>} />
          <Route path="/Mypage" element={<Mypage/>} />
                
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
