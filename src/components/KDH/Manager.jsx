import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, Form, Pagination, Dropdown } from 'react-bootstrap';

const Manager = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('ALL'); // 필터 상태
  const [statusUpdates, setStatusUpdates] = useState({}); // 상태를 객체로 관리

  const itemsPerPage = 6;
  const statusOptions = ['ALL', 'CANCELREQUEST', 'PENDING', 'RESERVING', 'NOSHOW', 'COMPLETE'];

  // 예약 데이터를 API에서 받아오는 useEffect
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/reservations/manager/5');
        const data = await response.json();
        setReservations(data);
        setFilteredReservations(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchReservations();
  }, []);

  // 예약 상태 필터링 함수
  const filterReservations = (status) => {
    let filtered = reservations;
    if (status !== 'ALL') {
      filtered = reservations.filter((reservation) => reservation.status === status);
    }
    setFilteredReservations(filtered);
    setCurrentPage(1);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  };

  // 예약 상태 변경 함수 (PUT 요청)
  const updateReservationStatus = async (reservationId, updatedStatus) => {
    if (!updatedStatus) {
      alert('상태를 선택하세요.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/reservations/manager/${reservationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: updatedStatus }),
      });

      if (response.ok) {
        alert('예약 상태가 변경되었습니다.');
        const updatedReservationsResponse = await fetch('http://localhost:8080/api/reservations/manager/1');
        const updatedReservations = await updatedReservationsResponse.json();
        setReservations(updatedReservations);
        setFilteredReservations(updatedReservations);
      } else {
        alert('예약 상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('예약 상태 변경 오류:', error);
      alert('예약 상태 변경 중 오류가 발생했습니다.');
    }
  };

  // 현재 페이지에 해당하는 예약 항목을 계산
  const currentReservations = filteredReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 상태를 예약 ID별로 설정하는 함수
  const setReservationStatus = (reservationId, status) => {
    setStatusUpdates((prev) => ({ ...prev, [reservationId]: status }));
  };

  // 예약 취소 함수
  const handleCancelReservation = async (reservationId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/reservations/manager/${reservationId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        alert('예약이 취소되었습니다.');
        const updatedReservationsResponse = await fetch('http://localhost:8080/api/reservations/manager/1');
        const updatedReservations = await updatedReservationsResponse.json();
        setReservations(updatedReservations);
        setFilteredReservations(updatedReservations);
      } else {
        alert('예약 취소에 실패했습니다.');
      }
    } catch (error) {
      console.error('예약 취소 오류:', error);
      alert('예약 취소 중 오류가 발생했습니다.');
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container className="reservation-status-container">
      <h3>나의 레스토랑 예약 현황</h3>

      {/* 예약 상태 필터 */}
      <div className="mb-3">
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="status-filter">
            {statusFilter}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {statusOptions.map((status) => (
              <Dropdown.Item
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  filterReservations(status);
                }}
              >
                {status}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <Row>
        {currentReservations.map((reservation) => (
          <Col md={6} key={reservation.reservationId} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>예약</Card.Title>
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
                  <br />
                  <strong>이메일:</strong> {reservation.user.email}
                  <br />
                  <strong>전화번호:</strong> {reservation.user.phone}
                </Card.Text>

                {/* 예약 상태 변경 드롭다운 */}
                <div className="mb-3">
                  <Dropdown>
                    <Dropdown.Toggle variant="info" id={`status-update-${reservation.reservationId}`}>
                      {statusUpdates[reservation.reservationId] || '상태 변경'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {statusOptions.map((status) => (
                        <Dropdown.Item
                          key={status}
                          onClick={() => setReservationStatus(reservation.reservationId, status)}
                        >
                          {status}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

                <div className="d-flex justify-content-between">
                  <Button variant="danger" onClick={() => handleCancelReservation(reservation.reservationId)}>
                    예약 취소
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() =>
                      updateReservationStatus(
                        reservation.reservationId,
                        statusUpdates[reservation.reservationId]
                      )
                    }
                  >
                    예약 변경
                  </Button>
                </div>

                <Form className="mt-3">
                  <Form.Group>
                    <Form.Label>요청 사항</Form.Label>
                    <Card.Text>{reservation.request}</Card.Text>
                  </Form.Group>
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
    </Container>
  );
};

export default Manager;
