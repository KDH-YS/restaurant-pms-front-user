import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { StarFill } from 'react-bootstrap-icons';
import { fetchRestaurantDetail, fetchRestaurantMenu, fetchRestaurantSchedule, getRestaurantImages } from '../pages/restaurants/api';
import { restaurantStore } from '../store/restaurantStore';
import { useAuthStore } from '../store/authStore';
import Map from './Map';
import { Link } from "react-router-dom";
import "../css/ReserveMain.css";

function RestaurantsInfo() {
  const { token } = useAuthStore();
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { restaurant, setRestaurant } = restaurantStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menus, setMenus] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [open, setOpen] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [restaurantData, menuData, scheduleData, imageData] = await Promise.all([
        fetchRestaurantDetail(restaurantId),
        fetchRestaurantMenu(restaurantId),
        fetchRestaurantSchedule(restaurantId),
        getRestaurantImages(restaurantId)
      ]);
      
      setRestaurant(restaurantData);
      setMenus(menuData);
      setSchedule(scheduleData);
      setImages(imageData);
    } catch (err) {
      setError('정보를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [restaurantId, token]);

  const formatTime = (timeString) => {
    if (!timeString) return '정보 없음';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  const formatSchedule = useMemo(() => {
    if (!schedule || schedule.length === 0) {
      setOpen(false);
      return <p className="text-muted">영업시간 정보가 없습니다.</p>;
    }
  
    const today = new Date().toISOString().slice(0, 10); // 오늘 날짜 (YYYY-MM-DD 형식)
    const todaySchedule = schedule.find((item) => item.openDate === today);
  
    if (!todaySchedule) {
      setOpen(false);
      return <p className="text-muted">오늘은 영업하지 않습니다.</p>;
    }
  
    setOpen(Number(todaySchedule.isOpen) === 1);
  
    return (
      <div key={todaySchedule.scheduleId} className="mb-3">
        <h6 className="mb-2">{todaySchedule.openDate}</h6>
        <h6 className="mb-2">{Number(todaySchedule.isOpen) === 1 ? '영업 중' : '휴무'}</h6>
        <p className="mb-1">
          영업시간: {formatTime(todaySchedule.startTime)} - {formatTime(todaySchedule.endTime)}
        </p>
        {todaySchedule.breakStart && todaySchedule.breakEnd && (
          <p className="mb-0">
            휴식시간: {formatTime(todaySchedule.breakStart)} - {formatTime(todaySchedule.breakEnd)}
          </p>
        )}
      </div>
    );
  }, [schedule]);
  

  const handleImageClick = useCallback((index) => {
    setSelectedImageIndex(index);
    setShowModal(true);
  }, []);

  const handleModalClose = useCallback(() => setShowModal(false), []);
  const handleReserveClick = useCallback(() => {
    if (!token) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate("/login");  // 로그인 페이지로 리디렉션
    } else {
      navigate("/reserve");  // 예약 페이지로 리디렉션
    }
  }, [navigate, token]);  // navigate와 token 의존성
  
  const handlePrevImage = useCallback(() => setSelectedImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1)), [images.length]);
  const handleNextImage = useCallback(() => setSelectedImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1)), [images.length]);
  const reserveBtn = useMemo(() => {
    if (open) {
      return (
        <Button
          variant="warning"
          size="lg"
          onClick={handleReserveClick}
          style={{backgroundColor: "#f28d28", border:"none"}}
          className="reservation-btn"
        >
          예약하기
        </Button>
      );
    } else {
      return (
        <Button
          variant="warning"
          size="lg"
          onClick={handleReserveClick}
          style={{backgroundColor: "#f28d28", border:"none"}}
          className="reservation-btn"
          disabled
          title="가게에 문의해주세요"
        >
          예약하기
        </Button>
      );
    }
  }, [open]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <Container className="text-center py-5"><h3 className="text-danger">{error}</h3></Container>;

  return (
    <div>
       {/* 이미지 갤러리 */}
       {images.length > 0 && (
        <div className="imageGalleryJh">
          {/* <h3>식당 이미지</h3> */}
          <Row>
        {/* 이미지를 3개까지 표시 (기본 이미지 포함) */}
        {images.slice(0, 3).map((image, index) => (
          <Col key={index} xs={4} sm={4} md={4} lg={4} className="mb-4">
            <Card className="galleryCardJh">
              <div className="galleryImageContainerJh">
                <Card.Img
                  variant="top"
                  src={image.imageUrl || '/fc7ece8e8ee1f5db97577a4622f33975.jpg'} // 기본 이미지 경로
                  alt="식당 이미지"
                  className="galleryImageJh"
                  onClick={() => handleImageClick(index)}
                />
              </div>
            </Card>
          </Col>
        ))}
        
        {/* 부족한 이미지를 기본 이미지로 채워주기 */}
        {images.length < 3 && (
          Array.from({ length: 3 - images.length }).map((_, index) => (
            <Col key={`default-${index}`} xs={4} sm={4} md={4} lg={4} className="mb-4">
              <Card className="galleryCardJh">
                <div className="galleryImageContainerJh">
                  <Card.Img
                    variant="top"
                    src='/fc7ece8e8ee1f5db97577a4622f33975.jpg' // 기본 이미지
                    alt="기본 식당 이미지"
                    className="galleryImageJh"
                  />
                </div>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* 더 보기 버튼 (조건부로 표시) */}
      {images.length > 3 && (
        <Button
          variant="primary"
          className="moreImagesBtnJh"
          onClick={() => handleImageClick(3)}
        >
          +{images.length - 3}개 더 보기
        </Button>
      )}
    </div>
  )}

  {/* 이미지가 아예 없을 경우 기본 이미지 3개 */}
  {images.length === 0 && (
    <div className="imageGalleryJh">
      <Row>
        {/* 기본 이미지 3개 추가 */}
        {Array.from({ length: 3 }).map((_, index) => (
          <Col key={`default-${index}`} xs={4} sm={4} md={4} lg={4} className="mb-4">
            <Card className="galleryCardJh">
              <div className="galleryImageContainerJh">
                <Card.Img
                  variant="top"
                  src='/fc7ece8e8ee1f5db97577a4622f33975.jpg' // 기본 이미지
                  alt="기본 식당 이미지"
                  className="galleryImageJh"
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )}

    <Container className="py-4">
     

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
          <Card className="mb-4 bg-light" style={{height:"100%"}}>
            <Card.Body>
              <h2 className="h5 mb-4">매장소개</h2>
              <p className="text-muted mb-4">{restaurant?.description}</p>

              <div className="mb-4">
                <h3 className="h6 mb-3">주소</h3>
                <p className="mb-1">{restaurant?.jibunAddr}</p>
                <p className="mb-3">{restaurant?.roadAddr}</p>
                <p className="mb-0"><strong>총 좌석 수:</strong> {restaurant?.totalSeats}</p>
              </div>

              <div className="mb-4">
                {formatSchedule}
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
          <Map/>
        </Col>
      </Row>

      {/* 리뷰 섹션 */}
      <Card className="mb-4">
        <Card.Body>
          <h2 className="h5 mb-4">리뷰</h2>
          <Link to="/review/shopReview">전체보기</Link>
          <div className="border-bottom pb-3 mb-3">
            <p className="mb-1">리뷰 페이지에서 받아온 리뷰 클릭시 리뷰 페이지로</p>
            <small className="text-muted">- 김성자</small>
          </div>
          <div>
            <p className="mb-1">리뷰 페이지에서 받아온 리뷰 클릭시 리뷰 페이지로</p>
            <small className="text-muted">- 두개</small>
          </div>
        </Card.Body>
      </Card>

      {/* 예약 섹션 */}
      <Card.Body>
        {reserveBtn}
      </Card.Body>
        
      {/* 모달: 이미지 확대 보기 */}
      <Modal show={showModal} onHide={handleModalClose} centered size="lg">
        <Modal.Header closeButton>
          {/* <Modal.Title></Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
          <div className="modalImageContainerJh">
            <button className="modalPrevButtonJh" onClick={handlePrevImage}>◀</button>
            <img
              src={images[selectedImageIndex]?.imageUrl}
              alt="Restaurant"
              style={{ width: '70%', height: 'auto' }}
            />
            <button className="modalNextButtonJh" onClick={handleNextImage}>▶</button>
          </div>

          {/* 이미지 썸네일 리스트 */}
          <div className="thumbnailListJh">
            {images.map((image, index) => (
              <img
                key={index}
                src={image.imageUrl}
                alt={`Thumbnail ${index}`}
                className={`thumbnailImageJh ${index === selectedImageIndex ? 'active' : ''}`}
                onClick={() => setSelectedImageIndex(index)}
              />
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </Container>
    </div>
  );
}

export default RestaurantsInfo;

