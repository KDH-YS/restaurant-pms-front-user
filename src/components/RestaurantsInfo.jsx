import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, CardBody } from 'react-bootstrap';
import { StarFill } from 'react-bootstrap-icons';
import { fetchRestaurantDetail, fetchRestaurantMenu, fetchRestaurantSchedule } from '../pages/restaurants/api';
import { restaurantStore } from 'store/restaurantStore';
import { useAuthStore } from 'store/authStore';
import Map from './Map';
import Restaurantimg from 'img/restaurant.jpg'
import { Link } from "react-router-dom"

function RestaurantsInfo() {
  const { token } = useAuthStore();
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { restaurant, setRestaurant } = restaurantStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menus, setMenus] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [images, setImages] = useState([]);  // 이미지 데이터 상태

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
  }, [restaurantId, token, setRestaurant]);

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
    if (!scheduleData || scheduleData.length === 0) {
      return <p className="text-muted">영업시간 정보가 없습니다.</p>;
    }
    return scheduleData.map((item) => (
      <div key={item.scheduleId} className="mb-3">
        <h6 className="mb-2">{item.openDate}</h6>
        <h6 className="mb-2">{Number(item.isOpen) === 1 ? '영업 중' : '휴무'}</h6>
        <p className="mb-1">영업시간 : {formatTime(item.startTime)} - {formatTime(item.endTime)}</p>
        {item.breakStart && item.breakEnd && (
          <p className="mb-0">휴식시간 : {formatTime(item.breakStart)} - {formatTime(item.breakEnd)}</p>
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

  if (error) return (
    <Container className="text-center py-5">
      <h3 className="text-danger">{error}</h3>
    </Container>
  );

  return (
    <Container className="py-4">
      {/* 헤더 이미지 */}
      {images.length > 0 && (
             <div className="imageGalleryJh">
             <h3>식당 이미지</h3>
             <Row>
               {/* 이미지를 3개씩 나열 */}
               {images.slice(0, 3).map((image, index) => (
                 <Col key={index} xs={3} sm={3} md={3} lg={3} className='mb-4'>
                   <Card className="galleryCardJh">
                   <div className="galleryImageContainerJh">
                     <Card.Img
                       variant="top"
                       src={image.imageUrl}
                       alt="식당 이미지"
                       className="galleryImageJh"
                       onClick={() => handleImageClick(index)} // 이미지 클릭 시 모달로 보기
                     />
                     </div>
                   </Card>
                 </Col>
               ))}
             </Row>
       
             {/* "더보기" 버튼 */}
             {images.length > 3 && (
               <Button
                 variant="primary"
                 className="moreImagesBtnJh"
                 onClick={() => handleImageClick(3)} // 4번째 이미지부터 모달 열기
               >
                 +{images.length - 3}개 더 보기
               </Button>
             )}
              </div>
          )}

      {/* 레스토랑 이름과 별점 */}
      <div className="text-center mb-5">
        <h1 className="restaurant-title mb-3">{restaurant?.name}</h1>
        <div className="d-flex justify-content-center gap-1">
          {[...Array(5)].map((_, i) => (
            <StarFill 
              key={i} 
              className="text-warning" 
              style={{ opacity: i < (restaurant?.averageRating || 0) ? 1 : 0.3 }}
            />
          ))}
        </div>
      </div>

      <Row style={{marginBottom:"30px"}}>
        {/* 왼쪽 정보 섹션 */}
        <Col md={7}>
          <Card className="mb-4 bg-light"style={{height:"100%"}}>
            <Card.Body >
              <h2 className="h5 mb-4">매장소개</h2>
              <p className="text-muted mb-4">{restaurant?.description}</p>

              <div className="mb-4">
                <h3 className="h6 mb-3">주소</h3>
                <p className="mb-1">{restaurant?.jibunAddr}</p>
                <p className="mb-3">{restaurant?.roadAddr}</p>
                <p className="mb-0"><strong>총 좌석 수:</strong> {restaurant?.totalSeats}</p>
              </div>

              <div className="mb-4">
                <h3 className="h6 mb-3">영업시간</h3>
                {formatSchedule(schedule)}
              </div>

              <div>
                <h3 className="h6 mb-3">메뉴</h3>
                {menus.length > 0 ? (
                  <ul className="list-unstyled">
                    {menus.map((menu, index) => (
                      <li key={index} className="mb-2">
                        <strong>{menu.name}</strong> {menu.price}원
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">메뉴 정보가 없습니다.</p>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* 오른쪽 지도 섹션 */}
        <Col md={5} style={{overflow:"hidden"}}>
      
        
          
              <Map />
              
        </Col>
      </Row>

      {/* 리뷰 섹션 */}
      <Card className="mb-4">
        <Card.Body>
          <h2 className="h5 mb-4">Reviews</h2>
          <div className="border-bottom pb-3 mb-3">
            <p className="mb-1">리뷰 페이지에서 받아온 리뷰 클릭시 리뷰 페이지로</p>
            <small className="text-muted">- 김성자</small>
          </div>
          <div>
            <p className="mb-1">리뷰 페이지에서 받아온 리뷰 클릭시 리뷰 페이지로</p>
            <small className="text-muted">- 두개</small>
          </div>
        {/* 하단: 리뷰 구역 */}
        <section className="reviews">
          <h2>Reviews</h2>
          <Link to="/review/shopReview"><p>전체보기</p></Link>
          <div className="review">
            <p>리뷰 페이지에서 받아온 리뷰 클릭시 리뷰 페이지로</p>
            <span> - 작성자</span>
          </div>
        </section>
        </Card.Body>
      </Card>

      {/* 예약 섹션 */}
        <Card.Body>
          <h2 className="h5 mb-4">Make a Reservation</h2>
          <Button 
            variant="warning" 
            size="lg" 
            onClick={handleReserveClick}
            style={{backgroundColor: "#f28d28",border:"none"}}
            className="reservation-btn"
          >
            예약하기
          </Button>
        </Card.Body>
        
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

    </Container>
  );
}

export default RestaurantsInfo;

