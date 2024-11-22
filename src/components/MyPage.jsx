import React from 'react';
import {Link} from "react-router-dom";
import '../css/MyPage.css';
<<<<<<< HEAD
import '../css/Header.css'
=======
>>>>>>> 00cbf9c (마이페이지 임시 css추가)

function MyPage() {
  return (
    <div className="MyPage">
      <h1 className='MypageTitle'>My Page</h1>

      {/* 유저 프로필 : 사진, 이름, 프로필 수정 버튼 */}
      <div className='UserProfile'>
        <img src='#'></img>
        <p className='UserName'>User Name</p>
        <Link className="editUserProfile" to="/editUserProfile">프로필 수정</Link>
      </div>

      {/* 예약 현황 : 예약된 레스토랑, 예약 이력 */}
      <div className="Reservation">
        <p>예약 현황</p>
        <Link className="reservationHistory" to="/ReservationStatus">예약 이력{'>'}</Link>
      </div>

      {/* 내 리뷰 : 내 리뷰 리스트, 내 리뷰 전체 보기 */}
      <div className="MyReviewList">
        <p>내 리뷰</p>
        <Link className="myReviewListAll" to="/review/myreview">전체보기{'>'}</Link>
        <ul className='myReviewList-list'>
          <li className='myReviewList-detail'>
            <p>레스토랑 이름</p>
            <span>사장님이 맛있고 음식이 친절해요~!</span>
            <span className='createDate'>작성일</span>
          </li>
        </ul>
      </div>

      {/* 즐겨찾기 : 즐겨찾기 리스트, 즐겨찾기 전체보기 */}
      <div className="Favorites">
        <p>즐겨찾기</p>
        <Link className="favoritesAll" to="/favoritesAll">전체보기{'>'}</Link>
      </div>
    </div>
  );
}

export default MyPage;