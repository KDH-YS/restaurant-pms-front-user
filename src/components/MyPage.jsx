import React from 'react';
import {Link} from "react-router-dom";
import '../css/Header.css'

function MyPage() {
  return (
    <div className="MyPage">
      <h1>My Page</h1>

      {/* 유저 프로필 : 사진, 이름, 프로필 수정 버튼 */}
      <div className='UserProfile'>
        <Link className="editUserProfile" to="/editUserProfile">프로필 수정</Link>
      </div>

      {/* 예약 현황 : 예약된 레스토랑, 예약 이력 */}
      <div className="Reservation">
        <p>예약 현황</p>
        <Link className="reservationHistory" to="/reservationHistory">예약 이력</Link>
      </div>

      {/* 내 리뷰 : 내 리뷰 리스트, 내 리뷰 전체 보기 */}
      <div className="MyReviewList">
        <p>내 리뷰</p>
        <Link className="myReviewListAll" to="/myReviewListAll">전체보기{'>'}</Link>
        <ul>
          <li>
            <p>레스토랑 이름</p>
            <p>사장님이 맛있고 음식이 친절해요~!</p>
            <p>작성일</p>
          </li>
        </ul>
      </div>

      {/* 즐겨찾기 : 즐겨찾기 리스트, 즐겨찾기 전체보기 */}
      <div className="favorites">
        <p>즐겨찾기</p>
        <Link className="favoritesAll" to="/favoritesAll">전체보기{'>'}</Link>
      </div>
    </div>
  );
}

export default MyPage;