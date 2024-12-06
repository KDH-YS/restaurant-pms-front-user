import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';  // Modal 추가
import { deleteMenu, fetchRestaurantMenu, fetchRestaurants, insertMenu, searchRestaurants } from '../pages/restaurants/api.js';
import { deleteRestaurant } from '../pages/restaurants/api.js';
import Pagination from '../components/restaurants/Pagination';
import { useNavigate } from 'react-router-dom'; // navigate 사용
import SearchBar from './restaurants/SearchBar.jsx';

const AdminRestaurantTable = () => {
  const [restaurants, setRestaurants] = useState([]);  // 레스토랑 목록 상태
  const [loading, setLoading] = useState(false);  // 로딩 상태
  const [error, setError] = useState(null);  // 에러 상태
  const [currentPage, setCurrentPage] = useState(1);  // 현재 페이지
  const [totalPages, setTotalPages] = useState(1);  // 총 페이지 수
  const [showModal, setShowModal] = useState(false);  // Modal 표시 여부 상태
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);  // 선택된 레스토랑 정보
  const [searchParams, setSearchParams] = useState({
    query: '',               // 검색어
    searchOption: 'all',    // 검색 조건 (기본값: 도시)
    name: '',
    city: '',                // 도시
    district: '',            // 구
    neighborhood: '',        // 동
    foodType: '',            // 음식 종류
    parkingAvailable: '', // 주차 가능 여부
    reservationAvailable: '', // 예약 가능 여부
    page: 1,
    size: 24,
  });
  const [totalRestaurants, setTotalRestaurants] = useState(0);  // 총 레스토랑 수 상태
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);  // 새 메뉴 입력 상태
  const [newMenu, setNewMenu] = useState({ name: '', price: '' }); // 새로운 메뉴 객체

  // 레스토랑 데이터 가져오기
  const fetchRestaurantsData = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchRestaurants(page, 24);
      if (response.content) {
        setRestaurants(response.content);
        setTotalPages(response.totalPages);
        setTotalRestaurants(response.totalElements);  // 전체 레스토랑 수 업데이트

      } else {
        setRestaurants([]);
        setTotalPages(1);
        setTotalRestaurants(0);  // 레스토랑이 없을 경우 0으로 설정

      }
    } catch (err) {
      console.error('레스토랑 목록을 가져오는 데 실패했습니다:', err);
      setError('레스토랑 목록을 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

    // 메뉴 추가 함수
  const handleAddMenu = async () => {

    if (newMenu.name && newMenu.price) {
      const newMenuData = { name: newMenu.name, price: parseFloat(newMenu.price) };
      
      try {
        // 메뉴 추가 API 호출
        const response = await insertMenu(selectedRestaurant.restaurantId, newMenuData);

        if (response.status === 201) {
          // 메뉴 추가 후 레스토랑 메뉴 다시 가져오기
          const updatedMenuList = await fetchRestaurantMenu(selectedRestaurant.restaurantId);
          setMenu(updatedMenuList); // 메뉴 리스트 상태 업데이트
          
          // selectedRestaurant의 menuList도 업데이트
          setSelectedRestaurant(prevState => ({
            ...prevState,
            menuList: updatedMenuList,
          }));
          setNewMenu({ name: '', price: '' }); // 입력 필드 초기화
        }
      } catch (error) {
        console.error("메뉴 추가 실패:", error);
      }
    }
  };

  const handleDeleteMenu = async (menuId) => {
    const isConfirmed = window.confirm("삭제하시겠습니까?");
    if (!isConfirmed) return;
  try {
    const restaurantId = selectedRestaurant.restaurantId;

    // 메뉴 삭제 API 호출
    const response = await deleteMenu(restaurantId, menuId);

    if (response.status === 204) {
      // 메뉴 삭제 후, 메뉴 리스트 상태 업데이트
      const updatedMenuList = await fetchRestaurantMenu(restaurantId);
      // 상태 업데이트
   setSelectedRestaurant(prevState => {
    return {
      ...prevState,
      menuList: updatedMenuList, // 메뉴 리스트 갱신
    };
  });
      // 팝업에서 메뉴 삭제 후 바로 반영되도록 상태 갱신
      setMenu(updatedMenuList);
    }
  } catch (error) {
    console.error("메뉴 삭제 실패:", error.response?.data?.error || error.message);
  }
};

  
  const deleteRestaurantsData = async (restaurantId) => {
    const isConfirmed = window.confirm("정말로 삭제하시겠습니까?");
    if (!isConfirmed) return;

    try {
      await deleteRestaurant(restaurantId);  // 레스토랑 삭제 API 호출
      setRestaurants((prevRestaurants) =>
        prevRestaurants.filter((restaurant) => restaurant.restaurantId !== restaurantId)
      );
      setShowModal(false);  // 레스토랑 삭제 후 Modal 닫기
      window.location.reload();  // 화면 새로고침
      window.alert("삭제되었습니다.");
    } catch (error) {
      console.error('레스토랑 삭제 실패:', error.response?.data?.error || error.message);
    }
  };
 
  useEffect(() => {
    if (!searchParams.query) {
      fetchRestaurantsData(currentPage);  // 전체 레스토랑 페이지네이션
    } else {
      handleSearch(currentPage);  // 검색 시 페이지네이션 적용
    }
  }, [currentPage]);

  const handleEditClick = (restaurantId) => {
    navigate(`/restaurant/update/${restaurantId}`);
  };

  const handleAddClick = () => {
    navigate('/restaurant/add');
  };

// 페이지 변경 시 호출되는 함수
const handlePageChange = async (page) => {
  setCurrentPage(page); // 현재 페이지 업데이트
  // 페이지네이션 후 스크롤을 맨 위로 이동
  window.scrollTo(0, 0);
};

  // 레스토랑을 클릭했을 때 Modal을 열고 해당 레스토랑 정보를 전달
  const handleRestaurantClick = async (restaurant) => {
    setSelectedRestaurant(restaurant);

    try {
      // 레스토랑의 메뉴 리스트를 가져옴
      const menuData = await fetchRestaurantMenu(restaurant.restaurantId);
      setMenu(menuData);  // 메뉴 리스트 상태 업데이트
    } catch (error) {
      console.error("메뉴를 가져오는 데 실패했습니다:", error);
      setError("메뉴를 가져오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRestaurant(null);  // Modal 닫을 때 선택된 레스토랑 정보 초기화
  };

  // 검색어 입력 시 상태 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value,
    });
  };

  // 체크박스 상태 업데이트
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: checked ? true : "",  // 체크되면 'true', 체크 해제되면 '' (비어있는 상태)
    }));
  };

  // 레스토랑 검색 API
const handleSearch = async (page = 1) => {

  setLoading(true);  // 로딩 시작
  setError(null);    // 이전 에러 초기화

  const { query, searchOption, parkingAvailable, reservationAvailable } = searchParams;

  const params = {
    page: page,
    size: 24,  // 페이지 크기
  };

  // 전체 조건 (query에 맞는 모든 조건으로 검색)
  if (query && searchOption === 'all') {
    params.query = query;  // 전체 검색
  } else {
    // 검색어 조건에 맞게 검색
    if (query) {
      if (searchOption === 'name') {
        params.name = query;  // 가게명 검색
      } else if (searchOption === 'city') {
        params.city = query;  // 도시 검색
      } else if (searchOption === 'district') {
        params.district = query;  // 구 검색
      } else if (searchOption === 'neighborhood') {
        params.neighborhood = query;  // 동 검색
      } else if (searchOption === 'foodType') {
        params.foodType = query;  // 음식 종류 검색
      }
    }
  }

  // 체크박스 필터링 (값이 비어있지 않으면 필터에 추가)
  if (parkingAvailable !== "") params.parkingAvailable = parkingAvailable;
  if (reservationAvailable !== "") params.reservationAvailable = reservationAvailable;

  try {
    // `searchRestaurants`를 사용하여 검색
    const response = await searchRestaurants(params);

    if (response.content) {
      setRestaurants(response.content);  // 검색된 레스토랑 목록 업데이트
      setTotalPages(response.totalPages);  // 총 페이지 수 설정
    } else {
      setRestaurants([]);
      setTotalPages(1);
    }
  } catch (err) {
    console.error('검색 오류:', err);
    setError('검색 중 오류가 발생했습니다.');
  } finally {
    setLoading(false);  // 로딩 종료
  }
};

  return (
    <div>
      <h2>레스토랑 목록</h2>
       {/* 총 레스토랑 수 표시 */}
    <div className="mb-3">
      <strong>총 레스토랑 수: {totalRestaurants}개</strong>
    </div>

      <SearchBar
       searchParams={searchParams}
       handleInputChange={handleInputChange}
       handleCheckboxChange={handleCheckboxChange}
       handleSearch={handleSearch}
      />
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
          </tr>
        </thead>
        <tbody>
          {restaurants.map((restaurant) => (
            <tr key={restaurant.restaurantId} onClick={() => handleRestaurantClick(restaurant)}>
              <td>{restaurant.restaurantId}</td>
              <td>{restaurant.name}</td>
              <td>
                {restaurant.roadAddr || restaurant.jibunAddr} {restaurant.detailAddr}
              </td>
              <td>{restaurant.foodType}</td>
              <td>{restaurant.parkingAvailable ? '가능' : '불가능'}</td>
              <td>{restaurant.reservationAvailable ? '가능' : '불가능'}</td>
              <td>{restaurant.phone}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* 레스토랑 등록 버튼 */}
      <div className="d-flex justify-content-end mt-3">
        <Button variant="primary" onClick={handleAddClick}>
          레스토랑 등록
        </Button>
      </div>
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
      />
      {/* Modal로 레스토랑 상세 정보 표시 */}
      {selectedRestaurant && (
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedRestaurant.name} 상세 정보</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>이름:</strong> {selectedRestaurant.name}</p>
            <p><strong>주소:</strong> {selectedRestaurant.roadAddr || selectedRestaurant.jibunAddr} {selectedRestaurant.detailAddr}</p>
            <p><strong>음식 종류:</strong> {selectedRestaurant.foodType}</p>
            <p><strong>전화번호:</strong> {selectedRestaurant.phone}</p>
            <p><strong>주차 가능:</strong> {selectedRestaurant.parkingAvailable ? '가능' : '불가능'}</p>
            <p><strong>예약 가능:</strong> {selectedRestaurant.reservationAvailable ? '가능' : '불가능'}</p>
          
            {/* 메뉴 추가 폼 */}
            <Form.Control
              type="text"
              placeholder="메뉴 이름을 입력하세요"
              value={newMenu.name}
              onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
            />
            <Form.Control
              type="number"
              placeholder="메뉴 가격을 입력하세요"
              value={newMenu.price}
              onChange={(e) => setNewMenu({ ...newMenu, price: e.target.value })}
            />
            <Button variant="success" onClick={handleAddMenu}>메뉴 추가</Button>

            <h5 className="mt-3">메뉴 리스트</h5>
            <ul>
              {menu.map((item, index) => (
                <li key={index}>
                  {item.name} - {item.price}원
                  <Button
                    variant="danger"
                    size="sm"
                    className="ml-2"
                    onClick={() => handleDeleteMenu(item.menuId)}
                  >
                    삭제
                  </Button>
                </li>
              ))}
            </ul>
          </Modal.Body>
          <Modal.Footer>
          <Button variant="warning" onClick={() => handleEditClick(selectedRestaurant.restaurantId)}>
                  수정
                </Button>{' '}
                <Button variant="danger" onClick={() => deleteRestaurantsData(selectedRestaurant.restaurantId)}>
                  삭제
                </Button>
            <Button variant="secondary" onClick={handleCloseModal}>
              닫기
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default AdminRestaurantTable;
