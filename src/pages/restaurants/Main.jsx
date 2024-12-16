import React, { useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
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
      // 검색어를 URL 쿼리 파라미터로 전달하여 MenuPage로 이동
      navigate(`/restaurant?query=${query}`);
    }
  };
  return (
    <div className="App">
      {/* 전체 컨테이너 */}
      <Container fluid className="imageContainer p-0">
        <Row>
          <Col xs={12} className="image position-relative">
            <img src="/img/foodimg1.jpg" alt="Food" className="img-fluid w-100" />
            
            {/* 검색 버튼과 폼 */}
            <div className="searchBtn position-absolute start-50 translate-middle" style={{width:"70%"}}>
              <Form className="d-flex" onSubmit={handleSearch}>
                <Form.Control
                  type="text"
                  className="scInput"
                  placeholder="전체 검색"
                  value={query}
                  onChange={handleInputChange}
                  style={{ width: '100%' }}
                />
                <Button type="submit" className="scBtn btn-warning ms-2">
                  검색
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>

      {/* 리뷰 제목 */}
      <Container className="mt-4">
        <h1 className="reviewHd text-center">Review</h1>
      </Container>
    </div>
  );
}

export default Main;
