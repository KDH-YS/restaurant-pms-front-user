import React, { useState } from 'react';
import { Button, Container, Row, Col, Form, Card } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';  // 캘린더 스타일
import '../css/Reserve.css'; // 스타일 시트 추가

const Reserve = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [people, setPeople] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [menu, setMenu] = useState('');
  const [activeMonth, setActiveMonth] = useState(date.getMonth());
  
  // 임시 리뷰 데이터 (나중에 서버에서 받아올 예정)
  const reviews = [
    { id: 1, username: '엄준식', comment: '맛있었어요! 다시 방문하고 싶습니다.', rating: 5 },
    { id: 2, username: '아무무', comment: '서비스가 좋았어요.', rating: 4 },
    { id: 3, username: '니나브', comment: '위치는 조금 불편했지만 음식은 훌륭했습니다.', rating: 3 }
  ];

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setActiveMonth(newDate.getMonth());
  };

  // 토요일에 특정 클래스 적용하는 함수
  const tileClassName = ({ date, view }) => {
    if (view === 'month' && date.getDay() === 6 && date.getMonth() === activeMonth) {
      return 'saturday';  // 선택된 월의 토요일에만 클래스 추가
    }
    return null;  // 그 외의 날짜는 기본 스타일 유지
  };

  const handleTimeChange = (event) => {
    setTime(event.target.value);
  };

  const handlePeopleChange = (event) => {
    setPeople(event.target.value);
    setTotalPrice(event.target.value * 20);  // 예: 1인당 20원 계산
  };

  const handleMenuChange = (event) => {
    setMenu(event.target.value);
    setTotalPrice((prev) => prev + (event.target.value === 'burger' ? 15 : 20));  // 메뉴에 따른 금액 추가
  };

  const handleReserve = () => {
    alert('예약이 완료되었습니다!');
  };

  return (
    <Container className="reserve-container">
      {/* 레스토랑 정보 섹션 */}
      <Row className="restaurant-info">
        <Col>
          <div className="restaurant-details">
            <h4>[레스토랑 이름 서버에서 받아오기]</h4>
            <p><strong>레스토랑 이름:</strong> 레스토랑</p>
            <p><strong>위치:</strong> 서울시 강남구 123-45</p>
            <p><strong>전화번호:</strong> 02-1234-5678</p>
            <p><strong>영업시간:</strong> 10:00 AM - 10:00 PM</p>
          </div>
        </Col>
      </Row>

      <Row className='main-content'>
        <Col md={6} className="calendar-section" style={{paddingLeft: '0px'}}>
          <Calendar onChange={handleDateChange} value={date} tileClassName={tileClassName} />
        </Col>
        <Col md={6} className="reservation-details">
          <h3>예약 상세 정보</h3>
          <Form>
  <Form.Group controlId="formMenu">
    <Form.Label>메뉴 선택</Form.Label>
    <Form.Control as="select" value={menu} onChange={handleMenuChange}>
      <option value="">메뉴를 선택하세요</option>
      <option value="burger">[서버에서 메뉴 받아오기]</option>
      <option value="pizza">피자</option>
    </Form.Control>
  </Form.Group>

  <Form.Group controlId="formTime">
    <Form.Label>시간 선택</Form.Label>
    <Form.Control as="select" value={time} onChange={handleTimeChange}>
      <option value="">[서버에서 받아오기]</option>
      <option value="12:00">12:00 PM</option>
      <option value="14:00">2:00 PM</option>
      <option value="18:00">6:00 PM</option>
      <option value="20:00">8:00 PM</option>
    </Form.Control>
  </Form.Group>

  <Form.Group controlId="formPeople">
    <Form.Label>인원 수</Form.Label>
    <Form.Control type="number" min="1" value={people} onChange={handlePeopleChange} />
  </Form.Group>

  <div className="reservation-summary">
    <strong>총 금액: {totalPrice} 원</strong>
    <Button variant="primary" onClick={handleReserve}>
      예약하기
    </Button>
  </div>
</Form>

        </Col>
      </Row>

      {/* 리뷰 섹션 */}
      <Row className="reviews-row" >
        <Col className='reviews-col'>
          <h3>고객 리뷰</h3>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Card key={review.id} className="review-card">
                <Card.Body>
                  <Card.Title>{review.username}</Card.Title>
                  <Card.Text>{review.comment}</Card.Text>
                  <Card.Text>평점: {'★'.repeat(review.rating)}</Card.Text>
                </Card.Body>
              </Card>
            ))
          ) : (
            <p>아직 리뷰가 없습니다.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Reserve;