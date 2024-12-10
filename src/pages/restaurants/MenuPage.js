// src/Restaurants.js
import React, { useState, useEffect, useRef } from 'react';
import { Button, Row, Col, Card } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchRestaurants, getRestaurantImages } from './api';  // api.js에서 import
import { searchRestaurants } from './api';  // api.js에서 import
import SearchBar from '../../components/restaurants/SearchBar';  // SearchBar 컴포넌트 import
import Pagination from '../../components/restaurants/Pagination';

const MenuPage = () => {
  const [restaurants, setRestaurants] = useState([]);  // 레스토랑 목록 상태
  const [loading, setLoading] = useState(false);  // 로딩 상태
  const [error, setError] = useState(null);  // 에러 상태
  const [searchParams, setSearchParams] = useState({
    query: '',               // 검색어
    searchOption: 'all',    // 검색 조건 (기본값: 도시)
    name: '',
    city: '',                // 도시
    district: '',            // 구
    neighborhood: '',        // 동
    foodType: '',            // 음식 종류
    parkingAvailable: '', // 주차 가능 여부
    reservationAvailable: '', // 예약 가능 여부
    page: 1,
    size: 24,
  });

  const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지
  const [totalPages, setTotalPages] = useState(1);  // 총 페이지 수
  const [restaurantImages, setRestaurantImages] = useState({}); // 레스토랑 이미지 상태 저장

  const navigate = useNavigate();  // navigate 훅을 사용하여 페이지 이동
  const isRequestPending = useRef(false); // 요청 중인지 여부를 추적
  const location = useLocation(); // URL에서 파라미터를 가져오기 위한 훅
  const defaultImage = '/fc7ece8e8ee1f5db97577a4622f33975.jpg';  // 기본 이미지 경로

/// API 요청 함수: URL에서 query 값을 받아서 검색하는 함수
const fetchRestaurantsByQuery = async (query, page = 1) => {
  if (isRequestPending.current) return; // 요청이 이미 진행 중이면 중단

  isRequestPending.current = true; // 요청 시작
  setLoading(true); // 로딩 시작
  setError(null); // 이전 에러 초기화

  try {
    const response = await searchRestaurants({ query, page, size: 24 });
    if (response.content) {
      setRestaurants(response.content);  // 검색된 레스토랑 목록 업데이트
      setTotalPages(response.totalPages);  // 총 페이지 수 설정
    } else {
      setRestaurants([]);
      setTotalPages(1);
    }
  } catch (err) {
    console.error('검색 오류:', err);
    setError('검색 중 오류가 발생했습니다.');
  } finally {
    setLoading(false); // 로딩 종료
    isRequestPending.current = false; // 요청 종료
  }
  
};

 // URL에서 query를 제거하는 함수
 const clearQueryInUrl = () => {
  const currentPath = location.pathname; // 현재 경로 가져오기
  navigate(currentPath, { replace: true });  // 현재 경로로 이동하여 query 파라미터 제거
};

useEffect(() => {
  const loadData = async () => {
    // URL에서 query 파라미터를 읽어옴
    const params = new URLSearchParams(location.search);
    const query = params.get('query') || '';  // query가 없으면 빈 문자열로 설정
    setSearchParams((prevParams) => ({
      ...prevParams,
      query: query,
    }));

    // query가 있으면 검색 실행, 없으면 전체 레스토랑 로드
    if (query) {
      await fetchRestaurantsByQuery(query, currentPage);
      clearQueryInUrl();  // 검색 완료 후 URL에서 query 파라미터 제거
    } else {
      await fetchRestaurantsData(currentPage);  // 전체 레스토랑 로드
    }
  };

  loadData();
}, [location.search, currentPage]);  // location.search나 currentPage가 변경될 때마다 실행

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
    if (isRequestPending.current) return; // 요청이 이미 진행 중이면 중단

    isRequestPending.current = true; // 요청 시작
    setLoading(true); // 로딩 시작
    setError(null); // 이전 에러 초기화

    try {
      const response = await fetchRestaurants(page, 24); // 페이지네이션 적용
      if (response.content) {
        setRestaurants(response.content);  // 레스토랑 목록 업데이트
        setTotalPages(response.totalPages);  // 총 페이지 수 설정
       // 각 레스토랑에 대한 이미지 요청 (병렬로 처리)
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
      setRestaurantImages(imagesMap); // 레스토랑 ID와 이미지 URL을 매핑하여 저장
      } else {
        setRestaurants([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('레스토랑 목록을 가져오는 데 실패했습니다:', err);
      setError('레스토랑 목록을 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false); // 로딩 종료
      isRequestPending.current = false; // 요청 종료
    }
  };

 // 레스토랑 검색 API
const handleSearch = async (page = 1) => {
  if (isRequestPending.current) return; // 요청이 이미 진행 중이면 중단

  isRequestPending.current = true; // 요청 시작

  setLoading(true);  // 로딩 시작
  setError(null);    // 이전 에러 초기화

  const { query, searchOption, parkingAvailable, reservationAvailable } = searchParams;

  const params = {
    page: page,
    size: 24,  // 페이지 크기
  };

  // 전체 조건 (query에 맞는 모든 조건으로 검색)
  if (query && searchOption === 'all') {
    params.query = query;  // 전체 검색
  } else {
    // 검색어 조건에 맞게 검색
    if (query) {
      if (searchOption === 'name') {
        params.name = query;  // 가게명 검색
      } else if (searchOption === 'city') {
        params.city = query;  // 도시 검색
      } else if (searchOption === 'district') {
        params.district = query;  // 구 검색
      } else if (searchOption === 'neighborhood') {
        params.neighborhood = query;  // 동 검색
      } else if (searchOption === 'foodType') {
        params.foodType = query;  // 음식 종류 검색
      }
    }
  }

  // 체크박스 필터링 (값이 비어있지 않으면 필터에 추가)
  if (parkingAvailable !== "") params.parkingAvailable = parkingAvailable;
  if (reservationAvailable !== "") params.reservationAvailable = reservationAvailable;

  try {
    // `searchRestaurants`를 사용하여 검색
    const response = await searchRestaurants(params);

    if (response.content) {
      setRestaurants(response.content);  // 검색된 레스토랑 목록 업데이트
      setTotalPages(response.totalPages);  // 총 페이지 수 설정
    } else {
      setRestaurants([]);
      setTotalPages(1);
    }
  } catch (err) {
    console.error('검색 오류:', err);
    setError('검색 중 오류가 발생했습니다.');
  } finally {
    setLoading(false);  // 로딩 종료
    isRequestPending.current = false; // 요청 종료
  }
};

  const handleCardClick = (restaurantId) => {
    console.log('Clicked restaurantId:', restaurantId);
    navigate(`/restaurant/${restaurantId}`);
  };

  const handleViewAll = () => {
    setCurrentPage(1);
    fetchRestaurantsData(1);
  };

  return (
    <div>
      <h2>레스토랑 검색</h2>

      {/* 검색 바 컴포넌트 */}
      <SearchBar
        searchParams={searchParams}
        handleInputChange={handleInputChange}
        handleCheckboxChange={handleCheckboxChange}
        handleSearch={handleSearch}
      />

      {/* 전체 목록 보기 버튼 */}
      <Button variant="secondary" onClick={handleViewAll}>
        전체 목록 보기
      </Button>

      <h1>레스토랑 목록</h1>
      {loading && <p>로딩 중...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Row xs={1} sm={2} md={3} lg={4} xl={4} className="g-4">
      {restaurants.length > 0 ? (
        restaurants.map((restaurant) => {
          // 각 레스토랑에 맞는 이미지 URL을 가져옵니다
          const imageUrl = restaurantImages[restaurant.restaurantId] || defaultImage;  // 해당 레스토랑의 대표 이미지 URL 가져오기
          return (
            <Col key={restaurant.restaurantId}>
              <Card onClick={() => handleCardClick(restaurant.restaurantId)}>
                <Card.Img
                  variant="top"
                  src={imageUrl} // 이미지 URL 설정
                />
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
                </Card.Body>
              </Card>
            </Col>
          );
        })
      ) : (
        <p>레스토랑이 없습니다.</p>
      )}
    </Row>

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default MenuPage;
