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
import { format } from 'date-fns';

const StyledCard = styled.div`
  .form-control {
    resize: none;
  }
  .card {
    cursor: default;
  }
`;

const Reserve = () => {
  
  const apiUrl = process.env.REACT_APP_API_BASE_URL;
  const { token,userId } = useAuthStore();
  const { restaurant } = restaurantStore();
  
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [people, setPeople] = useState(1);
  const [totalPrice, setTotalPrice] = useState(10000);
  const [request, setRequest] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [schedules, setSchedules] = useState({});
  const [availableTimes, setAvailableTimes] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    fetchSchedules();

    return () => clearInterval(interval);
  }, []);

  const formatTime = (time) => time ? time.slice(0, 5) : null;

  const fetchSchedules = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/restaurants/schedule?restaurantId=${restaurant.restaurantId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('스케줄을 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      const schedulesMap = {};
      data.forEach(schedule => {
        schedulesMap[schedule.openDate] = {
          ...schedule,
          startTime: formatTime(schedule.startTime),
          endTime: formatTime(schedule.endTime),
          breakStart: formatTime(schedule.breakStart),
          breakEnd: formatTime(schedule.breakEnd)
        };
      });
      setSchedules(schedulesMap);
    } catch (error) {
      console.error('스케줄 불러오기 오류:', error);
      alert(error.message);
    }
  };

  useEffect(() => {
    updateAvailableTimes();
  }, [date, schedules]);

  const updateAvailableTimes = () => {
    const selectedDateStr = format(date, 'yyyy-MM-dd');
    const schedule = schedules[selectedDateStr];
    if (schedule && schedule.isOpen && schedule.startTime && schedule.endTime) {
      const times = [];
      const now = new Date();
      let currentTime = schedule.startTime; // 초기 시간
      const endTime = schedule.endTime;
  
      while (currentTime <= endTime) {
        const [hours, minutes] = currentTime.split(':').map(Number);
  
        const scheduleDateTime = new Date(date); // 선택한 날짜에 대해 예약 시간 생성
        scheduleDateTime.setHours(hours, minutes, 0, 0);
  
        // 현재 시간보다 이후 시간만 추가
        if (
          scheduleDateTime > now &&
          (!schedule.breakStart || !schedule.breakEnd ||
            currentTime < schedule.breakStart || currentTime > schedule.breakEnd)
        ) {
          times.push(currentTime);
        }
  
        // 시간 증가
        let newHours = hours + 1;
        if (newHours >= 24) {
          break; // 24시 이후는 처리하지 않음
        }
        currentTime = `${String(newHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      }
      setAvailableTimes(times);
    } else {
      setAvailableTimes([]);
    }
  };
  

  const handlePeopleChange = (e) => {
    const numberOfPeople = parseInt(e.target.value);
    setPeople(numberOfPeople);
    setTotalPrice(numberOfPeople * 10000);
  };

  const handleReserve = async () => {
    const restaurantId = restaurant.restaurantId;

    const reservationData = {
      userId,
      restaurantId,
      reservationTime: `${format(date, 'yyyy-MM-dd')}T${time}`,
      request,
      numberOfPeople: people,
    };

    try {
      const reservationResponse = await fetch('${apiUrl}/api/reservations', {
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
  const tileClassName = ({ date, view }) => {
    if(view === 'month' && date.getDay() === 6){
      return 'saturday';
    }
    if (view === 'month') {
      const dateStr = format(date, 'yyyy-MM-dd');
      if (schedules[dateStr] && schedules[dateStr].isOpen) {
        return 'highlight';
      }
    }
    return null;
  };

  const tileDisabled = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = format(date, 'yyyy-MM-dd');
      return !schedules[dateStr] || !schedules[dateStr].isOpen;
    }
    return false;
  };

  return (
    <StyledCard>
      <Container className="py-4">
        <Card className="mb-4">
          <Card.Img variant="top" src={restaurantimg} style={{ height: '400px', objectFit: 'cover' }} />
          <Card.Body>
            <Card.Title className="h4 mb-2">{restaurant.name}</Card.Title>
            <Card.Text className="text-muted">{restaurant.roadAddr}</Card.Text>
          </Card.Body>
        </Card>
  
        <Card className="mb-4">
          <Card.Body>
            <Calendar
              onChange={setDate}
              value={date}
              tileClassName={tileClassName}
              tileDisabled={tileDisabled}
              prevLabel="<"
              nextLabel=">"
              minDate={currentDateTime}
              className="w-100 border-0"
            />
          </Card.Body>
        </Card>
  
        <Card className="mb-4">
          <Card.Body>
            <Card.Title className="h5 mb-3 reservetimebutton">예약시간</Card.Title>
            <Row>
              {availableTimes.map((timeOption) => (
                <Col key={timeOption} xs={6} sm={3} className="mb-2">
                  <Button
                    variant={time === timeOption ? "primary" : "outline-primary"}
                    className="w-100"
                    onClick={() => setTime(timeOption)}
                  >
                    {timeOption}
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
              disabled={!time}
            >
              예약하기
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </StyledCard>
  )
  ;
};

export default Reserve;

