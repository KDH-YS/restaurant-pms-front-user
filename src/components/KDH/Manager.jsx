import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Button, Form, Card, Row, Col } from 'react-bootstrap';

function Manager() {
  // 날짜, 오픈 상태, 영업시간, 브레이크타임 상태 관리
  const [date, setDate] = useState(new Date());
  const [workingHours, setWorkingHours] = useState({});
  const [breakTime, setBreakTime] = useState({});
  const [isOpen, setIsOpen] = useState({});
  const [savedSchedules, setSavedSchedules] = useState([]); // 저장된 일정 관리

  // 날짜 선택 시 처리 함수
  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  // 영업시간 설정
  const handleWorkingHoursChange = (e) => {
    const { name, value } = e.target;
    setWorkingHours({
      ...workingHours,
      [name]: value,
    });
  };

  // 브레이크타임 설정
  const handleBreakTimeChange = (e) => {
    const { name, value } = e.target;
    setBreakTime({
      ...breakTime,
      [name]: value,
    });
  };

  // 오픈 상태 설정
  const handleIsOpenChange = (e) => {
    const { name, checked } = e.target;
    setIsOpen({
      ...isOpen,
      [name]: checked,
    });
  };

  // 설정 저장 시 호출되는 함수
  const handleSaveSchedule = () => {
    const dateKey = date.toDateString();
    const newSchedule = {
      date: dateKey,
      workingStart: workingHours[`${dateKey}-start`] || '',
      workingEnd: workingHours[`${dateKey}-end`] || '',
      breakStart: breakTime[`${dateKey}-break-start`] || '',
      breakEnd: breakTime[`${dateKey}-break-end`] || '',
      isOpen: isOpen[dateKey] || false,
    };
    
    setSavedSchedules([...savedSchedules, newSchedule]); // 새로운 일정 추가
  };

  const tileClassName = ({ date, view }) =>
    view === 'month' && date.getDay() === 6 ? 'saturday' : null;

  return (
    <div className="container mt-5">
      <h2>영업시간 및 상태 설정</h2>

      {/* 달력 컴포넌트 */}
      <div className="row">
        <div className="col-md-8">
          <Calendar onChange={handleDateChange} value={date} tileClassName={tileClassName} />
        </div>

        {/* 캘린더 오른쪽에 저장된 일정 표시 */}
        <div className="col-md-4">
          <Card className="mt-4">
            <Card.Body>
              <Card.Title>{date.toDateString()} 설정</Card.Title>

              {/* 오픈 상태 설정 */}
              <Form.Group>
                <Form.Check
                  type="checkbox"
                  label="오픈 상태 (열림/닫힘)"
                  name={date.toDateString()}
                  checked={isOpen[date.toDateString()] || false}
                  onChange={handleIsOpenChange}
                />
              </Form.Group>

              {/* 영업시간 설정 */}
              <Row>
                <Col md={6}>
                  <Form.Group controlId="formWorkingStart">
                    <Form.Label>영업 시작 시간</Form.Label>
                    <Form.Control
                      type="time"
                      name={`${date.toDateString()}-start`}
                      value={workingHours[`${date.toDateString()}-start`] || ''}
                      onChange={handleWorkingHoursChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formWorkingEnd">
                    <Form.Label>영업 종료 시간</Form.Label>
                    <Form.Control
                      type="time"
                      name={`${date.toDateString()}-end`}
                      value={workingHours[`${date.toDateString()}-end`] || ''}
                      onChange={handleWorkingHoursChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* 브레이크타임 설정 */}
              <Row>
                <Col md={6}>
                  <Form.Group controlId="formBreakStart">
                    <Form.Label>브레이크타임 시작 시간</Form.Label>
                    <Form.Control
                      type="time"
                      name={`${date.toDateString()}-break-start`}
                      value={breakTime[`${date.toDateString()}-break-start`] || ''}
                      onChange={handleBreakTimeChange}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formBreakEnd">
                    <Form.Label>브레이크타임 종료 시간</Form.Label>
                    <Form.Control
                      type="time"
                      name={`${date.toDateString()}-break-end`}
                      value={breakTime[`${date.toDateString()}-break-end`] || ''}
                      onChange={handleBreakTimeChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* 저장 버튼 */}
              <Button variant="primary" className="mt-3" onClick={handleSaveSchedule}>
                설정 저장
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* 저장된 일정 표시 */}
      <div className="mt-5">
        <h3>저장된 일정</h3>
        <ul>
          {savedSchedules.map((schedule, index) => (
            <li key={index}>
              <strong>{schedule.date}</strong>: {schedule.isOpen ? '열림' : '닫힘'}, 
              영업시간: {schedule.workingStart} - {schedule.workingEnd}, 
              브레이크타임: {schedule.breakStart} - {schedule.breakEnd}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Manager;
