import React, { useState } from 'react';
import { Button, Container, Row, Col, Form, Card } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';  // 캘린더 스타일
import '../css/ReservationStatus.css'; // 스타일 시트 추가

const ReservationStatus = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('12:00');
  const [people, setPeople] = useState(1);
  const [totalPrice, setTotalPrice] = useState(20);  // 기본 가격 설정 (1인)
  const [menu, setMenu] = useState('burger');
  
  // 임시 예약 정보 (실제 데이터는 서버에서 받아오기)
  const reservation = {
    restaurantName: '레스토랑',
    location: '서울시 강남구 123-45',
    phone: '02-1234-5678',
    time: '12:00',
    date: '2024-11-13',
    people: 2,
    menu: '버거',
    totalPrice: 40
  };

  // 예약 취소 처리
  const handleCancelReservation = () => {
    alert('예약이 취소되었습니다.');
  };

  // 예약 시간 변경 처리
  const handleChangeTime = (newTime) => {
    setTime(newTime);
    setTotalPrice(people * 20);  // 가격 업데이트
  };

  return (
    <Container className="reserve-container">
      {/* 예약 정보 섹션 */}
      <Row className="reservation-info">
        <Col>
          <div className="reservation-details">
            <h4>{reservation.restaurantName} 예약 현황</h4>
            <p><strong>예약 일자:</strong> {reservation.date}</p>
            <p><strong>예약 시간:</strong> {reservation.time}</p>
            <p><strong>인원 수:</strong> {reservation.people}명</p>
            <p><strong>메뉴:</strong> {reservation.menu}</p>
            <p><strong>총 금액:</strong> {reservation.totalPrice} 원</p>
          </div>
        </Col>
      </Row>

      {/* 예약 시간 변경 섹션 */}
      <Row className='reservation-change-time'>
        <Col md={6} className="change-time-section">
          <h5>예약 시간 변경</h5>
          <Form>
            <Form.Group controlId="formTime">
              <Form.Label>새로운 예약 시간</Form.Label>
              <Form.Control as="select" value={time} onChange={(e) => handleChangeTime(e.target.value)}>
                <option value="12:00">12:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="18:00">6:00 PM</option>
                <option value="20:00">8:00 PM</option>
              </Form.Control>
            </Form.Group>
            <div className="reservation-summary">
              <strong>새로운 총 금액: {totalPrice} 원</strong>
            </div>
          </Form>
        </Col>
      </Row>

      {/* 예약 취소 버튼 */}
      <Row className='cancel-reservation'>
        <Col>
          <Button variant="danger" onClick={handleCancelReservation}>
            예약 취소
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ReservationStatus;
