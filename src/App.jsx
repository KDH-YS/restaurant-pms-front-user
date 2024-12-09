
import 'bootstrap/dist/css/bootstrap.min.css';

import MainPage from "./Router/MainPage";
import Contact from "./Router/Contact.jsx";
import Restaurant from "./Router/Restaurant.jsx"
import RestaurantInfo from "./Router/RestaurantInfo.jsx"
import ReservePage from "./Router/Reserve.jsx"
import ReservationStatusPage from "./Router/ReservationStatusPage.jsx";
import ReserveMainPage from "./Router/ReserveMainPage.jsx"
import LoginRouter from "./Router/LoginRouter.jsx";
import SignupRouter from "./Router/SignupRouter.jsx";
import Mypage from "./Router/Mypage.jsx"
import MyReview from "./Router/MyReview.jsx"
import ShopReview from "./Router/ShopReview.jsx"
import ReviewForm from "./Router/ReviewForm.jsx"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminPage from "./Router/AdminPage.jsx";
import RestaurantAdd from "./pages/restaurants/Add.jsx";
import Update from "./pages/restaurants/Update.jsx";
import ManagerReservePage from 'Router/ManagerReservePage.jsx';
import SchedulePage from 'Router/SchedulePage.jsx';
import InquiryPage from 'Router/Inquiry.jsx'
function App() {
  return (
    <BrowserRouter> 
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Restaurant" element={<Restaurant />} />
          <Route path="/Restaurant/:restaurantId" element={<RestaurantInfo />} />
          <Route path="/Reserve" element={<ReservePage />} />
          <Route path="/manager/reserve" element={<ManagerReservePage />} />
          <Route path="/manager/schedule" element={<SchedulePage/>} />
          <Route path="/ReservationStatus" element={<ReservationStatusPage/>} />
          <Route path="/Reservemain" element={<ReserveMainPage/>} />
          <Route path="/Login" element={<LoginRouter/>} />
          <Route path="/Signup" element={<SignupRouter/>} />
          <Route path="/Mypage" element={<Mypage/>} />
          <Route path="/review/myreview" element={<MyReview/>}></Route>
          <Route path="/review/shopreview" element={<ShopReview/>}></Route>
          <Route path="/review/reviewform" element={<ReviewForm/>}></Route>
          <Route path="/admin/restaurant" element={<AdminPage/>}></Route>
          <Route path="/restaurant/update/:restaurantId" element={<Update/>}></Route>
          <Route path="/restaurant/add" element={<RestaurantAdd/>}></Route>
          <Route path="/Inquiry" element={<InquiryPage/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
