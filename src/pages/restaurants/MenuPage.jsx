import React, { useState, useEffect, useRef } from 'react';
import { Button, Row, Col, Card } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchRestaurants, getRestaurantImages, searchRestaurants } from './api'; 
import SearchBar from '../../components/restaurants/SearchBar';  
import Pagination from '../../components/restaurants/Pagination';
import "../../css/restaurants/MenuPage.css";

const MenuPage = () => {
  const [restaurants, setRestaurants] = useState([]);  // 레스토랑 목록
  const [loading, setLoading] = useState(false);        // 로딩 상태
  const [error, setError] = useState(null);             // 에러 상태
  const [searchParams, setSearchParams] = useState({
    query: '',               // 검색어
    searchOption: 'all',     // 검색 조건
    name: '',                // 레스토랑 이름
    city: '',                // 도시
    district: '',            // 구
    neighborhood: '',        // 동
    foodType: '',            // 음식 종류
    parkingAvailable: '',    // 주차 가능 여부
    reservationAvailable: '',// 예약 가능 여부
    page: 1,
    size: 24,
  });
  const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지
  const [totalPages, setTotalPages] = useState(1);    // 총 페이지 수
  const [restaurantImages, setRestaurantImages] = useState({});  // 레스토랑 이미지
  const navigate = useNavigate();
  const isRequestPending = useRef(false);
  const location = useLocation();
  const defaultImage = '/fc7ece8e8ee1f5db97577a4622f33975.jpg';  // 기본 이미지 경로

  // API 요청 함수: 레스토랑 검색
  const fetchRestaurantsByQuery = async (query, page = 1) => {
    if (isRequestPending.current) return;

    isRequestPending.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await searchRestaurants({ query, page, size: 24 });
      if (response.content) {
        setRestaurants(response.content);
        setTotalPages(response.totalPages);
      } else {
        setRestaurants([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('검색 오류:', err);
      setError('검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      isRequestPending.current = false;
    }
  };

  // 전체 레스토랑 데이터 가져오기
  const fetchRestaurantsData = async (page = 1) => {
    if (isRequestPending.current) return;

    isRequestPending.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await fetchRestaurants(page, 24);
      if (response.content) {
        setRestaurants(response.content);
        setTotalPages(response.totalPages);
        
        // 각 레스토랑에 대한 이미지 요청 (병렬 처리)
        const imagesData = await Promise.all(
          response.content.map(async (restaurant) => {
            const images = await getRestaurantImages(restaurant.restaurantId);
            return {
              restaurantId: restaurant.restaurantId,
              imageUrl: images.length > 0 ? images[0].imageUrl : defaultImage,
            };
          })
        );

        // 이미지 데이터를 restaurantImages 상태에 병합
        const imagesMap = imagesData.reduce((acc, { restaurantId, imageUrl }) => {
          acc[restaurantId] = imageUrl;
          return acc;
        }, {});
        setRestaurantImages(imagesMap);
      } else {
        setRestaurants([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('레스토랑 목록을 가져오는 데 실패했습니다:', err);
      setError('레스토랑 목록을 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false);
      isRequestPending.current = false;
    }
  };

  // 검색어 입력 시 상태 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };

  // 체크박스 상태 업데이트
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: checked ? true : "",  // 체크되면 'true', 체크 해제되면 '' (비어있는 상태)
    }));
  };

  // 페이지 변경 시 호출되는 함수
  const handlePageChange = async (page) => {
    setCurrentPage(page);

    if (searchParams.query) {
      await handleSearch(page);
    } else {
      await fetchRestaurantsData(page);
    }
    
    window.scrollTo(0, 0);
  };

  // 레스토랑 검색 실행
  const handleSearch = async (page = 1) => {
    if (isRequestPending.current) return;

    isRequestPending.current = true;
    setLoading(true);
    setError(null);

    const { query, searchOption, parkingAvailable, reservationAvailable } = searchParams;
    const params = {
      page: page,
      size: 24,
    };

    if (query && searchOption === 'all') {
      params.query = query;
    } else {
      if (query) {
        if (searchOption === 'name') params.name = query;
        if (searchOption === 'city') params.city = query;
        if (searchOption === 'district') params.district = query;
        if (searchOption === 'neighborhood') params.neighborhood = query;
        if (searchOption === 'foodType') params.foodType = query;
      }
    }

    // 체크박스 필터링
    if (parkingAvailable !== "") params.parkingAvailable = parkingAvailable;
    if (reservationAvailable !== "") params.reservationAvailable = reservationAvailable;

    try {
      const response = await searchRestaurants(params);

      if (response.content) {
        setRestaurants(response.content);
        setTotalPages(response.totalPages);
      } else {
        setRestaurants([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('검색 오류:', err);
      setError('검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      isRequestPending.current = false;
    }
  };

  // 레스토랑 카드 클릭 시 상세 페이지로 이동
  const handleCardClick = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  // 전체 목록 보기
  const handleViewAll = () => {
    setCurrentPage(1);
    fetchRestaurantsData(1);
  };

  useEffect(() => {
    const loadData = async () => {
      const params = new URLSearchParams(location.search);
      const query = params.get('query') || '';
      setSearchParams((prevParams) => ({
        ...prevParams,
        query: query,
      }));

      if (query) {
        await fetchRestaurantsByQuery(query, currentPage);
      } else {
        await fetchRestaurantsData(currentPage);
      }
    };

    loadData();
  }, [location.search, currentPage]);

  return (
    <div>
      <h2>레스토랑 검색</h2>

      <SearchBar
        searchParams={searchParams}
        handleInputChange={handleInputChange}
        handleCheckboxChange={handleCheckboxChange}
        handleSearch={handleSearch}
      />

      <Row className="align-items-center">
        <Col><h1>레스토랑 목록</h1></Col>
        <Col className="d-flex justify-content-end">
          <Button variant="secondary" onClick={handleViewAll}>전체 목록 보기</Button>
        </Col>
      </Row>

      {loading && <p>로딩 중...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Row xs={1} sm={2} md={3} lg={4} xl={4} className="g-4">
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
                    <Card.Title>{restaurant.name}</Card.Title>
                    <Card.Text><strong>주소:</strong> {restaurant.roadAddr || restaurant.jibunAddr}</Card.Text>
                    <Card.Text><strong>음식 종류:</strong> {restaurant.foodType}</Card.Text>
                    <Card.Text><strong>전화:</strong> {restaurant.phone}</Card.Text>
                    <Card.Text><strong>주차 가능:</strong> {restaurant.parkingAvailable ? '가능' : '불가능'}</Card.Text>
                    <Card.Text><strong>예약 가능:</strong> {restaurant.reservationAvailable ? '가능' : '불가능'}</Card.Text>
                    <Card.Text><strong>평균 평점:</strong> {restaurant.averageRating || '없음'}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })
        ) : (
          <p>레스토랑이 없습니다.</p>
        )}
      </Row>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default MenuPage;
