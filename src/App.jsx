import User from "./Router/User.jsx";
import Contact from "./Router/Contact.jsx";
import Restaurant from "./Router/Restaurant.jsx"
import RestaurantInfo from "./Router/RestaurantInfo.jsx"
import ReservePage from "./Router/Reserve.jsx"
import ReservationStatusPage from "./Router/ReservationStatusPage.jsx";
import ReserveMainPage from "./Router/ReserveMainPage.jsx"
import Mypage from "./Router/Mypage.jsx"
import Review from "./Router/Review.jsx"
import MyReview from "./Router/MyReview.jsx"
import ShopReview from "./Router/ShopReview.jsx"
import ReviewForm from "./Router/ReviewForm.jsx"
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<User />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Restaurant" element={<Restaurant />} />
          <Route path="/Restaurant/info/:restaurantId" element={<RestaurantInfo />} />
          <Route path="/Reserve" element={<ReservePage />} />
          <Route path="/ReservationStatus" element={<ReservationStatusPage/>} />
          <Route path="/Reservemain" element={<ReserveMainPage/>} />
          <Route path="/Mypage" element={<Mypage/>} />
          <Route path="/review" element={<Review/>}></Route>
          <Route path="/review/myreview" element={<MyReview/>}></Route>
          <Route path="/review/shopreview" element={<ShopReview/>}></Route>
          <Route path="/review/reviewform" element={<ReviewForm/>}></Route>
                
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
