import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';  // Bootstrap Table, Button 컴포넌트 사용
import { fetchRestaurants } from '../pages/restaurants/api.js';
import { deleteRestaurant } from '../pages/restaurants/api.js';
import Pagination from '../components/restaurants/Pagination';

const AdminRestaurantTable = () => {
  const [restaurants, setRestaurants] = useState([]);  // API에서 받아온 레스토랑 목록 상태 관리
  const [loading, setLoading] = useState(false);  // 로딩 상태
  const [error, setError] = useState(null);  // 에러 상태
  // 페이지네이션 관련 상태
  const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지
  const [totalPages, setTotalPages] = useState(1);  // 총 페이지 수

  const fetchRestaurantsData = async (page = 1) => {
    setLoading(true); // 로딩 시작
    setError(null); // 이전 에러 초기화

    try {
      const response = await fetchRestaurants(page, 24); // 페이지네이션 적용
      if (response.content) {
        setRestaurants(response.content);  // 레스토랑 목록 업데이트
        setTotalPages(response.totalPages);  // 총 페이지 수 설정
      } else {
        setRestaurants([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('레스토랑 목록을 가져오는 데 실패했습니다:', err);
      setError('레스토랑 목록을 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  const deleteRestaurantsData = async (restaurantId) => {
     // 확인 팝업
     const isConfirmed = window.confirm("정말로 삭제하시겠습니까?");
     if (!isConfirmed) return;  // "아니오"를 클릭하면 아무 일도 하지 않음
 
     try {
      await deleteRestaurant(restaurantId);  // 레스토랑 삭제 요청
      // 삭제 후 레스토랑 목록 갱신
      setRestaurants((prevRestaurants) =>
        prevRestaurants.filter((restaurant) => restaurant.id !== restaurantId)
      );
    } catch (error) {
      console.error('레스토랑 삭제 실패:', error.response?.data?.error || error.message);
    }
  }
    // 페이지 변경 시 호출되는 함수
    const handlePageChange = async (page) => {
      setCurrentPage(page); // 현재 페이지 업데이트
      window.scrollTo(0, 0);
    } ;
  // 예시로 API에서 데이터를 불러오는 코드 (비동기 호출로 교체)
  useEffect(() => {
      fetchRestaurantsData(currentPage);

  }, [currentPage]);

  return (
    <div>
      <h2>레스토랑 목록</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>번호</th>
            <th>이름</th>
            <th>주소</th>
            <th>음식 종류</th>
            <th>주차 가능</th>
            <th>예약 가능</th>
            <th>전화번호</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {restaurants.map((restaurant) => (
            <tr key={restaurant.restaurantId}>
              <td>{restaurant.restaurantId}</td>
              <td>{restaurant.name}</td>
              <td>{restaurant.address}</td>
              <td>{restaurant.foodType}</td>
              <td>{restaurant.parkingAvailable ? '가능' : '불가능'}</td>
              <td>{restaurant.reservationAvailable ? '가능' : '불가능'}</td>
              <td>{restaurant.phone}</td>
              <td>
                <Button variant="warning" size="sm">수정</Button>{' '}
                <Button variant="danger" size="sm"
                onClick={() => deleteRestaurantsData(restaurant.restaurantId)} 
                >삭제</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination 
      currentPage={currentPage} 
      totalPages={totalPages} 
      onPageChange={handlePageChange} 
      />
    </div>
  );
};

export default AdminRestaurantTable;
