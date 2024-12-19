import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, Form, Modal, Dropdown } from 'react-bootstrap';
import * as PortOne from '@portone/browser-sdk/v2';
import { useNavigate } from 'react-router-dom';
import usePaginationStore from 'store/pagination';
import PaginationComponent from './PaginationComponent';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from 'store/authStore';
import { isPast, format } from 'date-fns';

const ReservationStatus = () => {
  const [reservations, setReservations] = useState([]); // 예약 리스트
  const [selectedReservation, setSelectedReservation] = useState(null); // 선택된 예약
  const [showModal, setShowModal] = useState(false); // 모달 표시 여부
  const [newDate, setNewDate] = useState(''); // 새로 입력된 날짜
  const [newTime, setNewTime] = useState(''); // 새로 입력된 시간
  const [newPeople, setNewPeople] = useState(''); // 새로 입력된 인원수
  const [newRequest, setNewRequest] = useState(''); // 새로 입력된 요청사항
  const { token } = useAuthStore();
  const { currentPage, setCurrentPage,  setTotalPages, pageGroup } = usePaginationStore();

  const itemsPerPage = 8;  //  한 페이지에 보여줄 아이템 수
  const itemsPerGroup = 40; // 한 그룹당 보여줄 아이템 수
  const history = useNavigate();
  const statusLabels = {
    COMPLETED: '방문 완료',
    RESERVING: '예약 중',
    PENDING: '결제 대기중',
    NOSHOW: '노쇼',
  };

  const fetchReservations = async () => {
    try {
      const userId = jwtDecode(token).userId;
  
      // API 요청
      const response = await fetch(`http://localhost:8080/api/reservations?userId=${userId}&page=${pageGroup}&size=300`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // 인증 토큰을 추가
          'Content-Type': 'application/json'
        }
      });
  
      // 응답 상태 확인
      if (!response.ok) {
        throw new Error(`예약 데이터를 가져오는 중 오류 발생: ${response.statusText}`);
      }
  
      // 응답 본문을 JSON으로 파싱
      const data = await response.json();
  
      // 예약 시간 비교 및 정렬
      const currentTime = new Date();  // 현재 시간
      const sortedReservations = data.list.sort((a, b) => {
        const reservationTimeA = new Date(a.reservationTime);
        const reservationTimeB = new Date(b.reservationTime);
  
        // 예약 시간이 지난 경우 후순위로 미루기 위해, 예약 시간이 더 가까운 것을 먼저 배치
        if (reservationTimeA < currentTime && reservationTimeB >= currentTime) {
          return 1;  // 예약시간이 지난 A는 후순위로
        } else if (reservationTimeA >= currentTime && reservationTimeB < currentTime) {
          return -1; // 예약시간이 지난 B는 후순위로
        }
  
        return reservationTimeA - reservationTimeB; // 예약 시간이 가까운 것부터 우선적으로 정렬
      });
  
      // 정렬된 예약 데이터를 상태로 설정
      setReservations(sortedReservations);
      setTotalPages(Math.ceil(data.total / itemsPerPage));
    } catch (error) {
      console.error('예약 데이터를 가져오는 중 오류 발생:', error);
    }
  };
  
    useEffect(() => {
      fetchReservations();
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
      const response = await fetch(`http://localhost:8080/api/reservations/manager/${reservationId}`, {
        method: 'DELETE',
        headers:{
          'Authorization': `Bearer ${token}`, // 인증 토큰을 추가
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
    const updatedReservation = {
      restaurantName: selectedReservation.restaurantName,
      reservationTime: `${newDate}T${newTime}:00`,
      numberOfPeople: newPeople,
      request: newRequest,
      status:selectedReservation.status,
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
        headers: { 
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, reservationId: reservation.reservationId, amount: totalAmount }),
      });

      if (!paymentResponse.ok) {
        throw new Error("결제 데이터 전송 실패");
      }

      const updateResponse = await fetch(`http://localhost:8080/payment`, {
        method: "PATCH",
        headers: { 
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json" },
        body: JSON.stringify(reservation.reservationId),
      });

      if (updateResponse.ok) {
        window.location.reload();
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
    const oneHour = 60 * 30 * 1000;

    if (timeDifference >= oneHour) {
      history(`/review/reviewform/${reservation.restaurantId}/${reservation.reservationId}`);
    } else {
      alert("리뷰는 예약 시간으로부터 30분이 지난 후에 작성 가능합니다.");
    }
  };

  const currentReservations = reservations.slice(
    ((currentPage - 1) % 5) * itemsPerPage, 
    ((currentPage - 1) % 5 + 1) * itemsPerPage
  );



  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // 필요한 경우 여기서 새로운 데이터를 불러올 수 있습니다.
  };

  return (
<Container className="reservation-status-container">
  {/* 예약 현황 제목 오른쪽 끝 정렬 */}
  <Row className="mb-3">
    <Col className="text-start" style={{marginTop:"20px"}}>
      <h3>예약 현황</h3>
    </Col>
  </Row>

  {/* 드롭다운 추가 */}
  <Row className="mb-3">
    <Col>
    <Button>방문예정</Button>&ensp;
    <Button>방문완료</Button>&ensp;
    <Button>취소/노쇼</Button>
    </Col>
    <Col className="text-end">
      <Dropdown>
        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
          정렬
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">최신 순</Dropdown.Item>
          <Dropdown.Item href="#/action-2">오래된 순</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Col>
  </Row>

  <Row className="g-4">
      {currentReservations.map((reservation) => (
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

  {/* 페이지네이션 컴포넌트 */}
  <Container className='mt-4'>
  <PaginationComponent  onPageChange={handlePageChange} />
  </Container>
  {/* 예약 변경 Modal */}
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

