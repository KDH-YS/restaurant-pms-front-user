import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import ProtectedRoute from "./components/ProtectedRoute";

import MainPage from "./Router/MainPage";
import Contact from "./Router/Contact.jsx";
import Restaurant from "./Router/Restaurant.jsx"
import RestaurantInfo from "./Router/RestaurantInfo.jsx"
import ReservePage from "./Router/ReservePage"
import ReservationStatusPage from "./Router/ReservationStatusPage.jsx";
import LoginRouter from "./Router/LoginRouter.jsx";
import SignupRouter from "./Router/SignupRouter.jsx";
import Mypage from "./Router/Mypage.jsx"
import EditUser from "./Router/EditUserProfile.jsx"
import MyReview from "./Router/MyReview.jsx"
import ShopReview from "./Router/ShopReview.jsx"
import ReviewForm from "./Router/ReviewForm.jsx"
import AdminPage from "./Router/AdminPage.jsx";
import RestaurantAdd from "./pages/restaurants/Add.jsx";
import Update from "./pages/restaurants/Update.jsx";
import ManagerReservePage from './Router/ManagerReservePage.jsx';
import SchedulePage from './Router/SchedulePage.jsx';
import NoticeBoardPage from 'Router/NoticeBoardPage';

function App() {
  const { token } = useAuthStore();

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Restaurant" element={<Restaurant />} />
          <Route path="/Restaurant/:restaurantId" element={<RestaurantInfo />} />
          <Route 
            path="/Reserve" 
            element={
              <ProtectedRoute>
                <ReservePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/manager/*" 
            element={
              <ProtectedRoute requireRestaurantId>
                <Routes>
                  <Route path="reserve" element={<ManagerReservePage />} />
                  <Route path="schedule" element={<SchedulePage />} />
                </Routes>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ReservationStatus" 
            element={
              <ProtectedRoute>
                <ReservationStatusPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/Login" element={<LoginRouter />} />
          <Route path="/Signup" element={<SignupRouter />} />
          <Route path="/Mypage" element={<Mypage />} />
          <Route path="/editUserProfile" element={<EditUser />} />
          <Route 
            path="/review/myreview" 
            element={
              <ProtectedRoute>
                <MyReview />
              </ProtectedRoute>
            }
          />
          <Route path="/review/shopreview" element={<ShopReview />} />
          <Route path="/review/reviewform/:restaurantId/:reservationId" 
          element={
            <ProtectedRoute>
              <ReviewForm />
            </ProtectedRoute>
          } />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute requiredRole="ROLE_ADMIN">
                <Routes>
                  <Route path="restaurant" element={<AdminPage />} />
                </Routes>
              </ProtectedRoute>
            }
          />
          <Route path="/restaurant/update/:restaurantId" element={<Update />} />
          <Route path="/restaurant/add" element={<RestaurantAdd />} />
          <Route path="/noticeboard" element={<NoticeBoardPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

