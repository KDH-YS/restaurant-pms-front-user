import React, { useState, useEffect, useRef } from 'react';
import { Button, Row, Col, Card, Container } from 'react-bootstrap';
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
  const [totalRestaurants, setTotalRestaurants] = useState(0);  // 총 레스토랑 수 상태
  const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지
  const [totalPages, setTotalPages] = useState(1);    // 총 페이지 수
  const [restaurantImages, setRestaurantImages] = useState({});  // 레스토랑 이미지
  const navigate = useNavigate();
  const isRequestPending = useRef(false);
  const location = useLocation();
  const defaultImage = '/fc7ece8e8ee1f5db97577a4622f33975.jpg';  // 기본 이미지 경로


  const fetchRestaurantsData = async (page) => {
    if (isRequestPending.current) return;
  
    isRequestPending.current = true;
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetchRestaurants(page, 24);
      if (response.content) {
        setRestaurants(response.content);
        loadRestaurantImages(response.content);
        setTotalPages(response.totalPages);
        setTotalRestaurants(response.totalElements);  // 전체 레스토랑 수 업데이트

        // 이미지는 별도의 함수에서 처리
      } else {
        setRestaurants([]);
        setTotalPages(1);
        setTotalRestaurants(0);  // 전체 레스토랑 수 업데이트
      }
    } catch (err) {
      console.error('레스토랑 목록을 가져오는 데 실패했습니다:', err);
      setError('레스토랑 목록을 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false);
      isRequestPending.current = false;
    }
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
  const handleFilterToggle = (filter) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      [filter]: prevParams[filter] ? false : true,  // 기존 값이 true면 false로, 아니면 true로 변경
    }));
  };
  // 페이지 변경 시 호출되는 함수
  const handlePageChange = async (page) => {
    if(page === currentPage) return;

    setCurrentPage(page);
    await handleSearch(page);
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

    if (query) {
      if (searchOption === 'all') {
        params.query = query;
      } else {
        params[searchOption] = query;  // 예: searchOption === 'name'일 경우 params.name = query
      }
    }

    // 체크박스 필터링
    if (parkingAvailable !== "") params.parkingAvailable = parkingAvailable;
    if (reservationAvailable !== "") params.reservationAvailable = reservationAvailable;

    try {
      const response = await searchRestaurants(params);

      if (response.content) {
        setRestaurants(response.content);
        loadRestaurantImages(response.content);
        setTotalPages(response.totalPages);
        setTotalRestaurants(response.totalElements);  // 검색 조건에 맞는 레스토랑 수 업데이트
        setCurrentPage(page);  // 검색 후 currentPage를 올바르게 업데이트
      } else {
        setRestaurants([]);
        setTotalPages(1);
        setTotalRestaurants(0);
        setCurrentPage(1);  // 검색 결과가 없으면 1페이지로 설정
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
     setSearchParams({
      query: '',
      searchOption: 'name',
      name: '',
      city: '',
      district: '',
      neighborhood: '',
      foodType: '',
      parkingAvailable: false,
      reservationAvailable: false,
      page: 1,
      size: 24,
    });
    setCurrentPage(1);
    fetchRestaurantsData(1);
  };

const clearQueryInUrl = () => {
  const currentPath = location.pathname; // 현재 경로 가져오기
  const params = new URLSearchParams(location.search);
  params.delete('query'); // 'query' 파라미터만 삭제

  // 변경된 URL로 이동하되, 쿼리값은 비워둡니다.
  navigate(`${currentPath}?${params.toString()}`, { replace: true });
};

  useEffect(() => {
    const loadData = async () => {
      const params = new URLSearchParams(location.search);
      const query = params.get('query') || '';
      const page = parseInt(params.get('page')) || 1;  // page가 없으면 기본값 1

      setSearchParams((prevParams) => ({
        ...prevParams,
        query: query,
        page: page
      }));
      // query가 있으면 검색 실행, 없으면 전체 레스토랑 로드
    if (query) {
      console.log("검색 실행");
      await fetchRestaurantsByQuery(query, page);
      clearQueryInUrl();  
    } else {
      console.log("전체 레스토랑 로드");
      await fetchRestaurantsData(1);  // 전체 레스토랑 로드
    }
  };
  
    loadData();
  }, []);

  
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
      setTotalRestaurants(response.totalElements);  // 총 레스토랑 수 설정
    } else {
      setRestaurants([]);
      setTotalPages(1);
      setTotalRestaurants(0);
    }
  } catch (err) {
    console.error('검색 오류:', err);
    setError('검색 중 오류가 발생했습니다.');
  } finally {
    setLoading(false); // 로딩 종료
    isRequestPending.current = false; // 요청 종료
  }
  
};
  return (
    <div>
    <Container>
      {/* <h2>레스토랑 검색</h2> */}

      <SearchBar
        searchParams={searchParams}
        handleInputChange={handleInputChange}
        handleFilterToggle={handleFilterToggle}
        handleSearch={handleSearch}
      />
    </Container>
    <hr className='border-dark mt-4'/>
    <Container>
      <Row className="align-items-center mt-4">
        <Col><div className="mb-3">
      <strong>'{searchParams.query || '전체'}' {totalRestaurants}개의 레스토랑</strong>
    </div></Col>
        <Col className="d-flex justify-content-end mb-3">
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
                    {/* <Card.Text><strong>전화:</strong> {restaurant.phone}</Card.Text> */}
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
                    {/* <Card.Text><strong>평균 평점:</strong> {restaurant.averageRating || '없음'}</Card.Text> */}
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
    </Container>
    </div>
  );
};

export default MenuPage;
