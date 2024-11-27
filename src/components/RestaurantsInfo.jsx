import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // useParams로 URL 파라미터 받기
import { fetchRestaurantDetail, fetchRestaurantMenu } from '../pages/restaurants/api';  // API 호출 함수 임포트
import '../css/ReserveMain.css';  // 스타일 임포트

function RestaurantsInfo() {
  const { restaurantId } = useParams();  // URL에서 restaurantId 받기
  const navigate = useNavigate();  // 네비게이션 함수

  const [restaurant, setRestaurant] = useState(null);  // 레스토랑 데이터 상태
  const [loading, setLoading] = useState(true);  // 로딩 상태
  const [error, setError] = useState(null);  // 에러 상태
  const [menus, setMenus] = useState([]);  // 메뉴 데이터 상태

  // 레스토랑 상세 정보를 API에서 가져오는 함수
  useEffect(() => {
    const getRestaurantDetail = async () => {
      setLoading(true);  // 로딩 시작
      try {
        const data = await fetchRestaurantDetail(restaurantId);  // API 호출
        setRestaurant(data);  // 레스토랑 정보 상태 업데이트
      } catch (err) {
        setError('레스토랑 정보를 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false);  // 로딩 종료
      }
    };

    const getRestaurantMenu = async () => {
      setLoading(true);  // 로딩 시작
      try {
        const menuData = await fetchRestaurantMenu(restaurantId);  // 메뉴 정보 API 호출
        setMenus(menuData);  // 메뉴 상태 업데이트
      } catch (err) {
        setError('메뉴 정보를 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false);  // 로딩 종료
      }
    };

    if (restaurantId) {
      getRestaurantDetail();  // restaurantId가 있을 때만 API 호출
      getRestaurantMenu();  // 메뉴 정보 API 호출
    }
  }, [restaurantId]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;


  return (
    <div className="main" >
      <div className="restaurant-page">
        {/* 상단: 식당 이름, 설명, 별점 */}
        <header className="restaurant-header">
          {/* 배경 이미지 등 */}
        </header>

        {/* 중간: 매장 소개, 주소, 영업시간, 메뉴 */}
        <section className="restaurant-info">
          <h1 className="restaurant-title">{restaurant?.name}</h1>
          <div className="rating">
            <span>{'★'.repeat(restaurant?.averageRating || 0)}{'☆'.repeat(5 - (restaurant?.averageRating || 0))}</span> {/* 별점 표시 */}
          </div>
         {/* 주소와 영업시간, 지도 배치 */}
          <div className="info-container">
            <div className="left-info">
                
            <h2>매장소개</h2>
           <p>{restaurant?.description}</p>
              <div className="address">
                <h3>주소</h3>
                <p>{restaurant?.address}</p>
              </div>
                <p><strong>총 좌석 수:</strong> {restaurant.totalSeats}</p>

              <div className="business-hours">
                <h3>영업시간</h3>
                <p>[레스토랑 정보 페이지에서 받아와서 동적으로 처리]</p>
                <p>[레스토랑 정보 페이지에서 받아와서 동적으로 처리]</p>
              </div>
              <div className="menu">
            <h3>메뉴</h3>
            <ul>
              {menus.length > 0 ? (
                menus.map((menu,index) => (
                  <li key={index}>
                        <strong>{menu.name}</strong> {menu.price}원
                      </li>
                    ))
                  ) : (
                    <li>메뉴 정보가 없습니다.</li>
              )}
            </ul>
          </div>
            </div>

            {/* 오른쪽에 지도 */}
            <div className="google-map">
              <h3>지도</h3>
              <div className="map-placeholder">
                {/* 임시로 구글 맵 영역을 대체하는 박스 */}
                <p>  .</p>
                <div style={{ width: '100%', height: '400px', backgroundColor: '#e0e0e0', textAlign: 'center', lineHeight: '400px' }}>
                  <span>추후 지도 API로 구현.</span>
                </div>
              </div>
            </div>
          </div>


        </section>

        {/* 하단: 리뷰 구역 */}
        <section className="reviews">
          <h2>Reviews</h2>
          <div className="review">
            <p>리뷰 페이지에서 받아온 리뷰 클릭시 리뷰 페이지로</p>
            <span> - 작성자</span>
          </div>
          <div className="review">
            <p>리뷰 페이지에서 받아온 리뷰 클릭시 리뷰 페이지로</p>
            <span>- 두개</span>
          </div>
        </section>

        {/* 예약 날짜 선택 */}
        <section className="reservation">
          <h2>Make a Reservation</h2>

          <button className="reserve-btn" >
             예약하기 
          </button>
        </section>
      </div>
    </div>
  );
}

export default RestaurantsInfo;
