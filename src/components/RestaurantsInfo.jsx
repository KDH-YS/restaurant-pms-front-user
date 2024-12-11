import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, CardBody } from 'react-bootstrap';
import { StarFill } from 'react-bootstrap-icons';
import { fetchRestaurantDetail, fetchRestaurantMenu, fetchRestaurantSchedule } from '../pages/restaurants/api';
import { restaurantStore } from 'store/restaurantStore';
import { useAuthStore } from 'store/authStore';
<<<<<<< HEAD
import Map from './Map';
import Restaurantimg from 'img/restaurant.jpg'
=======
import { Link } from "react-router-dom"

function RestaurantsInfo() {
  const {token} = useAuthStore();
  const { restaurantId } = useParams();  // URL에서 restaurantId 받기
  const navigate = useNavigate();  // 네비게이션 함수
>>>>>>> front/js

function RestaurantsInfo() {
  const { token } = useAuthStore();
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const { restaurant, setRestaurant } = restaurantStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menus, setMenus] = useState([]);
  const [schedule, setSchedule] = useState(null);

  const handleReserveClick = () => {
    navigate('/reserve');
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [restaurantData, menuData, scheduleData] = await Promise.all([
          fetchRestaurantDetail(restaurantId),
          fetchRestaurantMenu(restaurantId, token),
          fetchRestaurantSchedule(restaurantId, token)
        ]);
        setRestaurant(restaurantData);
        setMenus(menuData);
        setSchedule(scheduleData);
      } catch (err) {
        setError('정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchData();
    }
  }, [restaurantId, token, setRestaurant]);

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

  if (loading) return (
    <Container className="text-center py-5">
      <h3>로딩 중...</h3>
    </Container>
  );

  if (error) return (
    <Container className="text-center py-5">
      <h3 className="text-danger">{error}</h3>
    </Container>
  );

  return (
    <Container className="py-4">
      {/* 헤더 이미지 */}
      <Card className="border-0 mb-4">
        <Card.Img 
          src={Restaurantimg}
          alt="레스토랑 내부" 
          className="restaurant-header-img"
          style={{ height: '300px', objectFit: 'cover' }}
        />
      </Card>

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
<<<<<<< HEAD
          <div>
            <p className="mb-1">리뷰 페이지에서 받아온 리뷰 클릭시 리뷰 페이지로</p>
            <small className="text-muted">- 두개</small>
=======


        </section>

        {/* 하단: 리뷰 구역 */}
        <section className="reviews">
          <h2>Reviews</h2>
          <Link to="/review/shopReview"><p>전체보기</p></Link>
          <div className="review">
            <p>리뷰 페이지에서 받아온 리뷰 클릭시 리뷰 페이지로</p>
            <span> - 작성자</span>
>>>>>>> front/js
          </div>
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
    </Container>
  );
}

export default RestaurantsInfo;

