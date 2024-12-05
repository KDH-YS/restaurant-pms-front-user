import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, Dropdown } from 'react-bootstrap';
import usePaginationStore from 'store/pagination';
import PaginationComponent from './PaginationComponent';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // 캘린더 스타일

const ManagerReserve = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [statusUpdates, setStatusUpdates] = useState({});
  const [restaurantId] = useState(123);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datesWithReservations, setDatesWithReservations] = useState([]);

  const itemsPerPage = 6;
  const itemsPerGroup = 30;
  const statusOptions = ['ALL', 'CANCELREQUEST', 'PENDING', 'RESERVING', 'NOSHOW', 'COMPLETE'];

  const { currentPage, setCurrentPage, setTotalPages, pageGroup } = usePaginationStore();

  useEffect(() => {
    fetchReservations();
  }, [pageGroup]);

  useEffect(() => {
    filterByDate(selectedDate);
  }, [selectedDate]);

  const fetchReservations = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/reservations/manager/${restaurantId}?page=${pageGroup}&size=${itemsPerGroup}`);
      const data = await response.json();
      const reservationList = data.list || [];
      setReservations(reservationList);
      setFilteredReservations(reservationList);
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));

      // 예약이 있는 날짜 목록을 업데이트
      const dates = reservationList.map((reservation) => reservation.reservationTime.split('T')[0]);
      setDatesWithReservations([...new Set(dates)]); // 중복 제거
    } catch (error) {
      console.error('예약 정보를 가져오는 중 오류 발생:', error);
    }
  };

  const filterByDate = (date) => {
    const selectedDateString = date.toISOString().split('T')[0];
    const filtered = reservations.filter((reservation) => reservation.reservationTime.split('T')[0] === selectedDateString);
    setFilteredReservations(filtered);
    setCurrentPage(1);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  };

  const filterReservations = (status) => {
    const filtered = status === 'ALL' ? reservations : reservations.filter((reservation) => reservation.status === status);
    setFilteredReservations(filtered);
    setCurrentPage(1);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  };

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
        fetchReservations();
      } else {
        alert('예약 상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('예약 상태 변경 오류:', error);
      alert('예약 상태 변경 중 오류가 발생했습니다.');
    }
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/reservations/manager/${reservationId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
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

  const handleStatusChange = (reservationId, status) => {
    setStatusUpdates((prev) => ({ ...prev, [reservationId]: status }));
  };

  const statusLabels = {
    ALL: '모두',
    CANCELREQUEST: '취소 요청',
    COMPLETE: '방문 완료',
    RESERVING: '예약 중',
    PENDING: '결제 대기중',
    NOSHOW: '노쇼',
  };

  const currentReservations = filteredReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const tileClassName = ({ date, view }) => {
    // 현재 날짜가 예약된 날짜 목록에 포함되면 예약된 날짜로 표시
    const dateString = date.toISOString().split('T')[0];
    if (datesWithReservations.includes(dateString)) {
      return 'reserved-date'; // 예약된 날짜에 클래스를 추가
    }
    return '';
  };

  return (
    <Container className="reservation-status-container">
      <Row className="mb-3" style={{ marginTop: '20px' }}>
        <Col>
          <h3>나의 레스토랑 예약 현황</h3>
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
                  onClick={() => {
                    setStatusFilter(statusLabels[status]);
                    filterReservations(status);
                  }}
                >
                  {statusLabels[status] || status}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={tileClassName} // 날짜에 예약이 있는지 체크
          />
        </Col>
      </Row>

      <Row>
        {currentReservations.map((reservation) => (
          <Col md={6} key={reservation.reservationId} className="mb-3">
            <Card>
              <Card.Header className="fs-5">예약</Card.Header>
              <Card.Body style={{ cursor: 'default' }}>
                <div className="d-flex">
                  <img
                    src={reservation.user?.profileImageUrl}
                    alt={reservation.user?.userName}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '50%',
                      border: '1px solid black',
                      marginRight: '20px',
                    }}
                  />
                  <Card.Text>
                    <strong>{statusLabels[reservation.status] || reservation.status}</strong><br />
                    {reservation.reservationTime.split('T')[0]} / {reservation.reservationTime.split('T')[1].substring(0, 5)} / {reservation.numberOfPeople}명<br />
                    <strong>이메일 : </strong> {reservation.user?.email}
                    <br />
                    <strong>전화번호 : </strong> {reservation.user?.phone}<br />
                    <strong>요청 사항 : </strong>{reservation.request}
                  </Card.Text>
                </div>
                <div className="d-flex justify-content-end p-3">
                  <Dropdown>
                    <Dropdown.Toggle variant="secondary" id={`status-update-${reservation.reservationId}`}>
                      {statusUpdates[reservation.reservationId] || '상태 변경'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {statusOptions.map((status) => (
                        <Dropdown.Item
                          key={status}
                          onClick={() => handleStatusChange(reservation.reservationId, statusLabels[status])}
                        >
                          {statusLabels[status] || status}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>&ensp;
                  <Button
                    variant="primary"
                    onClick={() => updateReservationStatus(reservation.reservationId, statusUpdates[reservation.reservationId])}
                  >
                    예약 변경
                  </Button>&ensp;
                  <Button variant="danger" onClick={() => handleCancelReservation(reservation.reservationId)}>
                    예약 취소
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <PaginationComponent onPageChange={handlePageChange} />
    </Container>
  );
};

export default ManagerReserve;
