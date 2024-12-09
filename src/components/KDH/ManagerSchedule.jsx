import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Button, Form, Card, Row, Col } from 'react-bootstrap';
import 'css/KDH/ManagerSchedule.css';
import { useAuthStore } from 'store/authStore';
import { format, parseISO, isBefore, startOfDay } from 'date-fns';

// 시간 옵션 생성 함수
const generateTimeOptions = () => Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

const Manager = () => {
  const { token } = useAuthStore();
  const [date, setDate] = useState(new Date());
  const [schedules, setSchedules] = useState({});
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [savedSchedules, setSavedSchedules] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const timeOptions = generateTimeOptions();

  // 토요일에 특별한 스타일을 적용하는 함수
  const tileClassName = ({ date, view }) => (view === 'month' && date.getDay() === 6 ? 'saturday' : null);

  useEffect(() => {
    // 현재 날짜와 시간으로 초기화
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 입력값 변경 시 스케줄 업데이트
  const handleInputChange = (key, value) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    setSchedules((prev) => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [key]: value,
      },
    }));
  };

  // 오픈 상태 체크박스 변경 시 처리
  const handleOpenChange = (e) => {
    const checked = e.target.checked;
    const dateKey = format(date, 'yyyy-MM-dd');
    
    setSchedules((prev) => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        isOpen: checked,
        startTime: checked ? (prev[dateKey]?.startTime || '09:00') : '',
        endTime: checked ? (prev[dateKey]?.endTime || '20:00') : '',
        breakStart: checked ? (prev[dateKey]?.breakStart || '14:00') : '',
        breakEnd: checked ? (prev[dateKey]?.breakEnd || '16:00') : '',
      },
    }));
  };

  // 저장된 스케줄을 불러오는 함수
  const fetchSavedSchedules = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/restaurants/schedule?restaurantId=1', {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('일정을 불러오는 데 실패했습니다.');
      const data = await response.json();
      setSavedSchedules(data);
    } catch (error) {
      console.error('스케줄 불러오기 오류:', error);
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchSavedSchedules();
  }, [token]); // token이 변경될 때마다 스케줄을 다시 불러옵니다.

  // 스케줄 저장 함수
  const handleSaveSchedule = async () => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const schedule = schedules[dateKey] || {};
    const newSchedule = {
      restaurantId: 1,
      openDate: dateKey,
      startTime: schedule.startTime || '',
      endTime: schedule.endTime || '',
      isOpen: schedule.isOpen || false,
      breakStart: schedule.breakStart || '',
      breakEnd: schedule.breakEnd || '',
    };

    // 같은 날짜에 이미 일정이 있는지 확인
    const existingSchedule = savedSchedules.find(s => s.openDate === dateKey);
    if (existingSchedule) {
      alert('이 날짜에 이미 일정이 존재합니다. 기존 일정을 수정하거나 삭제해주세요.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/restaurants/schedule', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSchedule),
      });

      if (!response.ok) throw new Error('일정 저장에 실패했습니다.');
      alert('일정이 성공적으로 저장되었습니다.');
      fetchSavedSchedules();
    } catch (error) {
      console.error('스케줄 저장 오류:', error);
      alert(error.message);
    }
  };

  // 스케줄 삭제 함수
  const handleDeleteSchedule = async () => {
    if (!selectedScheduleId) return alert('삭제할 일정을 선택해주세요.');

    try {
      const response = await fetch(
        `http://localhost:8080/api/restaurants/schedule/${selectedScheduleId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.ok) throw new Error('일정 삭제에 실패했습니다.');
      alert('일정이 삭제되었습니다.');
      fetchSavedSchedules();
    } catch (error) {
      console.error('스케줄 삭제 오류:', error);
      alert(error.message);
    }
  };

  // 현재 선택된 날짜의 스케줄 정보
  const currentSchedule = schedules[format(date, 'yyyy-MM-dd')] || {};

  return (
    <div className="container mt-5 schedulecontainer">
      <h2>영업시간 및 상태 설정</h2>

      {/* 캘린더 및 설정 카드 */}
      <div className="row">
        <div className="col-md-6">
          <Card className="schedulecard mt-4">
            <Card.Body>
              <Calendar onChange={setDate} value={date} tileClassName={tileClassName} minDate={currentDateTime} />
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-6">
          <Card className="schedulecard mt-4">
            <Card.Body>
              <Card.Header>{format(date, 'yyyy년 MM월 dd일')} 설정</Card.Header>
              <Form.Check
                type="checkbox"
                label="오픈 상태 (열림/닫힘)"
                checked={currentSchedule.isOpen || false}
                onChange={handleOpenChange}
              />

              {/* 시간 설정 */}
              <Row>
                {['startTime', 'endTime', 'breakStart', 'breakEnd'].map((field) => (
                  <Col key={field} md={6}>
                    <Form.Group controlId={`form${field}`}>
                      <Form.Label style={{ marginTop: '5px' }}>
                        {field === 'startTime' ? '영업 시작'
                          : field === 'endTime' ? '영업 종료'
                          : field === 'breakStart' ? '브레이크 시작'
                          : '브레이크 종료'} 시간
                      </Form.Label>
                      <Form.Control
                        style={{ marginTop: '5px' }}
                        as="select"
                        value={currentSchedule[field] || ''}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        disabled={!currentSchedule.isOpen}
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

      {/* 저장된 일정 */}
      <div className="mt-5 savedschedule">
        <h3>저장된 일정</h3>
        {savedSchedules.length === 0 ? (
          <p>저장된 일정이 없습니다.</p>
        ) : (
          <div>
            {savedSchedules
              .filter(schedule => !isBefore(parseISO(schedule.openDate), startOfDay(new Date())))
              .sort((a, b) => parseISO(a.openDate).getTime() - parseISO(b.openDate).getTime())
              .map((schedule) => (
                <Card
                  key={schedule.scheduleId}
                  className={`mb-3 ${selectedScheduleId === schedule.scheduleId ? 'border-primary' : ''}`}
                  onClick={() => setSelectedScheduleId(schedule.scheduleId)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body>
                    <Card.Title>{format(parseISO(schedule.openDate), 'yyyy년 MM월 dd일')}</Card.Title>
                    <Card.Text>
                      {schedule.isOpen
                        ? `${schedule.startTime} ~ ${schedule.endTime} 브레이크타임 ${schedule.breakStart} ~ ${schedule.breakEnd}`
                        : '휴업'}
                    </Card.Text>
                  </Card.Body>
                </Card>
              ))}
          </div>
        )}

        <Button variant="danger" onClick={handleDeleteSchedule} disabled={!selectedScheduleId}>
          삭제
        </Button>
      </div>
    </div>
  );
};

export default Manager;

