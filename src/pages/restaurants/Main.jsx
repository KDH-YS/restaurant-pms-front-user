import React, { useEffect, useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/restaurants/MainPage.css';

function Main() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query) {
      // 검색어를 URL 쿼리 파라미터로 전달
      navigate(`/restaurant?query=${query}`);
    }
  };

  const [translateX, setTranslateX] = useState("-100%"); // 이동 값 상태 관리
  const [images, setImages] = useState([
    '/img/foodimg1.jpg',
    '/img/foodimg1.jpg',
    '/img/foodimg1.jpg',
    '/img/foodimg1.jpg',
    '/img/foodimg1.jpg',
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. 이미지 이동
      document.querySelector('.image-wrapper').style.transition = "transform 1s ease-in-out";
      document.querySelector('.image-wrapper').style.transform = "translateX(-200%)";

      // 2. 애니메이션이 끝난 후 첫 번째 이미지를 배열 끝으로 이동
      setTimeout(() => {
        setImages((prevImages) => {
          const [first, ...rest] = prevImages;
          return [...rest, first]; // 첫 번째 이미지를 배열 끝에 추가
        });

        // 3. 이동 값을 초기화 (순간적으로 첫 번째 위치로 복귀)
        document.querySelector('.image-wrapper').style.transition = "none";
        document.querySelector('.image-wrapper').style.transform = "translateX(-100%)";
      }, 1000); // 이동 애니메이션 시간과 일치
    }, 5000); // 5초마다 실행

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      {/* 메인 이미지 배경 */}
      <Container fluid className="main-banner p-0 position-relative">
        <div className="image-wrapper">
          {images.map((src, index) => (
            <div key={index} className="image-container position-relative">
              <img src={src} alt="Food" className="main-image" />
              {/* 가게 정보 */}
              <div className="store-info">
                <p className="mb-0">한식</p>
                <h5 className="mb-2">가게이름 {index + 1}</h5>
                <p>설명 및 간단한 소개글</p>
              </div>
              {/* 보러가기 버튼 */}
              <Link to="/restaurant"><button className="visit-btn">보러가기</button></Link>
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
