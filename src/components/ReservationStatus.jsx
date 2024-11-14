import React, { useState } from 'react';
import { Button, Container, Row, Col, Card, Form, Modal } from 'react-bootstrap';

const ReservationStatus = () => {
  const [reservations, setReservations] = useState([
    {
      id: 1,
      date: '2024-11-20',
      time: '18:00',
      people: 3,
      menu: '피자',
      totalPrice: 60,
      review: '',
    },
    {
      id: 2,
      date: '2024-11-22',
      time: '20:00',
      people: 2,
      menu: '버거',
      totalPrice: 50,
      review: '',
    },
  ]);

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newPeople, setNewPeople] = useState('');

  const handleCancelReservation = (id) => {
    const updatedReservations = reservations.filter((reservation) => reservation.id !== id);
    setReservations(updatedReservations);
    alert('예약이 취소되었습니다.');
  };

  const handleOpenChangeModal = (reservation) => {
    setSelectedReservation(reservation);
    setNewDate(reservation.date);
    setNewTime(reservation.time);
    setNewPeople(reservation.people);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReservation(null);
  };

  const handleUpdateReservation = () => {
    setReservations((prevReservations) =>
      prevReservations.map((reservation) =>
        reservation.id === selectedReservation.id
          ? { ...reservation, date: newDate, time: newTime, people: newPeople }
          : reservation
      )
    );
    alert('예약이 변경되었습니다.');
    handleCloseModal();
  };

  const handleReviewChange = (id, value) => {
    setReservations((prevReservations) =>
      prevReservations.map((reservation) =>
        reservation.id === id ? { ...reservation, review: value } : reservation
      )
    );
  };

  const handleLeaveReview = (id) => {
    const reservation = reservations.find((res) => res.id === id);
    if (reservation.review.trim()) {
      alert(`리뷰가 등록되었습니다: "${reservation.review}"`);
      // 서버로 리뷰 전송 로직 추가 가능
    } else {
      alert('리뷰 내용을 입력하세요.');
    }
  };

  return (
    <Container className="reservation-status-container">
      <h3>예약 현황</h3>
      <Row>
        {reservations.map((reservation) => (
          <Col md={6} key={reservation.id} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>예약 정보</Card.Title>
                <Card.Text>
                  <strong>날짜:</strong> {reservation.date}
                  <br />
                  <strong>시간:</strong> {reservation.time}
                  <br />
                  <strong>인원 수:</strong> {reservation.people}명
                  <br />
                  <strong>메뉴:</strong> {reservation.menu}
                  <br />
                  <strong>총 금액:</strong> {reservation.totalPrice} 원
                </Card.Text>
                <div className="d-flex justify-content-between">
                  <Button
                    variant="danger"
                    onClick={() => handleCancelReservation(reservation.id)}
                  >
                    예약 취소
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleOpenChangeModal(reservation)}
                  >
                    예약 변경
                  </Button>
                </div>

                <Form className="mt-3">
                  <Form.Group>
                    <Form.Label>리뷰 남기기</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={reservation.review}
                      onChange={(e) => handleReviewChange(reservation.id, e.target.value)}
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    className="mt-2"
                    onClick={() => handleLeaveReview(reservation.id)}
                  >
                    리뷰 등록
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 예약 변경 모달 */}
      {selectedReservation && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>예약 변경</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="changeDate">
                <Form.Label>날짜 변경</Form.Label>
                <Form.Control
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="changeTime" className="mt-3">
                <Form.Label>시간 변경</Form.Label>
                <Form.Control as="select" value={newTime} onChange={(e) => setNewTime(e.target.value)}>
                  <option value="12:00">12:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="20:00">8:00 PM</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="changePeople" className="mt-3">
                <Form.Label>인원 수 변경</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={newPeople}
                  onChange={(e) => setNewPeople(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              취소
            </Button>
            <Button variant="primary" onClick={handleUpdateReservation}>
              저장
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default ReservationStatus;
