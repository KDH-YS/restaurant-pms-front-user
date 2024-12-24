import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button, Form, Card, Row, Col, Container } from 'react-bootstrap';
import Calendar from 'react-calendar';
import { format, parseISO, isBefore, startOfWeek, endOfWeek, eachDayOfInterval, differenceInCalendarWeeks } from 'date-fns';
import { useAuthStore } from 'store/authStore';
import BulkScheduleModal from './BulkScheduleModal';
import 'react-calendar/dist/Calendar.css';

// 시간 옵션 생성 함수
const generateTimeOptions = () => Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`);

// 주차 계산 함수
const getWeekOfMonth = (date) => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const start = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });
  return differenceInCalendarWeeks(date, start, { weekStartsOn: 1 }) + 1;
};

const Manager = () => {
  const { token, restaurantId } = useAuthStore();
  const [date, setDate] = useState(new Date());
  const [schedules, setSchedules] = useState({});
  const [savedSchedules, setSavedSchedules] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [scheduleExists, setScheduleExists] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const timeOptions = generateTimeOptions();

  const apiUrl = process.env.REACT_APP_API_BASE_URL;
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
  const fetchSavedSchedules = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/api/restaurants/schedule?restaurantId=${restaurantId}`, {
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
  }, [token, restaurantId]);

  useEffect(() => {
    fetchSavedSchedules();
  }, [fetchSavedSchedules]);

  // 스케줄 저장 함수
  const handleSaveSchedule = async () => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const schedule = schedules[dateKey] || {};
    const newSchedule = {
      restaurantId: restaurantId,
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
      const response = await fetch(`${apiUrl}/api/restaurants/schedule`, {
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
  const handleDeleteSchedule = async (scheduleId) => {
    if (!scheduleId) return alert('삭제할 일정을 선택해주세요.');
  
    try {
      const response = await fetch(
        `${apiUrl}/api/restaurants/schedule/${scheduleId}`,
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

  useEffect(() => {
    const checkExistingSchedule = () => {
      const dateKey = format(date, 'yyyy-MM-dd');
      const existingSchedule = savedSchedules.find(s => s.openDate === dateKey);
      setScheduleExists(!!existingSchedule);
    };
    checkExistingSchedule();
  }, [date, savedSchedules]);

  const filteredSchedules = useMemo(() => {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
    return savedSchedules
      .filter((schedule) => {
        const scheduleDate = parseISO(schedule.openDate);
        return !isBefore(scheduleDate, weekStart) && !isBefore(weekEnd, scheduleDate);
      })
      .sort((a, b) => parseISO(a.openDate) - parseISO(b.openDate));
  }, [savedSchedules, date]);

  const handleBulkSave = async (startDate, endDate, scheduleDetails) => {
    const dates = eachDayOfInterval({ start: startDate, end: endDate });
  
    let savedCount = 0;
    let errorCount = 0;

    for (const date of dates) {
      const schedule = {
        restaurantId: restaurantId,
        openDate: format(date, 'yyyy-MM-dd'),
        ...scheduleDetails
      };

      try {
        const response = await fetch(`${apiUrl}/api/restaurants/schedule`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(schedule),
        });

        if (response.ok) {
          savedCount++;
        } else {
          errorCount++;
          console.error(`Failed to save schedule for ${schedule.openDate}`);
        }
      } catch (error) {
        errorCount++;
        console.error(`Error saving schedule for ${schedule.openDate}:`, error);
      }
    }

    alert(`일괄 일정 입력 완료:\n저장된 일정: ${savedCount}개\n저장 실패: ${errorCount}개`);
    fetchSavedSchedules();
  };

  return (
    <Container className="mt-5 mb-5">
      <h2>영업시간 및 상태 설정</h2>

      {/* 캘린더 및 설정 카드 */}
      <Row className='d-flex h-100'>
  <Col md={6} className="d-flex">
    <Card className="mt-4 flex-fill">
      <Card.Body>
        <Calendar onChange={setDate} value={date} tileClassName={tileClassName} minDate={currentDateTime} />
      </Card.Body>
    </Card>
  </Col>
  <Col md={6} className="d-flex">
    <Card className="schedulecard mt-4 flex-fill">
      <Card.Body>
        <Card.Header className='mt-2'>{format(date, 'yyyy년 MM월 dd일')} 설정</Card.Header>
        <Form.Check
          className='mt-1'
          type="checkbox"
          label="오픈 상태 (열림/닫힘)"
          checked={currentSchedule.isOpen || false}
          onChange={handleOpenChange}
          disabled={scheduleExists}
        />

        {/* 시간 설정 */}
        <Row className='mt-1'>
          {['startTime', 'endTime', 'breakStart', 'breakEnd'].map((field) => (
            <Col key={field} md={6} className='mt-1'>
              <Form.Group controlId={`form${field}`}>
                <Form.Label className='mt-2' style={{ marginTop: '5px' }}>
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
                  disabled={!currentSchedule.isOpen || scheduleExists}
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

        <Container className="d-flex p-0">
          <Button
            variant="primary"
            className="mt-3"
            onClick={handleSaveSchedule}
            disabled={scheduleExists}
          >
            일정 저장
          </Button>
          <Button 
            variant="secondary"
            className="mt-3 ms-auto"
            style={{ marginLeft: 'auto' }}
            onClick={() => setShowBulkModal(true)}
          >
            일괄 일정 입력
          </Button>
        </Container>

        {scheduleExists && (
          <p className="text-danger mt-3 mb-0">이 날짜에 이미 일정이 존재합니다. 수정하려면 기존 일정을 삭제해주세요.</p>
        )}
      </Card.Body>
    </Card>
  </Col>
</Row>


      {/* 저장된 일정 */}
      <div className="mt-5 savedschedule">
        <div className="d-flex justify-content-between align-items-center">
          <h3>저장된 일정</h3>
          <span className="text-muted">
            {format(date, 'M')}월 {getWeekOfMonth(date)}주차
          </span>
        </div>

        {filteredSchedules.length === 0 ? (
          <p>저장된 일정이 없습니다.</p>
        ) : (
          <div>
            {filteredSchedules.map((schedule) => (
              <Card
                key={schedule.scheduleId}
                className="mb-3"
                style={{ cursor: 'pointer' }}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    {/* 일정 정보 */}
                    <div>
                      <Card.Title>
                        {format(parseISO(schedule.openDate), 'yyyy년 MM월 dd일')}
                      </Card.Title>
                      <Card.Text>
                        {schedule.isOpen
                          ? `${schedule.startTime} ~ ${schedule.endTime} 브레이크타임 ${schedule.breakStart} ~ ${schedule.breakEnd}`
                          : '휴업'}
                      </Card.Text>
                    </div>
                    {/* 삭제 버튼 */}
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteSchedule(schedule.scheduleId)}
                    >
                      삭제
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        <div className="d-flex justify-content-between mt-3">
          <Button
            onClick={() => setDate(prevDate => {
              const newDate = new Date(prevDate);
              newDate.setDate(prevDate.getDate() - 7);
              return newDate;
            })}
          >
            이전 주
          </Button>
          <Button
            onClick={() => setDate(prevDate => {
              const newDate = new Date(prevDate);
              newDate.setDate(prevDate.getDate() + 7);
              return newDate;
            })}
          >
            다음 주
          </Button>
        </div>
      </div>

      <BulkScheduleModal
        show={showBulkModal}
        onHide={() => setShowBulkModal(false)}
        onSave={handleBulkSave}
        generateTimeOptions={generateTimeOptions}
        savedSchedules={savedSchedules}
      />
    </Container>
  );
}

export default Manager;

