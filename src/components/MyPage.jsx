import {Link} from "react-router-dom";
import '../css/MyPage.css';
import '../css/Header.css';

function MyPage() {
  return (
    <div className="HjMyPage">
      <h1 className='HjMypageTitle'>My Page</h1>

      {/* 유저 프로필 : 사진, 이름, 프로필 수정 버튼 */}
      <div className='HjUserProfile'>
        <img src='#'></img>
        <p className='HjUserName'>User Name</p>
        <Link className="HjEditUserProfile" to="/editUserProfile">프로필 수정</Link>
      </div>

      {/* 예약 현황 : 예약된 레스토랑, 예약 이력 */}
      <div className="HjReservation">
        <p>예약 현황</p>
        <Link className="HjReservationHistory" to="/ReservationStatus">예약 이력{'>'}</Link>
      </div>

      {/* 내 리뷰 : 내 리뷰 리스트, 내 리뷰 전체 보기 */}
      <div className="HjMyReviewList">
        <p>내 리뷰</p>
        <Link className="HjMyReviewListAll" to="/review/myreview">전체보기{'>'}</Link>
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
        <p>즐겨찾기</p>
        <Link className="HjFavoritesAll" to="/favoritesAll">전체보기{'>'}</Link>
      </div>
    </div>
  );
}

export default MyPage;