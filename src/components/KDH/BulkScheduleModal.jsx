import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import Calendar from 'react-calendar';
import { format, isWithinInterval } from 'date-fns';
import 'react-calendar/dist/Calendar.css';

const BulkScheduleModal = ({ show, onHide, onSave, generateTimeOptions, savedSchedules }) => {
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [scheduleDetails, setScheduleDetails] = useState({
    isOpen: true,
    startTime: '09:00',
    endTime: '20:00',
    breakStart: '14:00',
    breakEnd: '16:00'
  });
  const [existingSchedules, setExistingSchedules] = useState([]);

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      const existing = savedSchedules.filter(schedule => 
        isWithinInterval(new Date(schedule.openDate), { start: dateRange[0], end: dateRange[1] })
      );
      setExistingSchedules(existing);
    }
  }, [dateRange, savedSchedules]);

  const handleDateRangeChange = (value) => {
    setDateRange(value);
  };

  const handleInputChange = (field, value) => {
    setScheduleDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(dateRange[0], dateRange[1], scheduleDetails);
    onHide();
  };
  const tileClassName = ({ date, view }) => (view === 'month' && date.getDay() === 6 ? 'saturday' : null);
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title >일괄 일정 입력</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>날짜 범위</Form.Label>
            <Calendar
              onChange={handleDateRangeChange}
              value={dateRange}
              selectRange={true}
              className="w-100"
              tileClassName={tileClassName}
            />
          </Form.Group>
          {existingSchedules.length > 0 && (
            <Alert variant="warning">
              선택한 날짜 범위 내에 {existingSchedules.length}개의 기존 일정이 있습니다:
              <ul>
                {existingSchedules.map(schedule => (
                  <li key={schedule.scheduleId}>
                    {format(new Date(schedule.openDate), 'yyyy년 MM월 dd일')}
                  </li>
                ))}
              </ul>
            </Alert>
          )}
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="오픈 상태 (열림/닫힘)"
              checked={scheduleDetails.isOpen}
              onChange={(e) => handleInputChange('isOpen', e.target.checked)}
            />
          </Form.Group>
          {['startTime', 'endTime', 'breakStart', 'breakEnd'].map((field) => (
            <Form.Group key={field} className="mb-3">
              <Form.Label>
                {field === 'startTime' ? '영업 시작'
                  : field === 'endTime' ? '영업 종료'
                  : field === 'breakStart' ? '브레이크 시작'
                  : '브레이크 종료'} 시간
              </Form.Label>
              <Form.Control
                as="select"
                value={scheduleDetails[field]}
                onChange={(e) => handleInputChange(field, e.target.value)}
                disabled={!scheduleDetails.isOpen}
              >
                {generateTimeOptions().map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </Form.Control>
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          취소
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSave} 
          disabled={existingSchedules.length > 0} // 기존 일정이 있으면 비활성화
        >
          저장
        </Button>

      </Modal.Footer>
    </Modal>
  );
};

export default BulkScheduleModal;

