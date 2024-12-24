import React, { useEffect, useState } from 'react';
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
  
  // useEffect(() => {
  //   const handleStorageChange = (event) => {
  //     if (!event.newValue) return;

  //     // 세션에 토큰이 있을 경우 로컬에 복사하고 삭제
  //     if (sessionStorage.getItem('token') && !localStorage.getItem('token')) {
  //       localStorage.setItem('token', sessionStorage.getItem('token'));
  //       localStorage.removeItem('token');
  //     } 
  //     // 로컬에서 토큰을 가져와 세션에 저장
  //     else if (event.key === 'token' && !sessionStorage.getItem('token')) {
  //       const data = event.newValue;
  //       sessionStorage.setItem('token', data);        
  //     }
  //   };

  //   // onstorage 이벤트 등록
  //   window.addEventListener('storage', handleStorageChange);

  //   // 컴포넌트 언마운트 시 이벤트 핸들러 제거
  //   return () => {
  //     window.removeEventListener('storage', handleStorageChange);
  //   };
  // }, []);

  // useEffect(() => {
  //   // 세션 스토리지에 토큰이 없을 경우 로컬 스토리지에서 데이터 가져오기
  //   if (!sessionStorage.getItem('token') && localStorage.getItem('token')) {
  //     const token = localStorage.getItem('token');
  //     sessionStorage.setItem('token', token);
  //     localStorage.removeItem('token'); // 로컬에서 토큰을 삭제
  //   }

  //   // temp가 없으면 로컬 스토리지를 변경하여 storage 이벤트를 트리거
  //   if (!localStorage.getItem('temp')) {
  //     localStorage.setItem('temp', '1');
  //     localStorage.removeItem('temp');
  //   }
  // }, []);  세션로그인시 탭이동해도 로그인 유지할려고했는데 탭이 세개이상일경우 무한반복하는 문제가있음 (스토리지 add,remove이벤트를 여러 탭이 반복해서 인식해서 무한반복){BroadcastChannel API 사용하면 해결가능할듯?}



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
          <Route path="/Mypage" element={
                          <ProtectedRoute>
                          <Mypage />
                        </ProtectedRoute>} />
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

