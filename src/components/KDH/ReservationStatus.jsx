import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, Form, Modal, Pagination } from 'react-bootstrap';
import 'css/KDH/ReservationStatus.css';
import * as PortOne from '@portone/browser-sdk/v2';

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
      reservationTime: `${newDate}T${newTime}:00`,
      numberOfPeople: newPeople,
      request: newRequest,
      reservationId: selectedReservation.reservationId,
    };
  
    try {
      const response = await fetch(`http://localhost:8080/api/reservations/${selectedReservation.reservationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedReservation),
      });
  
      if (response.ok) {
        alert('예약이 성공적으로 변경되었습니다!');
        setReservations(reservations.map((reservation) =>
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

  const handlePay = async (reservation) => {
    // 선택된 예약 정보를 사용

  
    const storeId = "store-69e65e79-61d9-4e6c-a0da-a06c6e32e37b";  // 상점 ID
    const channelKey = "channel-key-5e0eb0b0-5c03-4514-85a3-38dbc688666c";  // 채널 키
    const paymentId = `payment-${crypto.randomUUID()}`;  // 고유한 결제 ID
    const orderName = `${reservation.restaurantName} 예약`;  // 주문명
    const totalAmount = reservation.numberOfPeople * 10000;  // 결제 금액 (1인당 10,000원 가정)
    const currency = "CURRENCY_KRW";  // 결제 통화 (원화)
    const payMethod = "EASY_PAY";  // 결제 수단
  
    try {
      // 결제 요청
      const response = await PortOne.requestPayment({
        storeId,
        channelKey,
        paymentId,
        orderName,
        totalAmount,
        currency,
        payMethod,  // 결제 수단을 EASY_PAY로 변경
      });
  
      // 결제 응답 확인
      if (response.code !== undefined) {
        // 오류 발생 시, 오류 메시지를 알림으로 출력
        return alert(response.message);
      }
  
      // 결제 완료 후 예약 정보 전송
      await fetch(`http://localhost:8080/payment/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentId,           // 결제 ID
          reservationId: reservation.reservationId,       // 예약 ID
          amount: totalAmount, // 결제 금액
        }),
      });
    } catch (error) {
      alert("결제 중 오류가 발생했습니다.");
    }
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
                  <Button variant="primary" className="mt-2" onClick={() => handlePay(reservation)}>
                    결제
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
                <Form.Control type="number" value={newPeople} onChange={(e) => setNewPeople(e.target.value)} />
              </Form.Group>
              <Form.Group controlId="changeRequest" className="mt-3">
                <Form.Label>요청 사항</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newRequest}
                  onChange={(e) => setNewRequest(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              취소
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              변경 사항 저장
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default ReservationStatus;
