import React from 'react';
import '../css/Header.css'

function MyPage() {
  return (
    <div className="MyPage">
      <h1>My Page</h1>
      <div className='UserProfile'>
        {/* 유저 프로필 사진, 이름, 프로필 수정 버튼 */}
        {/* 개인 정보 수정 페이지로 이동 */}
        <button className='EditProfileBtn'>
          <p>프로필 수정</p>
        </button>
      </div>

      <div className="Reservation">
        <p>예약 현황</p>
        <button>
          <p>예약 이력{'>'}</p>
        </button>
      </div>

      <div className="MyReviewList">
        <p>내 리뷰</p>
        <button>
          <p>전체보기{'>'}</p>
        </button>
        <ul>
          <li>
            <p>레스토랑 이름</p>
            <p>사장님이 맛있고 음식이 친절해요~!</p>
            <p>작성일</p>
          </li>
        </ul>
      </div>

      <div className="favorites">
        <p>즐겨찾기</p>
        <button>
          <p>전체보기{'>'}</p>
        </button>
      </div>
    </div>
  );
}

export default MyPage;