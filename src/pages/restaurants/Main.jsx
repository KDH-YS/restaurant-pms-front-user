import React, { useEffect, useRef, useState } from 'react';
import { Modal,Button, Form, Container, Row, Col, ListGroupItem, ListGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/restaurants/MainPage.css';
import { fetchRestaurants, getRestaurantImages } from './api';
import axios from 'axios';

function Main() {
  const [query, setQuery] = useState('');
  // 레스토랑
  const [restaurants, setRestaurants] = useState([]);  // 레스토랑 목록
  const [restaurantImages, setRestaurantImages] = useState({});  // 레스토랑 이미지
  const [loading, setLoading] = useState(false);        // 로딩 상태
  const [error, setError] = useState(null);             // 에러 상태
  const isRequestPending = useRef(false);
  const defaultImage = '/fc7ece8e8ee1f5db97577a4622f33975.jpg';  // 기본 이미지 경로
  const [notices, setNotices] = useState([]);           // 공지사항 상태
  const [totalPages, setTotalPages] = useState(0);      // 전체 페이지 수
  const [selectedNotice, setSelectedNotice]= useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // 검색 이벤트 핸들러
  const handleInputChange = (e) => setQuery(e.target.value);
  const handleSearch = (e) => {
    e.preventDefault();
    if (query) navigate(`/restaurant?query=${query}`);
  };

  // 전체 레스토랑 데이터 가져오기
  const fetchRestaurantsData = async () => {
    if (isRequestPending.current) return;

    isRequestPending.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await fetchRestaurants(5);
      if (response.content) {
        const limitedRestaurants = response.content.slice(0, 5); // 처음 5개 가져오기
        setRestaurants(limitedRestaurants);

        // 각 레스토랑에 대한 이미지 요청 (병렬 처리)
        const imagesData = await Promise.all(
          limitedRestaurants.map(async (restaurant) => {
            const images = await getRestaurantImages(restaurant.restaurantId);
            const representativeImage = images.find((image) => image.imageOrder);

            // 대표 이미지가 없으면 첫 번째 이미지를 사용
            const imageUrl = representativeImage
              ? representativeImage.imageUrl
              : images.length > 0
              ? images[0].imageUrl
              : defaultImage;

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
      } else {
        setRestaurants([]);
      }
    } catch (err) {
      console.error("레스토랑 목록을 가져오는 데 실패했습니다:", err);
      setError("레스토랑 목록을 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
      isRequestPending.current = false;
    }
  };

  useEffect(() => {
    fetchRestaurantsData(); 
    fetchNotices()
  }, []);

  const imageWrapperRef = useRef(null); // 이미지 컨테이너 Ref

  useEffect(() => {
    const interval = setInterval(() => {
      if (imageWrapperRef.current) {
        const imageWrapper = imageWrapperRef.current;
        const firstImage = imageWrapper.children[0]; // 첫 번째 이미지 선택

        // 1초 후 첫 번째 이미지를 마지막으로 이동
        setTimeout(() => {
          imageWrapper.appendChild(firstImage); // 첫 번째 이미지를 append
        }, 1000);

        // 이동 후 위치 초기화
        setTimeout(() => {
          imageWrapper.style.transition = "none";
        }, 1000);
      }
    }, 5000); // 5초마다 실행

    return () => clearInterval(interval); // 정리 함수
  }, []);
const fetchNotices = (pageIndex = 1) => {
  axios.get('http://jennysoft.kr:8080/board', {
    params: {
      bbsId: 'BBSMSTR_AAAAAAAAAAAA',
      pageIndex: pageIndex,
      searchCnd: 0,
      searchWrd: ' '
    }
  })
  .then(response => {
    console.log(response);
    if (response.data.resultCode === 200) {
      const resultList = response.data.result.resultList.slice(0, 3); // 3개만 가져오기
      const totalRecordCount = response.data.result.resultCnt;
      const totalPages = Math.ceil(totalRecordCount / 10); // 페이지 수 계산
      setNotices(resultList);
      setTotalPages(totalPages);
    } else {
      throw new Error('API 응답 오류');
    }
  })
  .catch(error => {
    console.error('API 호출 중 오류 발생:', error);
  });
};
const fetchNoticeDetail = (bbsId, nttId) => {
  axios.get(`http://jennysoft.kr:8080/board/${bbsId}/${nttId}`)
    .then(response => {
      if (response.data.resultCode === 200) {
        setSelectedNotice(response.data.result.boardVO); // 응답값에서 공지사항 데이터 추출
        setShowModal(true); // 모달 열기
      } else {
        console.error('공지사항을 가져오는 데 실패했습니다.');
      }
    })
    .catch(error => {
      console.error('공지사항 상세 정보를 가져오는 데 실패했습니다:', error);
    });
};
  const ResImg = [
    "https://search.pstatic.net/common/?autoRotate=true&type=w278_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20221114_279%2F1668411417939IQUlP_JPEG%2F601522EE-8C9D-48E6-9205-D10B8887E07F.jpeg",
    "https://search.pstatic.net/common/?autoRotate=true&type=w278_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220505_190%2F165169820357548FLT_JPEG%2FScreenshot_20210825-093244_Instagram_resized.jpg",
    "https://search.pstatic.net/common/?autoRotate=true&type=w278_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20211230_220%2F1640873782183b88p5_JPEG%2FOld_Meets_New_%25B7%25CE%25B0%25ED-02.jpg",
    "https://search.pstatic.net/common/?autoRotate=true&type=w278_sharpen&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20241103_88%2F17306136505694RmW9_JPEG%2F1000009833.jpg",
    "https://search.pstatic.net/common/?autoRotate=true&type=w278_sharpen&src=https%3A%2F%2Fsearchad-phinf.pstatic.net%2FMjAyNDAyMjRfMjMg%2FMDAxNzA4NzQzMjUzNTA3.RQ5AtZR_ik2FheavCnJ0nA-XAd_l5w62-VGrSEuI_KUg.R8I2Z7_aBfbhUMEGJfX3nQmbnrWrxnIr2W1JDRLvUWkg.PNG%2F3038352-982b6b0c-f66c-49db-aed7-eff835913286.png%26_type%3Dad"
  ];
  return (
    <div className="App">
      <Container fluid className="main-banner p-0">
      <div className="image-wrapper" ref={imageWrapperRef}>
        {restaurants.map((restaurant, index) => (
          <div key={restaurant.restaurantId || index} className="image-container">
            {/* 이미지 */}
            <img
              src={ResImg[index % ResImg.length]} // 대표 이미지 또는 기본 이미지
              alt={restaurant.name || "Restaurant"}
              className="main-image"
            />
            {/* 가게 정보 */}
            <div className="store-info">
              <p className="mb-0">{restaurant.foodtype}</p>
              <h5 className="mb-2">{restaurant.name || `가게이름 ${index + 1}`}</h5>
              <p>{restaurant.description || "설명 및 간단한 소개글"}</p>
            </div>
            {/* 보러가기 버튼 */}
            <Link to={`/restaurant/${restaurant.restaurantId}`}>
              <button className="visit-btn">보러가기</button>
            </Link>
          </div>
        ))}
      </div>
          
        {/* 검색 영역 */}
        <div className="search-container">
          <h2 className="search-title text-white mb-3">
            Rechelin에서 원하는
            <br />맛집을 찾아보세요.
          </h2>
          <Form className="d-flex" onSubmit={handleSearch}>
            <Form.Control
              type="text"
              className="search-input"
              placeholder="전체 검색"
              value={query}
              onChange={handleInputChange}
            />
            {/* 검색 아이콘 */}
            <img
              src="/icons/search.svg"
              alt="검색 아이콘"
              className="search-icon position-absolute"
            />
          </Form>
        </div>
      </Container>

      {/* 레스토랑 섹션 */}
      <Container className="js-shop">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="section-title">레스토랑</h2>
          <Link to="/restaurant" className="mb-0 d-flex align-items-center">전체보기 <img src="/icons/right.svg" alt="" className="js-right ms-2" /></Link>
        </div>
        <Row>
          {[1, 2, 3].map((_, index) => (
            <Col key={index} md={4} className="restaurant-card">
              <div className="card border-0 shadow-sm">
                <img src="/img/foodimg1.jpg" alt="Restaurant" className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">가게이름 {index + 1}</h5>
                  <p className="card-title">설명</p>
                </div>
              </div>
            </Col>
          ))}
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
        <Row className="d-flex justify-content-between align-items-center">
          <Col xs="auto">
            <h2 className="section-title">공지사항</h2>
          </Col>
          <Col xs="auto">
            <Link to="http://13.124.43.252/" className="mb-0 d-flex align-items-center" style={{color:"gray"}}>
              전체보기 <img src="/icons/right.svg" alt="" className="js-right ms-2" />
            </Link>
          </Col>
        </Row>
        <ListGroup variant="flush">
          {notices.map((notice, index) => (
            <ListGroupItem
              key={index}
               // 클릭 시 상세 보기
            >
              <strong style={{cursor:"pointer"}} onClick={() => fetchNoticeDetail(notice.bbsId, notice.nttId)}>{notice.nttSj}</strong> <span className="text-muted">{notice.frstRegisterPnttm}</span>
            </ListGroupItem>
          ))}
        </ListGroup>
      </Container>
      {/* 공지사항 상세 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedNotice?.nttSj}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedNotice?.nttCn}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default Main;
