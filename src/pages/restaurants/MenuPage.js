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
    searchOption: 'city',    // 검색 조건 (기본값: 도시)
    city: '',                // 도시
    district: '',            // 구
    neighborhood: '',        // 동
    foodType: '',            // 음식 종류
    parkingAvailable: false, // 주차 가능 여부
    reservationAvailable: false, // 예약 가능 여부
  });
   // 페이지네이션 관련 상태
   const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지
   const [totalPages, setTotalPages] = useState(1);  // 총 페이지 수
   const [pageRange, setPageRange] = useState([1, 10]); // 페이지 번호 범위

  // 컴포넌트가 마운트될 때 API 호출
  useEffect(() => {
    const getRestaurants = async () => {
      setLoading(true);  // 로딩 시작
      setError(null);     // 이전 에러 초기화
  
      try {
        // fetchRestaurants 호출
        const response = await fetchRestaurants(currentPage, 24);
  
        // 응답 데이터가 정상적으로 반환된 경우
        if (response && response.content) {
          console.log('fetchRestaurants 응답 데이터:', response); // 응답 데이터 확인용
          setRestaurants(response.content);  // 레스토랑 목록만 상태로 설정
          setTotalPages(response.totalPages); // 총 페이지 수 설정
        } else {
          setRestaurants([]); // content가 없으면 빈 배열
        }
      } catch (err) {
        setError('레스토랑을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);  // 로딩 종료
      }
    };
  
    getRestaurants();  // 함수 호출
  }, [currentPage]);  // currentPage가 변경될 때마다 호출
    
    // 페이지 범위 계산
    const calculatePageRange = (currentPage, totalPages) => {
      const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
      const endPage = Math.min(startPage + 9, totalPages);
      return [startPage, endPage];
    };
  const navigate = useNavigate();  // navigate 훅을 사용하여 페이지 이동

    // 페이지 버튼 클릭 시 페이지 변경
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);  // 새로운 페이지로 이동
    }
  };

  const handleCardClick = () => {
    navigate('/reservemain');  // 클릭 시 '/reservemain' 경로로 이동
  };

 // 검색어 입력 시 상태 업데이트
 const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };

  // 셀렉트 박스 변경 시 상태 업데이트
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value,
      query: '',  // 'searchOption'이 변경되면 query 값을 초기화
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

  const handleSearch = async (e) => {
    e.preventDefault();  // 폼 제출 기본 동작 막기
  
    // searchParams에서 필요한 값들을 추출합니다.
    const { query, searchOption, city, district, foodType, parkingAvailable, reservationAvailable } = searchParams;
  
    // axios로 보낼 URL을 준비합니다.
    const apiUrl = new URL('http://localhost:8080/api/restaurant/search');
  
    // 요청에 포함할 파라미터들을 저장할 params 객체를 준비합니다.
    const params = {};
  
    // query를 searchOption에 맞는 파라미터로 설정
    if (query) {
      if (searchOption === 'city') {
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
    if (parkingAvailable !== null) params.parkingAvailable = parkingAvailable;  // 주차 가능 여부
    if (reservationAvailable !== null) params.reservationAvailable = reservationAvailable;  // 예약 가능 여부
  
    // URLSearchParams를 사용하여 params 객체를 쿼리 스트링으로 변환합니다.
    apiUrl.search = new URLSearchParams(params).toString();
  
    // 콘솔로 확인
    console.log('axios로 전송할 URL:', apiUrl.toString());
  
    try {
      // API 호출
      const response = await axios.get(apiUrl.toString());
      console.log('검색 결과:', response.data);  // 응답 결과 확인
      setRestaurants(response.data);  // 레스토랑 상태 업데이트
    } catch (error) {
      console.error('검색 오류:', error);
    }
    // 페이지네이션 버튼을 렌더링
  const renderPagination = () => {
    const [startPage, endPage] = calculatePageRange(currentPage, totalPages);

    // 페이지 번호 목록 생성
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }}
  };
  
  
  



  return (
    <div>
         <h2>레스토랑 검색</h2>
 {/* 검색 폼 */}
 {/* 검색 폼 */}
    <Form onSubmit={handleSearch}>
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


      <h1>레스토랑 목록</h1>
    
      {loading && <p>로딩 중...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Row xs={1} sm={2} md={3} lg={3} xl={3} className="g-4">
        
        {restaurants && restaurants.length > 0 ? (
        restaurants.map((restaurant) => (
          <Col key={restaurant.restaurantId}>
            <Card onClick={handleCardClick}> {/* Card 클릭 시 handleCardClick 호출 */}
              {/* <Card.Img variant="top" src={item.imgSrc} /> */}
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
                  <strong>총 좌석 수:</strong> {restaurant.totalSeats}
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
