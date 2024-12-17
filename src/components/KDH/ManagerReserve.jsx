import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, Dropdown } from 'react-bootstrap';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import usePaginationStore from 'store/pagination';
import PaginationComponent from './PaginationComponent';
import 'css/KDH/ManagerReserve.css';
import { useAuthStore } from 'store/authStore';

const ManagerReserve = () => {
  const { token, restaurantId } = useAuthStore();
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [statusFilter, setStatusFilter] = useState('전체');
  const [selectedDate, setSelectedDate] = useState(null);
  const itemsPerPage = 6;
  const itemsPerGroup = 300;
  const statusOptions = ['전체', '결제 대기중', '예약 중', '노쇼', '방문 완료'];
  const { currentPage, setCurrentPage, setTotalPages, pageGroup } = usePaginationStore();
  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    filterReservations(statusFilter, selectedDate);
  }, [statusFilter, selectedDate, reservations]);

  const fetchReservations = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/reservations/manager/${restaurantId}?page=${pageGroup}&size=${itemsPerGroup}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const data = await response.json();
      setReservations(data.list || []);
      setFilteredReservations(data.list || []);
      setTotalPages(Math.ceil((data.total || 0) / itemsPerPage));
    } catch (error) {
      console.error('예약 정보를 가져오는 중 오류 발생:', error);
    }
  };

  const filterReservations = (status, date) => {
    let filtered = reservations;
    if (status !== '전체') {
      filtered = filtered.filter((reservation) => statusLabels[reservation.status] === status);
    }
    if (date) {
      filtered = filtered.filter((reservation) => {
        const reservationDate = new Date(reservation.reservationTime);
        return reservationDate.toDateString() === date.toDateString();
      });
    }
    setFilteredReservations(filtered);
    setCurrentPage(1);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/reservations/manager/${reservationId}`, {
        method: 'DELETE',
        headers: {
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

  const statusLabels = {
    COMPLETED: '방문 완료',
    RESERVING: '예약 중',
    PENDING: '결제 대기중',
    NOSHOW: '노쇼',
  };

  const currentReservations = filteredReservations.slice(
    ((currentPage - 1) % 5) * itemsPerPage, 
    ((currentPage - 1) % 5 + 1) * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const reservationsForDate = reservations.filter(
        (reservation) => new Date(reservation.reservationTime).toDateString() === date.toDateString()
      );
      return reservationsForDate.length > 0 ? (
        <p className="reservation-count">{reservationsForDate.length}</p>
      ) : null;
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <Container className="reservation-status-container">
      <Row className="mb-3" style={{ marginTop: "20px" }}>
        <Col>
          <h3>나의 레스토랑 예약 현황</h3>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Calendar 
            tileContent={tileContent} 
            tileClassName={({ date, view }) => view === 'month' && date.getDay() === 6 ? 'saturday' : null}
            onChange={handleDateChange}
            value={selectedDate}
          />
        </Card.Body>
      </Card>

      <Row className="mb-3">
        <Col className='text-end'>
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

      <Row>
        {currentReservations.map((reservation) => (
          <Col md={6} key={reservation.reservationId} className="mb-3">
            <Card>
              <Card.Header className="fs-5">예약</Card.Header>
              <Card.Body style={{ cursor: 'default' }}>
                <div className="d-flex">
                  <img
                    src="/icon-user.png"
                    alt={reservation.user?.Name}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '50%',
                      marginRight: '20px',
                    }}
                  />
                  <Card.Text>
                    <strong>{statusLabels[reservation.status]}</strong><br />
                    {reservation.reservationTime.split('T')[0]} / {reservation.reservationTime.split('T')[1].substring(0, 5)} / {reservation.numberOfPeople}명<br />
                    <strong>이메일 : </strong> {reservation.user?.email}
                    <br />
                    <strong>전화번호 : </strong> {reservation.user?.phone}<br />
                    <strong>요청 사항 : </strong>{reservation.request}
                  </Card.Text>
                </div>
                <div className="d-flex justify-content-end p-3">
                  {reservation.status !== 'COMPLETED' && reservation.status !== 'NOSHOW' && (
                    <Button variant="danger" onClick={() => handleCancelReservation(reservation.reservationId)}>
                      예약 취소
                    </Button>
                  )}
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

