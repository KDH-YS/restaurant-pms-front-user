import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // useParams로 URL 파라미터 받기
import { fetchRestaurantDetail, fetchRestaurantMenu, fetchRestaurantSchedule, getRestaurantImages } from '../pages/restaurants/api';  // API 호출 함수 임포트
import '../css/ReserveMain.css';  // 스타일 임포트
import { Modal } from 'react-bootstrap';

function RestaurantsInfo() {
  const { restaurantId } = useParams();  // URL에서 restaurantId 받기
  const navigate = useNavigate();  // 네비게이션 함수

  const [restaurant, setRestaurant] = useState(null);  // 레스토랑 데이터 상태
  const [menus, setMenus] = useState([]);  // 메뉴 데이터 상태
  const [schedule, setSchedule] = useState(null);
  const [images, setImages] = useState([]);  // 이미지 데이터 상태
  const [loading, setLoading] = useState(true);  // 로딩 상태
  const [error, setError] = useState(null);  // 에러 상태

  // 모달 관련 상태
  const [showModal, setShowModal] = useState(false);  // 모달 열기/닫기 상태
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);  // 선택된 이미지 인덱스

   // 레스토랑 상세 정보를 API에서 가져오는 함수
   useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 레스토랑, 메뉴, 스케줄, 이미지 데이터를 동시에 호출
        const restaurantData = await fetchRestaurantDetail(restaurantId);
        setRestaurant(restaurantData);
        
        const menuData = await fetchRestaurantMenu(restaurantId);
        setMenus(menuData);

        const scheduleData = await fetchRestaurantSchedule(restaurantId);
        setSchedule(scheduleData);

        const imageData = await getRestaurantImages(restaurantId);
        setImages(imageData);  // 이미지를 상태에 저장
      } catch (err) {
        setError('정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchData();
    }
  }, [restaurantId]);

 // 시간을 "HH:mm:ss" -> "HH:mm" 형식으로 변환 (null 또는 undefined 처리 추가)
const formatTime = (timeString) => {
  if (!timeString) {
    return '정보 없음';  // null 또는 undefined일 경우 처리
  }
  const [hours, minutes] = timeString.split(':');
  return `${hours}:${minutes}`;
};

     // 스케줄 데이터를 어떻게 처리할지 (예시로 format 함수를 만들어서 데이터를 보기 좋게 가공)
  const formatSchedule = (scheduleData) => {
    if (!schedule || schedule.length === 0) {
      return <p>영업시간 정보가 없습니다.</p>;
    }
    return scheduleData.map((item) => (
      <div key={item.scheduleId}>
        <h4>{item.openDate}</h4>
        <h4>{Number(item.isOpen) === 1 ? '영업 중' : '휴무'}</h4>
        <p>영업시간 : {formatTime(item.startTime)} - {formatTime(item.endTime)}</p>
        {item.breakStart && item.breakEnd && (
          <p>휴식시간 : {formatTime(item.breakStart)} - {formatTime(item.breakEnd)}</p>
        )}
      </div>
    ));
  };

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);  // 클릭한 이미지 인덱스를 저장
    setShowModal(true);  // 모달 열기
  };

  const handleModalClose = () => {
    setShowModal(false);  // 모달 닫기
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;


  return (
    <div className="main" >
      <div className="restaurant-page">
        {/* 상단: 식당 이름, 설명, 별점 */}
        <header className="restaurant-header">
         {/* 배경 이미지 등 */}
         {images.length > 0 && (
            <div className="image-gallery">
              <h3>식당 이미지</h3>
              <div className="image-list">
                {/* 이미지를 3개씩 보여주기 */}
                {images.slice(0, 3).map((image, index) => (
                  <img
                    key={index}
                    src={image.imageUrl}
                    alt={restaurant?.name}
                    className="gallery-image"
                    style={{ width: '30%', margin: '0 7.5px' }}
                    onClick={() => handleImageClick(index)}  // 이미지 클릭 시 해당 이미지를 모달에서 보기
                  />
                ))}
                {/* 이미지가 3개 이상일 경우 "더보기" 버튼 */}
                {images.length > 3 && (
                  <button
                    className="more-images-btn"
                    onClick={() => handleImageClick(3)}  // 4번째 이미지를 모달로 열기
                  >
                    +{images.length - 3}개 더 보기
                  </button>
                )}
              </div>
            </div>
          )}
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
                <p>{restaurant?.jibunAddr}</p>
                <p>{restaurant?.roadAddr}</p>
              </div>
                <p><strong>총 좌석 수:</strong> {restaurant?.totalSeats}</p>

                 {/* 스케줄 섹션 */}
              <div className="business-hours">
                <h3>영업시간</h3>
                {formatSchedule(schedule)}
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

      {/* 모달: 이미지 확대 보기 */}
      <Modal show={showModal} onHide={handleModalClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>이미지 확대보기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-image-container">
            <button className="prev-button" onClick={handlePrevImage}>◀</button>
            <img
              src={images[selectedImageIndex]?.imageUrl}
              alt="Restaurant"
              style={{ width: '70%', height: 'auto' }}
            />
            <button className="next-button" onClick={handleNextImage}>▶</button>
          </div>

          {/* 이미지 썸네일 리스트 */}
    <div className="thumbnail-list">
      {images.map((image, index) => (
        <img
          key={index}
          src={image.imageUrl}
          alt={`Thumbnail ${index}`}
          style={{ width: '10%', height: 'auto'}}
          className={`thumbnail-image ${index === selectedImageIndex ? 'active' : ''}`}
          onClick={() => setSelectedImageIndex(index)} // 썸네일 클릭 시 이미지 변경
        />
      ))}
    </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default RestaurantsInfo;
