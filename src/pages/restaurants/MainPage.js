import React, { useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../../css/restaurants/MainPage.css';

function MainPage() {
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
      <div className="imageContainer">
        <div className="image">
          <img src="/img/foodimg1.jpg" alt="Food" className="img-fluid" />
          <div className="searchBtn">
            <Form className="d-flex" onSubmit={handleSearch}>
              <Form.Control
                type="text"
                className="scInput"
                placeholder="전체 검색"
                value={query}
                onChange={handleInputChange}
                style={{ width: '80%' }}
              />
              <Button type="submit" className="scBtn btn-warning ms-2">
                검색
              </Button>
            </Form>
          </div>
        </div>
      </div>

      <Container>
        <h1 className="reviewHd mt-4">Review</h1>
      </Container>
    </div>
  );
}

export default MainPage;
