import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, Form, Modal, Pagination } from 'react-bootstrap';

const ReservationStatus = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newPeople, setNewPeople] = useState('');
  const [newRequest, setNewRequest] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 6;

  // 예약 데이터를 API에서 받아오는 useEffect
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/reservations?userId=1');
        const data = await response.json();
        setReservations(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchReservations();
  }, []);

  // 현재 페이지에 해당하는 예약 항목을 계산
  const currentReservations = reservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleOpenChangeModal = (reservation) => {
    setSelectedReservation(reservation);
    setNewDate(reservation.reservationTime.split('T')[0]);
    setNewTime(reservation.reservationTime.split('T')[1].substring(0, 5)); // 시간 포맷 맞추기
    setNewPeople(reservation.numberOfPeople);
    setNewRequest(reservation.request || '');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReservation(null);
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/reservations/user/${reservationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request: 'cancelrequest' }), // 요청 사항을 'cancelrequest'로 업데이트
      });
  
      if (response.ok) {
        alert('예약 요청 사항이 취소되었습니다.');
        const updatedReservationsResponse = await fetch('http://localhost:8080/api/reservations?userId=1');
        const updatedReservations = await updatedReservationsResponse.json();
        setReservations(updatedReservations); // 상태 업데이트
      } else {
        alert('예약 취소에 실패했습니다.');
      }
    } catch (error) {
      console.error('예약 취소 오류:', error);
      alert('예약 취소 중 오류가 발생했습니다.');
    }
  };
  

  const handleSaveChanges = async () => {
    const updatedReservation = {
      reservationTime: `${newDate}T${newTime}:00`, // 시간을 정확히 맞추기 위해 :00을 추가
      numberOfPeople: newPeople,
      request: newRequest,
      reservationId: selectedReservation.reservationId
    };

    try {
      const response = await fetch(`http://localhost:8080/api/reservations/${selectedReservation.reservationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedReservation),
      });

      if (response.ok) {
        alert('예약이 성공적으로 변경되었습니다!');
        setReservations(reservations.map(reservation => 
          reservation.reservationId === selectedReservation.reservationId ? updatedReservation : reservation
        ));
        setShowModal(false);
      } else {
        alert('예약 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('예약 변경 오류:', error);
      alert('예약 변경 중 오류가 발생했습니다.');
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container className="reservation-status-container">
      <h3>예약 현황</h3>
      <Row>
        {currentReservations.map((reservation) => (
          <Col md={6} key={reservation.reservationId} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>예약 정보</Card.Title>
                <Card.Text>
                  <strong>레스토랑:</strong> {reservation.restaurantName}
                  <br />
                  <strong>날짜:</strong> {reservation.reservationTime.split('T')[0]}
                  <br />
                  <strong>시간:</strong> {reservation.reservationTime.split('T')[1].substring(0, 5)}
                  <br />
                  <strong>인원 수:</strong> {reservation.numberOfPeople}명
                  <br />
                  <strong>상태:</strong> {reservation.status}
                </Card.Text>
                <div className="d-flex justify-content-between">
                  <Button variant="danger" onClick={() => handleCancelReservation(reservation.reservationId)}>
                    예약 취소
                  </Button>
                  <Button variant="secondary" onClick={() => handleOpenChangeModal(reservation)}>
                    예약 변경
                  </Button>
                </div>

                <Form className="mt-3">
                  <Form.Group>
                    <Form.Label>요청 사항</Form.Label>
                    <Card.Text>{reservation.request}</Card.Text>
                  </Form.Group>
                  <Button variant="primary" className="mt-2">
                    리뷰 등록
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 페이지네이션 */}
      <Pagination>
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>

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
                <Form.Control type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
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
                <Form.Control type="number" min="1" value={newPeople} onChange={(e) => setNewPeople(e.target.value)} />
              </Form.Group>
              <Form.Group controlId="changeRequest" className="mt-3">
                <Form.Label>요청사항 변경</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newRequest}
                  onChange={(e) => setNewRequest(e.target.value)} // 요청사항 값 변경
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              취소
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              저장
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default ReservationStatus;
