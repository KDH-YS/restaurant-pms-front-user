import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Button, Form, Card, Row, Col } from 'react-bootstrap';
import 'css/KDH/ManagerSchedule.css';

const generateTimeOptions = () => Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

const Manager = () => {
  const [date, setDate] = useState(new Date());
  const [schedules, setSchedules] = useState({});
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [savedSchedules, setSavedSchedules] = useState([]);
  const timeOptions = generateTimeOptions();

  const tileClassName = ({ date, view }) => (view === 'month' && date.getDay() === 6 ? 'saturday' : null);

  const handleInputChange = (key, value) => {
    const dateKey = date.toDateString();
    setSchedules((prev) => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [key]: value,
      },
    }));
  };

  const fetchSavedSchedules = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/restaurants/schedule?restaurantId=123');
      if (!response.ok) throw new Error('일정을 불러오는 데 실패했습니다.');
      const data = await response.json();
      setSavedSchedules(data);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSaveSchedule = async () => {
    const dateKey = date.toISOString().split('T')[0];
    const schedule = schedules[date.toDateString()] || {};
    const newSchedule = {
      restaurantId: 123,
      openDate: dateKey,
      startTime: schedule.startTime || '',
      endTime: schedule.endTime || '',
      isOpen: schedule.isOpen || false,
      breakStart: schedule.breakStart || '',
      breakEnd: schedule.breakEnd || '',
    };

    try {
      const response = await fetch('http://localhost:8080/api/restaurants/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSchedule),
      });

      if (!response.ok) throw new Error('일정 저장에 실패했습니다.');
      alert('일정이 성공적으로 저장되었습니다.');
      fetchSavedSchedules();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteSchedule = async () => {
    if (!selectedScheduleId) return alert('삭제할 일정을 선택해주세요.');

    try {
      const response = await fetch(`http://localhost:8080/api/restaurants/schedule/${selectedScheduleId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('일정 삭제에 실패했습니다.');
      alert('일정이 삭제되었습니다.');
      fetchSavedSchedules();
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchSavedSchedules();
  }, []);

  const currentSchedule = schedules[date.toDateString()] || {};

  return (
    <div className="container mt-5">
      <h2>영업시간 및 상태 설정</h2>
      <div className="row">
        <div className="col-md-6">
          <Calendar onChange={setDate} value={date} tileClassName={tileClassName}/>
        </div>
        <div className="col-md-6">
          <Card className="schedulecard mt-4">
            <Card.Body>
              <Card.Title>{date.toDateString()} 설정</Card.Title>
              <Form.Check
                type="checkbox"
                label="오픈 상태 (열림/닫힘)"
                checked={currentSchedule.isOpen || false}
                onChange={(e) => handleInputChange('isOpen', e.target.checked)}
              />
              <Row>
                {['startTime', 'endTime', 'breakStart', 'breakEnd'].map((field, idx) => (
                  <Col key={field} md={6}>
                    <Form.Group controlId={`form${field}`}>
                      <Form.Label>
                        {field === 'startTime' ? '영업 시작' : field === 'endTime' ? '영업 종료' : field === 'breakStart' ? '브레이크 시작' : '브레이크 종료'}{' '}
                        시간
                      </Form.Label>
                      <Form.Control
                        as="select"
                        value={currentSchedule[field] || ''}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                      >
                        <option value="">선택</option>
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                ))}
              </Row>
              <Button variant="primary" className="mt-3" onClick={handleSaveSchedule}>
                설정 저장
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
      <div className="mt-5">
  <h3>저장된 일정</h3>
  <div>
    {savedSchedules.map((schedule) => (
      <Card
        key={schedule.id}
        className={`mb-3 ${selectedScheduleId === schedule.scheduleId ? 'border-primary' : ''}`} // 선택된 카드에 border-primary 추가
        onClick={() => setSelectedScheduleId(schedule.scheduleId)} // 클릭 시 selectedScheduleId를 업데이트
        style={{ cursor: 'pointer' }}
      >
        <Card.Body>
          <Card.Title>{schedule.openDate}</Card.Title>
          <Card.Text>
            {schedule.startTime} ~ {schedule.endTime} 브레이크타임 {schedule.breakStart} ~ {schedule.breakEnd}
          </Card.Text>
        </Card.Body>
      </Card>
    ))}
  </div>
  <Button variant="danger" onClick={handleDeleteSchedule} disabled={!selectedScheduleId}>
    삭제
  </Button>
</div>


    </div>
  );
};

export default Manager;
