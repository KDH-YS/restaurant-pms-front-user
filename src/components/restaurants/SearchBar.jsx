import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const SearchBar = ({ searchParams, handleInputChange, handleCheckboxChange, handleSearch }) => {
  // 검색 폼 제출을 막는 함수
  const handleSubmit = (e) => {
    e.preventDefault(); // form 제출 기본 동작을 막음
    handleSearch(1);  // 검색 버튼 클릭 시 검색 실행
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-4"> {/* 폼 제출 시 handleSubmit 호출 */}
      {/* 검색 조건과 검색어 입력 */}
      <Row className="align-items-center">
        <Col>
          {/* 검색 조건 (셀렉트 박스) */}
          <Form.Group controlId="formSearchOption">
            <Form.Label>검색 조건</Form.Label>
            <Form.Control
              as="select"
              name="searchOption"
              value={searchParams.searchOption || 'all'} // 기본값 설정
              onChange={handleInputChange}
            >
              <option value="all">전체</option>
              <option value="name">가게명</option>
              <option value="city">도시</option>
              <option value="district">구</option>
              <option value="neighborhood">동</option>
              <option value="foodType">음식 종류</option>
            </Form.Control>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="formQuery">
            <Form.Label>검색어</Form.Label>
            <Form.Control
              type="text"
              placeholder="검색어 입력 (예: 음식, 도시 등)"
              name="query"
              value={searchParams.query || ''} // 기본값 설정
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* 체크박스와 검색 버튼을 같은 행에 배치 */}
      <Row className="align-items-center mt-3">
        <Col>
          <Form.Group controlId="formReservationAvailable">
            <Form.Check
              type="checkbox"
              name="reservationAvailable"
              label="예약 가능"
              checked={searchParams.reservationAvailable === true} // 값이 true일 때 체크
              onChange={handleCheckboxChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="formParkingAvailable">
            <Form.Check
              type="checkbox"
              name="parkingAvailable"
              label="주차 가능"
              checked={searchParams.parkingAvailable === true} // 값이 true일 때 체크
              onChange={handleCheckboxChange}
            />
          </Form.Group>
        </Col>

        {/* 검색 버튼을 오른쪽 끝에 배치 */}
        <Col className="d-flex justify-content-end">
          <Button type="submit">검색</Button>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchBar;
