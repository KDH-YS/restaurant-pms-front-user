import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { ArrowLeft, StarFill } from 'react-bootstrap-icons';
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
  const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{height:"20px"}}>
      <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/>
    </svg>
  );
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
      return <p className="text-muted">오늘의 영업시간 정보가 없습니다.</p>;
    }

  
    setOpen(Number(todaySchedule.isOpen) === 1);
  
    return (
      <div key={todaySchedule.scheduleId} className="mb-3">
        {/* <h6 className="mb-2">{todaySchedule.openDate}</h6> */}
        {/* <h6 className="mb-2">{Number(todaySchedule.isOpen) === 1 ? '영업 중' : '휴무'}</h6> */}
        <span 
          className={`badge ${Number(todaySchedule.isOpen) === 1 ? 'bg-primary' : 'bg-danger'} mb-2 px-2 py-2`}
          >
            {Number(todaySchedule.isOpen) === 1 ? 'OPEN' : 'CLOSE'}
            </span>
        <p className="mb-1">
          <span className='badge bg-secondary'>Open-Time</span> {formatTime(todaySchedule.startTime)} - {formatTime(todaySchedule.endTime)}
        </p>
        {todaySchedule.breakStart && todaySchedule.breakEnd && (
          <p className="mb-0">
            <span className='badge bg-secondary'>Break-Time</span> {formatTime(todaySchedule.breakStart)} - {formatTime(todaySchedule.breakEnd)}
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
          title="가게에 문의해주세요"
          disabled
        >
          예약하기
        </Button>
      );
    }
  }, [open]);

  const handleGoBack = () => {
    navigate(-1);  // 한 페이지 뒤로 가기
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <Container className="text-center py-5"><h3 className="text-danger">{error}</h3></Container>;

  return (
    <div>
     
       {/* 이미지 갤러리 */}
       {images.length > 0 && (
        <div className="imageGalleryJh mb-4">
          {/* <h3>식당 이미지</h3> */}
          <Row>
        {/* 이미지를 3개까지 표시 (기본 이미지 포함) */}
        {images.slice(0, 3).map((image, index) => (
          <Col key={index} xs={4} sm={4} md={4} lg={4} className="p-0" style={{maxHeight:"500px"}}>
            <Card className="galleryCardJh" style={{maxHeight:"500px"}}>
              <Container className="galleryImageContainerJh" >
                <Card.Img
                style={{maxHeight:"500px"}}
                  variant="top"
                  src={image.imageUrl || '/fc7ece8e8ee1f5db97577a4622f33975.jpg'} // 기본 이미지 경로
                  alt="식당 이미지"
                  className="galleryImageJh"
                  onClick={() => handleImageClick(index)}
                />
              </Container>
            </Card>
          </Col>
        ))}
        
        {/* 부족한 이미지를 기본 이미지로 채워주기 */}
        {images.length < 3 && (
          Array.from({ length: 3 - images.length }).map((_, index) => (
            <Col key={`default-${index}`} xs={4} sm={4} md={4} lg={4} className="mb-4 p-0"style={{maxHeight:"500px"}}>
              <Card className="galleryCardJh"style={{maxHeight:"500px"}}>
                <Container className="galleryImageContainerJh">
                  <Card.Img
                  style={{maxHeight:"500px"}}
                    variant="top"
                    src='/fc7ece8e8ee1f5db97577a4622f33975.jpg' // 기본 이미지
                    alt="기본 식당 이미지"
                    className="galleryImageJh"
                  />
                </Container>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* 더 보기 버튼 (조건부로 표시) */}
      {images.length > 3 && (
        <Button
          variant=""
          className="moreImagesBtnJh"
          onClick={() => handleImageClick(3)}
        >
          +{images.length - 3}
        </Button>
      )}
       {/* 뒤로가기 버튼 */}
       <Button 
        variant="link" 
        onClick={handleGoBack} 
        className="go-back-btn"
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          background: 'transparent',
          border: 'none',
          fontSize: '30px',
          color: 'white',
          padding: '0',
        }}
      >
        <ArrowLeft /> {/* 아이콘 사용 */}
      </Button>
    </div>
  )}

  {/* 이미지가 아예 없을 경우 기본 이미지 3개 */}
  {images.length === 0 && (
    <div className="imageGalleryJh">
      <Row>
        {/* 기본 이미지 3개 추가 */}
        {Array.from({ length: 3 }).map((_, index) => (
          <Col key={`default-${index}`} xs={4} sm={4} md={4} lg={4} className="mb-4 p-0"style={{maxHeight:"500px"}}>
            <Card className="galleryCardJh"style={{maxHeight:"500px"}}>
              <Container className="galleryImageContainerJh ">
                <Card.Img
                style={{maxHeight:"500px"}}
                  variant="top"
                  src='/fc7ece8e8ee1f5db97577a4622f33975.jpg' // 기본 이미지
                  alt="기본 식당 이미지"
                  className="galleryImageJh"
                />
              </Container>
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
        {/* <div className="d-flex justify-content-center gap-1">
          {[...Array(5)].map((_, i) => (
            <StarFill 
              key={i} 
              className="text-warning" 
              style={{ opacity: i < (restaurant?.averageRating || 0) ? 1 : 0.3 }}
            />
          ))}
        </div> */}
        <div>
        {/* <h2 className="h5">매장소개</h2> */}
        <p className="text-muted small mt-4">{restaurant?.description}</p>
        </div>
      </div>

      <Row style={{marginBottom:"30px"}}>
        {/* 왼쪽 정보 섹션 */}
        <Col md={7}>
          <Card className="mb-4 bg-light" style={{height:"100%"}}>
            <Card.Body>
              

              <div className="mb-2">
                {/* <h3 className="h6 mb-3">주소</h3> */}
                <p className="mb-3 fw-semibold medium">{restaurant?.roadAddr || restaurant?.jibunAddr}</p>
                {/* <p className="mb-3">{restaurant?.roadAddr}</p> */}
                <p className="mb-3 me-3 text-muted small"><PhoneIcon/> {restaurant?.phone}</p>
                <p className="mb-3 me-3 text-muted small"><img src="/icons/chair.png" alt="" style={{height:"23px"}}/> {restaurant?.totalSeats}석</p>
              </div>

              <div className="mb-4">
                {formatSchedule}
              </div>
              <hr className='border-dark mt-4'/>
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

