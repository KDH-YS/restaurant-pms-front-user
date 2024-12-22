import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, Form, Modal, Dropdown } from 'react-bootstrap';
import * as PortOne from '@portone/browser-sdk/v2';
import { useNavigate } from 'react-router-dom';
import PaginationComponent from './PaginationComponent';
import { useAuthStore } from 'store/authStore';
import { isPast, format } from 'date-fns';

const ReservationStatus = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newPeople, setNewPeople] = useState('');
  const [newRequest, setNewRequest] = useState('');
  const { token, userId } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const statusOptions = ['전체', '결제 대기중', '예약 중', '노쇼', '방문 완료'];
  const [statusFilter, setStatusFilter] = useState('전체');
  const history = useNavigate();
  const statusLabels = {
    COMPLETED: '방문 완료',
    RESERVING: '예약 중',
    PENDING: '결제 대기중',
    NOSHOW: '노쇼',
  };
  const itemsPerPage = 8;
  const pagesPerGroup = 5;
  
  // 현재 페이지가 속한 그룹 계산
  const currentGroup = Math.ceil(currentPage / pagesPerGroup);
  const fetchReservations = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/reservations?userId=${userId}&page=${currentGroup}&size=400`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`예약 데이터를 가져오는 중 오류 발생: ${response.statusText}`);
      }

      const data = await response.json();

      const currentTime = new Date();
      const sortedReservations = data.list.sort((a, b) => {
        const reservationTimeA = new Date(a.reservationTime);
        const reservationTimeB = new Date(b.reservationTime);

        if (reservationTimeA < currentTime && reservationTimeB >= currentTime) {
          return 1;
        } else if (reservationTimeA >= currentTime && reservationTimeB < currentTime) {
          return -1;
        }

        return reservationTimeA - reservationTimeB;
      });

      setReservations(sortedReservations);
      setTotalItems(sortedReservations.length);
      filterReservations(sortedReservations, statusFilter);
    } catch (error) {
      console.error('예약 데이터를 가져오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    filterReservations(reservations, statusFilter);
  }, [statusFilter, reservations]);

  const filterReservations = (reservations, filter) => {
    let filtered = reservations;
    if (filter !== '전체') {
      filtered = reservations.filter(
        (reservation) => statusLabels[reservation.status] === filter
      );
    }
    setFilteredReservations(filtered);
    setTotalItems(filtered.length);
    setCurrentPage(1);
  };

  const handleOpenChangeModal = (reservation) => {
    setSelectedReservation(reservation);
    setNewDate(reservation.reservationTime.split('T')[0]);
    setNewTime(reservation.reservationTime.split('T')[1].substring(0, 5));
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
      const response = await fetch(`http://localhost:8080/api/reservations/manager/${reservationId}`, {
        method: 'DELETE',
        headers:{
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      if (response.ok) {
        alert('예약이 취소되었습니다.');
        fetchReservations();
      } else {
        alert('예약 취소에 실패했습니다.');
      }
    } catch (error) {
      console.error('예약 취소 오류:', error);
      alert('예약 취소 중 오류가 발생했습니다.');
    }
  };

  const handleSaveChanges = async () => {
    const selectedDateTime = new Date(`${newDate}T${newTime}`);
    if (isPast(selectedDateTime)) {
      alert('이전 날짜와 시간은 선택할 수 없습니다.');
      return;
    }
    if(newPeople>5){
      alert('6명이상 단체손님은 가게에 직접문의해주시기 바랍니다.');
      return;
    }
    const updatedReservation = {
      restaurantName: selectedReservation.restaurantName,
      reservationTime: `${newDate}T${newTime}:00`,
      numberOfPeople: newPeople,
      request: newRequest,
      status: selectedReservation.status,
      reservationId: selectedReservation.reservationId,
    };

    try {
      const response = await fetch(`http://localhost:8080/api/reservations/${selectedReservation.reservationId}`, {
        method: 'PUT',
        headers: {          
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
         },
        body: JSON.stringify(updatedReservation),
      });

      if (response.ok) {
        alert('예약이 변경되었습니다.');
        fetchReservations();
        handleCloseModal();
      } else {
        alert('예약 변경 실패');
      }
    } catch (error) {
      console.error('예약 변경 오류:', error);
      alert('오류가 발생했습니다.');
    }
  };

  const handlePay = async (reservation) => {
    const storeId = "store-69e65e79-61d9-4e6c-a0da-a06c6e32e37b";
    const channelKey = "channel-key-5e0eb0b0-5c03-4514-85a3-38dbc688666c";
    const paymentId = `payment-${crypto.randomUUID()}`;
    const orderName = `${reservation.restaurantName} 예약`;
    const totalAmount = reservation.numberOfPeople * 10000;

    try {
      const response = await PortOne.requestPayment({
        storeId,
        channelKey,
        paymentId,
        orderName,
        totalAmount,
        currency: "CURRENCY_KRW",
        payMethod: "EASY_PAY",
      });

      if (response.code) return alert(response.message);

      const paymentResponse = await fetch(`http://localhost:8080/payment`, {
        method: "POST",
        headers: { 
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, reservationId: reservation.reservationId, amount: totalAmount }),
      });

      if (!paymentResponse.ok) {
        throw new Error("결제 데이터 전송 실패");
      }

      const updateResponse = await fetch(`http://localhost:8080/api/reservations/${reservation.reservationId}`, { // 수정된 부분
        method: "PATCH",
        headers: { 
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json" },
        body: JSON.stringify({ status: "RESERVING" }), // 수정된 부분
      });

      if (updateResponse.ok) {
        fetchReservations();
        alert("결제가 성공적으로 완료되었습니다!");
      } else {
        alert("결제는 성공했으나 상태 업데이트에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("결제 중 오류가 발생했습니다.");
    }
  };

  const handleReviewClick = (reservation) => {
    const reservationTime = new Date(reservation.reservationTime);
    const currentTime = new Date();
    const timeDifference = currentTime - reservationTime;
    const oneHour = 60 * 60 * 1000; // 수정: 30분 -> 1시간

    if (timeDifference >= oneHour) {
      history(`/review/reviewform/${reservation.restaurantId}/${reservation.reservationId}`);
    } else {
      alert("리뷰는 예약 시간으로부터 1시간이 지난 후에 작성 가능합니다."); // 수정: 30분 -> 1시간
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReservations.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <Container className="reservation-status-container">
      <Row className="mb-3">
        <Col className="text-start" style={{marginTop:"20px"}}>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <h3>예약 현황</h3>
        </Col>
        <Col className="text-end">
          <Dropdown>
            <Dropdown.Toggle variant="secondary" id="status-filter">
              {statusFilter}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {statusOptions.map((status) => (
                <Dropdown.Item 
                  key={status}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      <Row className="g-4">
        {currentItems.map((reservation) => (
          <Col md={6} key={reservation.reservationId}>
            <Card className="h-100 d-flex flex-column">
              <Card.Header className="fs-5">예약</Card.Header>
              <Card.Body className="d-flex flex-column" style={{ cursor: "default" }}>
                <div className="d-flex mb-3">
                  <img
                    src={reservation.restaurantImage}
                    alt={reservation.restaurantName}
                    style={{
                      width: '120px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '5px',
                      marginRight: '20px'
                    }}
                  />
                  <div>
                    <Card.Text>
                      <strong>레스토랑:</strong> {reservation.restaurantName}<br />
                      {reservation.reservationTime.split('T')[0]} / {reservation.reservationTime.split('T')[1].substring(0, 5)} / {reservation.numberOfPeople}명<br />
                      <strong>{statusLabels[reservation.status]}</strong><br />
                      <strong>요청 사항 :</strong> {reservation.request}
                    </Card.Text>
                  </div>
                </div>
                <div className="mt-auto">
                  <Container className="d-flex justify-content-end p-0">
                    {!isPast(new Date(reservation.reservationTime)) && (
                      <>
                        <Button variant="danger" onClick={() => handleCancelReservation(reservation.reservationId)} className="me-2">예약 취소</Button>
                        <Button variant="secondary" onClick={() => handleOpenChangeModal(reservation)} className="me-2">예약 변경</Button>
                      </>
                    )}
                    {reservation.status === "PENDING" && (
                      <Button variant="primary" onClick={() => handlePay(reservation)} className="me-2">결제</Button>
                    )}
                    {reservation.status !== "NOSHOW" && reservation.status !== "PENDING" && (
                      <Button variant="success" onClick={() => handleReviewClick(reservation)}>리뷰 작성</Button>
                    )}
                  </Container>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Container className='mt-4'>
        <PaginationComponent 
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange} 
        />
      </Container>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>예약 변경</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDate">
              <Form.Label>날짜</Form.Label>
              <Form.Control
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </Form.Group>
            <Form.Group controlId="formTime">
              <Form.Label>시간</Form.Label>
              <Form.Control
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                min={newDate === format(new Date(), 'yyyy-MM-dd') ? format(new Date(), 'HH:mm') : '00:00'}
              />
            </Form.Group>
            <Form.Group controlId="formPeople">
              <Form.Label>인원</Form.Label>
              <Form.Control type="number" value={newPeople} onChange={(e) => setNewPeople(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formRequest">
              <Form.Label>요청 사항</Form.Label>
              <Form.Control type="text" value={newRequest} onChange={(e) => setNewRequest(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>닫기</Button>
          <Button variant="primary" onClick={handleSaveChanges}>저장</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ReservationStatus;

