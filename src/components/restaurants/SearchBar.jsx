import React from 'react';
import { Form, Button } from 'react-bootstrap';

// SearchBar.jsx
const SearchBar = ({ searchParams, handleInputChange, handleCheckboxChange, handleSearch }) => {
  // 검색 버튼 클릭 시 폼 제출을 막고 검색 실행
  const handleSubmit = (e) => {
    e.preventDefault();  // form의 기본 제출 동작을 막음
    handleSearch(1);  // 검색 버튼 클릭 시 검색 실행
  };

  return (
    <Form onSubmit={handleSubmit}> {/* 폼 제출 시 handleSubmit 호출 */}
      <Form.Group controlId="formQuery">
        <Form.Label>검색어</Form.Label>
        <Form.Control
          type="text"
          placeholder="검색어 입력 (예: 음식, 도시 등)"
          name="query"
          value={searchParams.query}
          onChange={handleInputChange}  // query 상태 업데이트
        />
      </Form.Group>

      <Form.Group controlId="formSearchOption">
        <Form.Label>검색 조건</Form.Label>
        <Form.Control
          as="select"
          name="searchOption"
          value={searchParams.searchOption}
          onChange={handleInputChange}  // 조건 변경 시 상태 업데이트
        >
          <option value="all">전체</option>
          <option value="name">가게명</option>
          <option value="city">도시</option>
          <option value="district">구</option>
          <option value="neighborhood">동</option>
          <option value="foodType">음식 종류</option>
        </Form.Control>
      </Form.Group>

      <Button 
        type="submit"  // submit 시 검색 실행
      >
        검색
      </Button>
    </Form>
  );
};


export default SearchBar;
