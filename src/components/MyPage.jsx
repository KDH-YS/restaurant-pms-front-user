import {Link} from "react-router-dom";
import '../css/main.css';
import '../css/MyPage.css';
import '../css/Header.css';
import { useAuthStore } from '../store/authStore';

function MyPage() {

  const userName = useAuthStore((state) => state.userName);

  return (
    <div className="HjMyPage">
      <form className="HjMyPageForm">
        <h1 className='HjMypageTitle'>마이 페이지</h1>

        {/* 유저 프로필 : 사진, 이름, 프로필 수정 버튼 */}
        <div className='HjUserProfile'>
          <img src='/icon-user.png'></img>
          <h2 className='HjUserName'>{userName}</h2>
          <Link className="HjEditUserProfile" to="/editUserProfile">프로필 수정</Link>
        </div>

        {/* 예약 현황 : 예약된 레스토랑, 예약 이력 */}
        <div className="HjReservation">
          <div className="HjReservationHeader">
            <p>예약 현황</p>
            <Link className="HjReservationHistory" to="/ReservationStatus">예약 이력{'>'}</Link>
          </div>
          <ul className="HjReservationList">
            <li className="HjReservationList-detail"></li>
          </ul>
        </div>

        {/* 내 리뷰 : 내 리뷰 리스트, 내 리뷰 전체 보기 */}
        <div className="HjMyReviewList">
          <div className="HjMyReviewListHeader">
            <p>내 리뷰</p>
            <Link className="HjMyReviewListAll" to="/review/myreview">전체보기{'>'}</Link>
          </div>
          <ul className='HjMyReviewList-list'>
            <li className='HjMyReviewList-detail'>
              <p>레스토랑 이름</p>
              <span>사장님이 맛있고 음식이 친절해요~!</span>
              <span className='HjCreateDate'>작성일</span>
            </li>
          </ul>
        </div>

        {/* 즐겨찾기 : 즐겨찾기 리스트, 즐겨찾기 전체보기 */}
        <div className="HjFavorites">
          <div className="HjFavoritesHeader">
            <p>즐겨찾기</p>
            <Link className="HjFavoritesAll" to="/favoritesAll">전체보기{'>'}</Link>
          </div>
          <ul className="HjFavoritesList">
            <li className="HjFavoritesList-detail"></li>
          </ul>
        </div>
      </form>
    </div>
  );
}

export default MyPage;