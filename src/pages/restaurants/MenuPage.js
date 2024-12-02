// src/Restaurants.js
import React, { useState, useEffect } from 'react';
import { Button, Form, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';  // useNavigate 임포트
import axios from 'axios';
import { fetchRestaurants } from './api';  // api.js에서 import
import { searchRestaurants } from './api';  // api.js에서 import
import Pagination from '../../components/restaurants/Pagination';

const MenuPage = () => {
  const [restaurants, setRestaurants] = useState([]);  // 레스토랑 목록 상태
  const [loading, setLoading] = useState(false);  // 로딩 상태
  const [error, setError] = useState(null);  // 에러 상태
  
  // 검색 조건 상태
  const [searchParams, setSearchParams] = useState({
    query: '',               // 검색어
    searchOption: 'name',    // 검색 조건 (기본값: 도시)
    name: '',
    city: '',                // 도시
    district: '',            // 구
    neighborhood: '',        // 동
    foodType: '',            // 음식 종류
    parkingAvailable: false, // 주차 가능 여부
    reservationAvailable: false, // 예약 가능 여부
    page: 1,
    size: 24,
  });
   // 페이지네이션 관련 상태
   const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지
   const [totalPages, setTotalPages] = useState(1);  // 총 페이지 수


  const navigate = useNavigate();  // navigate 훅을 사용하여 페이지 이동
  

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
  setSearchParams({
    ...searchParams,
    [name]: checked,
  });
};

// 페이지 변경 시 호출되는 함수
const handlePageChange = async (page) => {
  setCurrentPage(page); // 현재 페이지 업데이트
  if (searchParams.query) {
    await handleSearch(page);  // 검색일 경우 검색 실행
  } else {
    await fetchRestaurantsData(page);  // 검색이 아니면 전체 레스토랑 페이지네이션
  }
    
    // 페이지네이션 후 스크롤을 맨 위로 이동
    window.scrollTo(0, 0);
};
// 전체 레스토랑을 페이지네이션에 맞게 가져오는 함수
const fetchRestaurantsData = async (page = 1) => {
  setLoading(true); // 로딩 시작
  setError(null); // 이전 에러 초기화

  try {
    const response = await fetchRestaurants(page, 24); // 페이지네이션 적용
    if (response.content) {
      setRestaurants(response.content);  // 레스토랑 목록 업데이트
      setTotalPages(response.totalPages);  // 총 페이지 수 설정
    } else {
      setRestaurants([]);
      setTotalPages(1);
    }
  } catch (err) {
    console.error('레스토랑 목록을 가져오는 데 실패했습니다:', err);
    setError('레스토랑 목록을 가져오는 데 실패했습니다.');
  } finally {
    setLoading(false); // 로딩 종료
  }
};


  const handleSearch = async (page = 1) => {
    setLoading(true); // 로딩 시작
    setError(null); // 이전 에러 초기화

    // searchParams에서 필요한 값들을 추출합니다.
    const { query, searchOption, name, city, district, foodType,neighborhood, parkingAvailable, reservationAvailable } = searchParams;
  
    // 요청에 포함할 파라미터들을 저장할 params 객체를 준비합니다.
    const params = {
       page: page, // 검색 시 첫 페이지로 설정
       size: 24,
    };
  
    // query를 searchOption에 맞는 파라미터로 설정
    if (query && searchOption) {
      if (searchOption === 'name') {
        params.name = query;  // 도시 검색
      } else if (searchOption === 'city') {
        params.city = query;  // 도시 검색
      } else if (searchOption === 'district') {
        params.district = query;  // 동 검색
      } else if (searchOption === 'neighborhood') {
        params.neighborhood = query;  // 동 검색
      } else if (searchOption === 'foodType') {
        params.foodType = query;  // 음식 종류 검색
      }
    }
  
    // 다른 필터 조건들을 params에 추가
    if (name) params.name = name;  // 도시
    if (city) params.city = city;  // 도시
    if (district) params.district = district;  // 구
    if (foodType) params.foodType = foodType;  // 음식 종류
    if (neighborhood) params.neighborhood = neighborhood;  // 동
    if (parkingAvailable !== null) params.parkingAvailable = parkingAvailable;  // 주차 가능 여부
    if (reservationAvailable !== null) params.reservationAvailable = reservationAvailable;  // 예약 가능 여부
  
    try {
      const response = await searchRestaurants(params);
      if (response.content) {
        setRestaurants(response.content);  // 레스토랑 목록 업데이트
        setTotalPages(response.totalPages);  // 총 페이지 수 업데이트
      } else {
        setRestaurants([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('검색 오류:', err);
      setError('검색 중 오류가 발생했습니다.');
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // 전체 목록 보기 버튼 클릭 시, 검색 상태 초기화하고 전체 레스토랑 가져오기
  const handleViewAll = () => {
    // setSearchParams({
    //   query: '',
    //   searchOption: 'name',
    //   name: '',
    //   city: '',
    //   district: '',
    //   neighborhood: '',
    //   foodType: '',
    //   parkingAvailable: false,
    //   reservationAvailable: false,
    //   page: 1,
    //   size: 24,
    // });
    setCurrentPage(1);  // 첫 페이지로 이동
    fetchRestaurantsData(1);  // 전체 레스토랑 목록 가져오기
  };

  // 초기 데이터 로딩 (전체 레스토랑 불러오기)
  useEffect(() => {
    if (!searchParams.query) {
      fetchRestaurantsData(1);  // 첫 번째 페이지 로딩 (전체 목록)
    } else {
      handleSearch(1);  // 검색 조건에 맞는 데이터 로딩
    }
  }, []);  // 컴포넌트가 처음 마운트될 때 실행
  
  // 페이지가 바뀔 때마다 새로운 데이터를 가져옴
  useEffect(() => {
    if (!searchParams.query) {
      fetchRestaurantsData(currentPage);  // 전체 레스토랑 페이지네이션
    } else {
      handleSearch(currentPage);  // 검색 시 페이지네이션 적용
    }
  }, [currentPage]); // currentPage가 변경될 때마다 실행


  const handleCardClick = (restaurantId) => {
    console.log('Clicked restaurantId:', restaurantId);  // 값 확인
    navigate(`/restaurant/info/${restaurantId}`);  // 클릭 시 '/reservemain' 경로로 이동
  };

 
  return (
    <div>
         <h2>레스토랑 검색</h2>
 {/* 검색 폼 */}
 {/* 검색 폼 */}
    <Form onSubmit={(e) => { e.preventDefault(); handleSearch(1); }}>
      {/* 검색어 입력 */}
      <Form.Group controlId="formQuery">
        <Form.Label>검색어</Form.Label>
        <Form.Control
          type="text"
          placeholder="검색어 입력 (예: 음식, 도시 등)"
          name="query"
          value={searchParams.query}
          onChange={handleInputChange}
        />
      </Form.Group>

      {/* 검색 조건 (셀렉트 박스) */}
      <Form.Group controlId="formSearchOption">
        <Form.Label>검색 조건</Form.Label>
        <Form.Control
          as="select"
          name="searchOption"
          value={searchParams.searchOption}
          onChange={handleInputChange}
        >
                    <option value="name">가게명</option>
          <option value="city">도시</option>
          <option value="district">구</option>
          <option value="neighborhood">동</option>
          <option value="foodType">음식 종류</option>
        </Form.Control>
      </Form.Group>

        {/* 주차 가능 여부 체크박스 */}
        <Form.Group controlId="formParkingAvailable">
          <Form.Check
            type="checkbox"
            name="parkingAvailable"
            label="주차 가능"
            checked={searchParams.parkingAvailable}
            onChange={handleCheckboxChange}
          />
        </Form.Group>

        {/* 예약 가능 여부 체크박스 */}
        <Form.Group controlId="formReservationAvailable">
          <Form.Check
            type="checkbox"
            name="reservationAvailable"
            label="예약 가능"
            checked={searchParams.reservationAvailable}
            onChange={handleCheckboxChange}
          />
        </Form.Group>
      {/* 검색 버튼 */}
      <Button type="submit">검색</Button>
    </Form>
      {/* 전체 목록 보기 버튼 */}
      <Button variant="secondary" onClick={handleViewAll}>
        전체 목록 보기
      </Button>

      <h1>레스토랑 목록</h1>
    
      {loading && <p>로딩 중...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Row xs={1} sm={2} md={3} lg={4} xl={4} className="g-4">
        
        {restaurants.length > 0 ? (
        restaurants.map((restaurant) => (
          <Col key={restaurant.restaurantId}>
            <Card onClick={()=>handleCardClick(restaurant.restaurantId)}> {/* Card 클릭 시 handleCardClick 호출 */}
              <Card.Img variant="top" src={restaurant.image} />
              <Card.Body>
                <Card.Title>{restaurant.name}</Card.Title>
                <Card.Text>
                  <strong>주소:</strong> {restaurant.address}
                </Card.Text>
                <Card.Text>
                  <strong>음식 종류:</strong> {restaurant.foodType}
                </Card.Text>
                <Card.Text>
                  <strong>전화:</strong> {restaurant.phone}
                </Card.Text>
                <Card.Text>
                  <strong>주차 가능:</strong> {restaurant.parkingAvailable ? '가능' : '불가능'}
                </Card.Text>
                <Card.Text>
                  <strong>예약 가능:</strong> {restaurant.reservationAvailable ? '가능' : '불가능'}
                </Card.Text>
                <Card.Text>
                  <strong>평균 평점:</strong> {restaurant.averageRating || '없음'}
                </Card.Text>
                <Card.Text>
                  <strong>설명:</strong> {restaurant.description}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))
    ):(
        <p>레스토랑이 없습니다.</p>
    )
        }
      </Row>
          {/* 페이지네이션 컴포넌트 사용 */}
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
      />
    </div>
  );
};

export default MenuPage;
