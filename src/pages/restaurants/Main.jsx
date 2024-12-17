import React, { useEffect, useState } from 'react';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/restaurants/MainPage.css';
import { fetchRestaurants, getRestaurantImages } from './api';

function Main() {
  const [query, setQuery] = useState('');
  const [restaurants, setRestaurants] = useState([]);  // 레스토랑 목록 상태
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);  // 로딩 상태
  const [error, setError] = useState(null);  // 에러 상태
  const defaultImage = '/fc7ece8e8ee1f5db97577a4622f33975.jpg';  // 기본 이미지 경로
  const [restaurantImages, setRestaurantImages] = useState({});  // 레스토랑 이미지

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query) {
      // 검색어를 URL 쿼리 파라미터로 전달하여 MenuPage로 이동
      navigate(`/restaurant?query=${encodeURIComponent(query)}`);
    }
  };


  // 레스토랑 데이터 가져오기
  const fetchRestaurantsData = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchRestaurants(page, 4);
      if (response.content) {
        setRestaurants(response.content);
        loadRestaurantImages(response.content);
      } else {
        setRestaurants([]);
      }
    } catch (err) {
      console.error('레스토랑 목록을 가져오는 데 실패했습니다:', err);
      setError('레스토랑 목록을 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

   // 레스토랑 카드 클릭 시 상세 페이지로 이동
   const handleCardClick = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  const loadRestaurantImages = async (restaurants) => {
    const imagesData = await Promise.all(
      restaurants.map(async (restaurant) => {
        const images = await getRestaurantImages(restaurant.restaurantId);
        const representativeImage = images.find(image => image.imageOrder);  // 대표 이미지가 있으면 그것을 사용
  
        const imageUrl = representativeImage ? representativeImage.imageUrl : (images.length > 0 ? images[0].imageUrl : defaultImage);
  
        return {
          restaurantId: restaurant.restaurantId,
          imageUrl: imageUrl,
        };
      })
    );
  
    // 이미지 데이터를 restaurantImages 상태에 병합
    const imagesMap = imagesData.reduce((acc, { restaurantId, imageUrl }) => {
      acc[restaurantId] = imageUrl;
      return acc;
    }, {});
    
    setRestaurantImages(imagesMap);
  };

  useEffect(() => {
      fetchRestaurantsData();  // 전체 레스토랑 페이지네이션
  }, []);

  return (
    <div className="App">
      {/* 메인 이미지 배경 */}
      <Container fluid className="main-banner p-0 position-relative">
        <img src="/img/foodimg1.jpg" alt="Food" className="w-100 main-image" />

        {/* 검색 영역 */}
        <div className="search-container">
          <h2 className="search-title text-white mb-3">Rechelin에서 원하는
            <br/>맛집을 찾아보세요.</h2>
          <Form className="d-flex" onSubmit={handleSearch}>
            <Form.Control
              type="text"
              className="search-input"
              placeholder="전체 검색"
              value={query}
              onChange={handleInputChange}
            />
            {/* 검색 아이콘 */}
            <img src="/icons/search.svg" alt="검색 아이콘" className="search-icon position-absolute" />
            
          </Form>
        </div>
      </Container>

      {/* 레스토랑 섹션 */}
      <Container className="js-shop">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="section-title">레스토랑</h2>
          <Link to="" className="mb-0 d-flex align-items-center">전체보기 <img src="/icons/right.svg" alt="" className="js-right ms-2" /></Link>
        </div>
      <Row xs={1} sm={2} md={2} lg={4} xl={4} className="g-4 mt-3 restaurant-card">
        {restaurants.length > 0 ? (
          restaurants.map((restaurant) => {
            const imageUrl = restaurantImages[restaurant.restaurantId] || defaultImage;
            return (
              <Col key={restaurant.restaurantId}>
                <Card onClick={() => handleCardClick(restaurant.restaurantId)}>
                  <div className="cardImageContainer">
                    <Card.Img variant="top" src={imageUrl} className="cardImage" />
                  </div>
                  <Card.Body>
                    <Card.Title className='listNameJh mb-0'>{restaurant.name}</Card.Title>
                    <Card.Text className='listFoodJh text-muted small'> {restaurant.foodType}</Card.Text>
                    <Card.Text className='listAddrJh small'> {restaurant.roadAddr || restaurant.jibunAddr}</Card.Text>
                    <Card.Text className='small'>
                      <span 
                        className={`badge ${restaurant.reservationAvailable ? 'bg-danger' : ''} rounded-pill me-1 px-2 py-2`}
                      >
                        {restaurant.reservationAvailable ? '예약가능' : ''}
                      </span>
                      <span 
                          className={`badge ${restaurant.parkingAvailable ? 'bg-success' : ''} rounded-pill me-1 px-2 py-2`}
                        >
                          {restaurant.parkingAvailable ? '주차가능' : ''}
                        </span>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        ) : (
          <p>레스토랑이 없습니다.</p>
        )}
      </Row>

      </Container>

      {/* 배너 섹션 */}
      <Container fluid className="p-0">
        <div className="js-banner d-flex align-items-center">
          <img src="/img/foodimg1.jpg" alt="Restaurant" />
          <div className="js-banner-textarea">
            <h2>나의 가게 등록하기</h2>
            <p>레스토랑 업주님이시라면 잊지말고 등록하여
              <br/> 편리한 예약 시스템을 이용 해보세요.
            </p>
          </div>
          <a href="/가게등록" className="d-flex align-items-center js-together">
            <p className="">Rechelin과 함께하기</p>
            <img src="/icons/right-white.svg" alt=""/>
          </a>
        </div>
      </Container>

      {/* 공지사항 섹션 */}
      <Container fluid className="announcement-section py-3 bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="section-title">공지사항</h2>
          <Link to="" className="mb-0 d-flex align-items-center">전체보기 <img src="/icons/right.svg" alt="" className="js-right ms-2" /></Link>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">테스트입니다. <span className="text-muted">2024-12-13</span></li>
          <li className="list-group-item">테스트입니다. <span className="text-muted">2024-12-13</span></li>
          <li className="list-group-item">테스트입니다. <span className="text-muted">2024-12-13</span></li>
        </ul>
      </Container>
    </div>
  );
}

export default Main;
