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
  // 상태 관리를 위한 useState 훅 사용
  const { token, restaurantId } = useAuthStore();
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [statusFilter, setStatusFilter] = useState('전체');
  const [selectedDate, setSelectedDate] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 6;
  const itemsPerGroup = 300;
  const statusOptions = ['전체', '결제 대기중', '예약 중', '노쇼', '방문 완료'];
  const [currentPage, setCurrentPage] = useState(1);
  const pagesPerGroup = 5;
  
  // 현재 페이지가 속한 그룹 계산
  const currentGroup = Math.ceil(currentPage / pagesPerGroup);

  // 컴포넌트가 마운트될 때 예약 정보를 가져옴
  useEffect(() => {
    fetchReservations();
  }, []);

  // 상태 필터나 날짜가 변경될 때마다 예약 목록을 필터링
  useEffect(() => {
    filterReservations(statusFilter, selectedDate);
  }, [statusFilter, selectedDate, reservations]);

  // 세션 스토리지에서 데이터를 가져오는 함수
  const getSessionData = (key) => {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  };

  // 세션 스토리지에 데이터를 저장하는 함수
  const setSessionData = (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value));
  };

  // 예약 정보를 가져오는 함수
  const fetchReservations = async () => {
    const cachedData = getSessionData('reservations');
    const currentTime = new Date().getTime();

    // 캐시된 데이터가 있고 1분이 지나지 않았다면 캐시된 데이터 사용
    if (cachedData && currentTime - cachedData.timestamp < 60000) {
      setReservations(cachedData.data.list || []);
      setFilteredReservations(cachedData.data.list || []);
    } else {
      // 그렇지 않다면 API를 호출하여 새로운 데이터 가져오기
      try {
        const response = await fetch(`http://localhost:8080/api/reservations/manager/${restaurantId}?page=${currentGroup}&size=${itemsPerGroup}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        const data = await response.json();
        
        console.log(data);
        setReservations(data.list || []);
        setTotalItems(data.size);

        setFilteredReservations(data.list || []);
        
        // 세션 스토리지에 새로운 데이터 저장
        setSessionData('reservations', { data, timestamp: currentTime });
      } catch (error) {
        console.error('예약 정보를 가져오는 중 오류 발생:', error);
      }
    }
  };

  // 예약 목록을 필터링하는 함수
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
  };

  // 예약을 취소하는 함수
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

  // 노쇼 처리하는 함수
  const handleNoShow = async (reservationId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/reservations/manager/${reservationId}/no-show`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      if (response.ok) {
        alert('노쇼 처리되었습니다.');
        fetchReservations();
      } else {
        alert('노쇼 처리에 실패했습니다.');
      }
    } catch (error) {
      console.error('노쇼 처리 오류:', error);
      alert('노쇼 처리 중 오류가 발생했습니다.');
    }
  };

  // 예약 상태 레이블
  const statusLabels = {
    COMPLETED: '방문 완료',
    RESERVING: '예약 중',
    PENDING: '결제 대기중',
    NOSHOW: '노쇼',
  };

  // 현재 페이지에 표시할 예약 목록
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReservations.slice(indexOfFirstItem, indexOfLastItem);

  // 페이지 변경 처리 함수
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // 달력에 예약 수를 표시하는 함수
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

  // 날짜 선택 처리 함수
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // 날짜 필터 초기화 함수
  const resetDateFilter = () => {
    setSelectedDate(null);
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

      <Row className="mb-3 d-flex">
        <Col className='d-flex justify-content-start'>
          {/* 날짜 필터 초기화 버튼 */}
          <Button variant="outline-secondary" onClick={resetDateFilter} className="me-2">
            전체 날짜보기
          </Button>
          </Col>
        <Col className='d-flex justify-content-end'>
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
        {currentItems.map((reservation) => (
          <Col md={6} key={reservation.reservationId} className="mb-3">
            <Card className="h-100 d-flex flex-column">
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
                    <>
                      <Button variant="danger" onClick={() => handleCancelReservation(reservation.reservationId)} className="me-2">
                        예약 취소
                      </Button>
                      {/* 예약 중 상태일 때만 노쇼 버튼 표시 */}
                      {reservation.status === 'RESERVING' && (
                        <Button variant="warning" onClick={() => handleNoShow(reservation.reservationId)}>
                          노쇼
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <PaginationComponent 
        currentPage={currentPage}
        totalItems={filteredReservations.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}  
      />
    </Container>
  );
};

export default ManagerReserve;

