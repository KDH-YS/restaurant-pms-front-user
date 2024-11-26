// src/components/Restaurants/SearchForm.js
import React from 'react';
import { Form, Button } from 'react-bootstrap';

const SearchBar = ({ searchParams, onInputChange, onCheckboxChange, onSearchSubmit }) => {
  return (
    <Form onSubmit={onSearchSubmit}>
      {/* 검색어 입력 */}
      <Form.Group controlId="formQuery">
        <Form.Label>검색어</Form.Label>
        <Form.Control
          type="text"
          placeholder="검색어 입력 (예: 음식, 도시 등)"
          name="query"
          value={searchParams.query}
          onChange={onInputChange}
        />
      </Form.Group>

      {/* 검색 조건 (셀렉트 박스) */}
      <Form.Group controlId="formSearchOption">
        <Form.Label>검색 조건</Form.Label>
        <Form.Control
          as="select"
          name="searchOption"
          value={searchParams.searchOption}
          onChange={onInputChange}
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
          onChange={onCheckboxChange}
        />
      </Form.Group>

      {/* 예약 가능 여부 체크박스 */}
      <Form.Group controlId="formReservationAvailable">
        <Form.Check
          type="checkbox"
          name="reservationAvailable"
          label="예약 가능"
          checked={searchParams.reservationAvailable}
          onChange={onCheckboxChange}
        />
      </Form.Group>

      {/* 검색 버튼 */}
      <Button type="submit">검색</Button>
    </Form>
  );
};

export default SearchBar;
