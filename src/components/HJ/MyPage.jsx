import {Link} from "react-router-dom";
import '../../css/main.css';
import '../../css/MyPage.css';
import '../../css/Header.css';
import { useAuthStore } from '../../store/authStore';
import { Container, Form } from 'react-bootstrap';

function MyPage() {

  const name = useAuthStore((state) => state.name);
  const userRole = useAuthStore((state) => state.userRole);

  return (
    <Container className="mt-4">
      <Form className="HjMyPageForm">
        <div className="HjMyPageContent">
          <h1 className='HjMypageTitle'>마이 페이지</h1>

          {/* 유저 프로필 : 사진, 이름, 프로필 수정 버튼 */}
          <div className='HjUserProfile'>
            <img src='/icon-user.png'></img>
            <h2 className='HjUserName'>{name}</h2>
            <Link className="HjEditUserProfile" to="/editUserProfile">프로필 수정</Link>
          </div>

          {/* 내 레스토랑: 오너만 보임 */}
          {userRole=='ROLE_ADMIN' && (
            <div className="HjMyPageSection">
              <div className="HjMyPageSectionHeader">
                <p className="HjMyPageSectionTitle">내 레스토랑</p>
              </div>
            </div>
          )}

          {/* 예약 현황 : 예약된 레스토랑, 예약 이력 */}
          <div className="HjMyPageSection">
            <div className="HjMyPageSectionHeader">
              <p className="HjMyPageSectionTitle">예약 현황</p>
              <Link className="HjMyPageSectionLink" to="/ReservationStatus">예약 이력{'>'}</Link>
            </div>
            <ul className="HjReservationList">
              <li className="HjReservationList-detail"></li>
            </ul>
          </div>

          {/* 내 리뷰 : 내 리뷰 리스트, 내 리뷰 전체 보기 */}
          <div className="HjMyPageSection">
            <div className="HjMyPageSectionHeader">
              <p className="HjMyPageSectionTitle">내 리뷰</p>
              <Link className="HjMyPageSectionLink" to="/review/myreview">전체보기{'>'}</Link>
            </div>
            <ul className='HjMyReviewList-list'>
              <li className='HjMyReviewList-detail'>
              </li>
            </ul>
          </div>

          {/* 즐겨찾기 : 즐겨찾기 리스트, 즐겨찾기 전체보기 */}
          <div className="HjMyPageSection">
            <div className="HjMyPageSectionHeader">
              <p className="HjMyPageSectionTitle">즐겨찾기</p>
              <Link className="HjMyPageSectionLink" to="/favoritesAll">전체보기{'>'}</Link>
            </div>
            <ul className="HjFavoritesList">
              <li className="HjFavoritesList-detail"></li>
            </ul>
          </div>
        </div>
      </Form>
    </Container>
  );
}

export default MyPage;