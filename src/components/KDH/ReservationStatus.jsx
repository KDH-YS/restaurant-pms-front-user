import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, Form, Modal, Pagination } from 'react-bootstrap';
import 'css/KDH/ReservationStatus.css';
import * as PortOne from '@portone/browser-sdk/v2';
import { useNavigate } from 'react-router-dom';
import RSstate from 'store/RSstate'; 

const ReservationStatus = () => {
  const { reservations, setReservations, selectedReservation, setSelectedReservation, showModal, setShowModal,
    newDate, setNewDate, newTime, setNewTime, newPeople, setNewPeople, newRequest, setNewRequest,
    currentPage, setCurrentPage, totalPages, setTotalPages } = RSstate();

    const [pageGroup, setPageGroup] = useState(1);
    const itemsPerPage = 6;
    const itemsPerGroup = 30; // 한 그룹당 보여줄 아이템 수
    const history = useNavigate();



    const fetchReservations = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/reservations?userId=1&page=${pageGroup}&size=${itemsPerGroup}`);
        const data = await response.json();
        console.log("겟요청실행");
        console.log(data);
        setReservations(data.list);
        setTotalPages(Math.ceil(data.total / itemsPerPage));
      } catch (error) {
        console.error('예약 데이터를 가져오는 중 오류 발생:', error);
      }
    };
  
    useEffect(() => {
      fetchReservations();
      setCurrentPage((pageGroup - 1) * 5 + 1);
      console.log(pageGroup);
    }, [pageGroup]);

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
      const response = await fetch(`http://localhost:8080/api/reservations/user/${reservationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request: 'cancelrequest' }),
      });
      if (response.ok) {
        alert('예약이 취소되었습니다.');
        fetchReservations();
      } else {
        alert('예약 취소에 실패했습니다.');
      }
    } catch (error) {
      console.error('예약 취소 오류:', error);
      alert('오류가 발생했습니다.');
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
        alert('예약이 변경되었습니다.');
        setReservations(reservations.map((res) =>
          res.reservationId === selectedReservation.reservationId ? updatedReservation : res
        ));
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, reservationId: reservation.reservationId, amount: totalAmount }),
      });

      if (!paymentResponse.ok) {
        throw new Error("결제 데이터 전송 실패");
      }

      const updateResponse = await fetch(`http://localhost:8080/payment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservation.reservationId),
      });

      if (updateResponse.ok) {
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
    const oneHour = 60 * 60 * 500; // 1시간을 밀리초로 변환

    if (timeDifference >= oneHour) {
      history.push('/review/reviewform');
    } else {
      alert("리뷰는 예약 시간으로부터 1시간이 지난 후에 작성 가능합니다.");
    }
  };

  const currentReservations = reservations.slice(
    ((currentPage - 1) % 5) * itemsPerPage, 
    ((currentPage - 1) % 5 + 1) * itemsPerPage
  );

  const handlePagination = () => {
    const pageStart = (pageGroup - 1) * 5 + 1;
    const pageEnd = Math.min(pageStart + 4, totalPages);

    const handlePrevGroup = () => {
      if (pageGroup > 1) {
        const newPageGroup = pageGroup - 1;
        setPageGroup(newPageGroup);
        setCurrentPage(newPageGroup * 5);
      }
    };

    const handleNextGroup = () => {
      if (pageGroup * 5 < totalPages) {
        const newPageGroup = pageGroup + 1;
        setPageGroup(newPageGroup);
        setCurrentPage((newPageGroup - 1) * 5 + 1);
      }
    };

    return (
      <>
        <Pagination.Prev
          disabled={pageGroup === 1}
          onClick={handlePrevGroup}
        />
        {[...Array(pageEnd - pageStart + 1)].map((_, index) => (
          <Pagination.Item
            key={pageStart + index}
            active={pageStart + index === currentPage}
            onClick={() => setCurrentPage(pageStart + index)}
          >
            {pageStart + index}
          </Pagination.Item>
        ))}
        <Pagination.Next
          disabled={pageGroup * 5 >= totalPages}
          onClick={handleNextGroup}
        />
      </>
    );
  };

  

  return (
    <Container className="reservation-status-container">
      <h3>예약 현황</h3>
      <Row>
        {currentReservations.map((reservation) => (
          <Col md={6} key={reservation.reservationId} className="mb-3">
            <Card>
              <Card.Body style={{ cursor: "default" }}>
                <Card.Title>예약 정보</Card.Title>
                <Card.Text>
                  <strong>레스토랑:</strong> {reservation.restaurantName}<br />
                  <strong>날짜:</strong> {reservation.reservationTime.split('T')[0]}<br />
                  <strong>시간:</strong> {reservation.reservationTime.split('T')[1].substring(0, 5)}<br />
                  <strong>인원:</strong> {reservation.numberOfPeople}명<br />
                  <strong>상태:</strong> {reservation.status}
                </Card.Text>
                <div className="d-flex justify-content-between">
                  <Button variant="danger" onClick={() => handleCancelReservation(reservation.reservationId)}>예약 취소</Button>
                  <Button variant="secondary" onClick={() => handleOpenChangeModal(reservation)}>예약 변경</Button>
                </div>
                <Form className="mt-3">
                  <Form.Group>
                    <Form.Label>요청 사항</Form.Label>
                    <Card.Text>{reservation.request}</Card.Text>
                  </Form.Group>
                  {reservation.status === "PENDING" && (
                    <Button variant="primary" className="mt-2" onClick={() => handlePay(reservation)}>결제</Button>
                  )}
                  {reservation.status !== "NOSHOW" && reservation.status !== "PENDING" && (
                    <Button variant="success" className="mt-2" onClick={() => handleReviewClick(reservation)}>리뷰 작성</Button>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Pagination>
        {handlePagination()}
      </Pagination>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>예약 변경</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDate">
              <Form.Label>날짜</Form.Label>
              <Form.Control type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formTime">
              <Form.Label>시간</Form.Label>
              <Form.Control type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
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
