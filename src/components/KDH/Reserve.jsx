import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Card, Row, Col } from 'react-bootstrap';
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'css/KDH/Reserve.css';
import restaurantimg from "img/restaurant.jpg";
import styled from 'styled-components';
import { restaurantStore } from 'store/restaurantStore';
import { useAuthStore } from 'store/authStore';
const StyledCard = styled.div`
  .form-control {
    resize: none;
  }
  .card {
    cursor: default;
  }
`;

const Reserve = () => {
  const {token}=useAuthStore();
  const {restaurant}= restaurantStore();
  
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [people, setPeople] = useState(1);
  const [totalPrice, setTotalPrice] = useState(10000); // 기본 금액 (1명 기준)
  const [request, setRequest] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const TIME_OPTIONS = [
    { value: '', label: '[예약 시간 선택]' },
    { value: '12:00', label: '12:00 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '18:00', label: '6:00 PM' },
    { value: '20:00', label: '8:00 PM' },
  ];

  useEffect(() => {
    // 현재 날짜와 시간으로 초기화
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handlePeopleChange = (e) => {
    const numberOfPeople = parseInt(e.target.value);
    setPeople(numberOfPeople);
    setTotalPrice(numberOfPeople * 10000); // 금액 갱신
  };

  const handleReserve = async () => {
    const userId = 1; // 임시 사용자 ID
    const restaurantId = restaurant.restaurantId; // 임시 레스토랑 ID

    const reservationData = {
      userId,
      restaurantId,
      reservationTime: `${date.toISOString().split('T')[0]}T${time}`,
      request,
      numberOfPeople: people,
    };

    try {
      const reservationResponse = await fetch('http://localhost:8080/api/reservations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservationData),
      });

      if (!reservationResponse.ok) {
        throw new Error(`예약 요청 중 오류가 발생했습니다: ${reservationResponse.status}`);
      }

      alert('예약이 완료되었습니다!');
      navigate('/ReservationStatus');
    } catch (error) {
      alert(`예약 요청 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  const tileClassName = ({ date, view }) => (view === 'month' && date.getDay() === 6 ? 'saturday' : null);



  // 예약 시간 선택 제한
  const isValidTime = (timeOption) => {
    if (date.toDateString() === currentDateTime.toDateString()) {
      const currentTime = currentDateTime.getHours() * 60 + currentDateTime.getMinutes();
      const selectedTime = parseInt(timeOption.split(':')[0]) * 60 + parseInt(timeOption.split(':')[1]);
      return selectedTime >= currentTime;
    }
    return true; 
  };

  return (
    <StyledCard>
      <Container className="py-4">
        <Card className="mb-4">
          <Card.Img variant="top" src={restaurantimg} style={{ height: '400px', objectFit: 'cover' }} />
          <Card.Body>
            <Card.Title className="h4 mb-2">가게 이름</Card.Title>
            <Card.Text className="text-muted">서울특별시 강남구 역삼동 123-45</Card.Text>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Body>
            <Calendar
              onChange={setDate}
              value={date}
              tileClassName={tileClassName}
              prevLabel="<"
              nextLabel=">"
              minDate={currentDateTime} // 오늘 날짜 이후만 선택 가능
              className="w-100 border-0"
            />
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Body>
            <Card.Title className="h5 mb-3 reservetimebutton">예약시간</Card.Title>
            <Row>
              {TIME_OPTIONS.slice(1).map((option) => (
                <Col key={option.value} xs={6} sm={3} className="mb-2">
                  <Button
                    variant={time === option.value ? "primary" : "outline-primary"}
                    className="w-100"
                    onClick={() => setTime(option.value)}
                    disabled={!isValidTime(option.value)} // 유효하지 않은 시간은 비활성화
                  >
                    {option.label}
                  </Button>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Body>
            <Card.Title className="h5 mb-3">인원 수</Card.Title>
            <Form.Control
              as="select"
              value={people}
              onChange={handlePeopleChange}
            >
              {[...Array(5).keys()].map((i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}명
                </option>
              ))}
            </Form.Control>
          </Card.Body>
        </Card>

        <Card className="mb-4">
          <Card.Body>
            <Card.Title className="h5 mb-3">요청사항</Card.Title>
            <Form.Control
              as="textarea"
              rows={4}
              value={request}
              onChange={(e) => setRequest(e.target.value)}
              placeholder="요청사항을 입력해주세요"
            />
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="d-flex justify-content-between align-items-center">
            <div className="h5 mb-0">
              총 금액: {totalPrice.toLocaleString()}원
            </div>
            <Button
              variant="primary"
              className="ms-auto"
              onClick={handleReserve}
            >
              예약하기
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </StyledCard>
  );
};

export default Reserve;
