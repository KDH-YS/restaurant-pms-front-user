// src/api.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

//레스토랑 리스트 반환
export const fetchRestaurants = async (page = 1, size = 24) => {
  try {
    const response = await axios.get(`${BASE_URL}/restaurant`, { params: { page, size } });
    return response.data;  // 응답 데이터 그대로 반환
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }
};

// 레스토랑 검색 및 전체 검색 API 통합
export const searchRestaurants = async (searchParams) => {
  try {
    // query가 존재하면 전체 검색을, 없으면 일반 검색을 처리
    const endpoint = `${BASE_URL}/restaurant/search`;

    const response = await axios.get(endpoint, {
      params: searchParams,  // 검색 조건을 params로 전달
    });

    return response.data;
  } catch (error) {
    console.error('Error searching restaurants:', error);
    throw new Error('레스토랑 검색에 실패했습니다.');
  }
};


// 레스토랑 상세 정보를 가져오는 함수
export const fetchRestaurantDetail = async (restaurantId,token) => {
  const restaurantIdString = String(restaurantId);
  try {
    const response = await axios.get(`${BASE_URL}/restaurant/${restaurantId}`,{
      method:'get',
      headers:{
        'Authorization': `Bearer ${token}`, // 인증 토큰을 추가
        'Content-Type': 'application/json'
      }
    });
    return response.data;  // 서버에서 반환한 레스토랑 정보
  } catch (error) {
    console.error('레스토랑 상세 정보를 가져오는 데 실패했습니다:', error);
    throw error;  // 에러를 다시 던짐
  }
};

//메뉴 가져옥api
export const fetchRestaurantMenu = async (restaurantId,token) => {
  try {
    const response = await axios.get(`${BASE_URL}/restaurant/menu/${restaurantId}`,{
      method:'get',
      headers:{
        'Authorization': `Bearer ${token}`, // 인증 토큰을 추가
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching restaurants:', error);
    throw new Error('레스토랑 메뉴를 가져오는 데 실패했습니다.');
  }
}

//레스토랑 등록하
export const registerRestaurant = async (restaurantData) => {
  try {
    // 'totalSeats'는 숫자로 변환해줍니다.
    const dataToSend = {
      ...restaurantData,
      totalSeats: parseInt(restaurantData.totalSeats, 10), // totalSeats를 숫자로 변환
    };

    console.log("전송할 레스토랑 데이터:", dataToSend); // 데이터 확인

    const response = await axios.post(`${BASE_URL}/restaurant/create`, dataToSend);
    
    // 서버 응답 메시지 로그 출력
    console.log(response.data.message);
    return response.data;
  } catch (error) {
    // 에러 메시지 출력
    console.error('레스토랑 등록 실패:', error.response?.data?.error || error.message);
    console.log('Full error:', error);  // 전체 오류 확인

  }
};


//레스토랑 수정하기

export const updateRestaurant = async (restaurantId, updatedData) => {
  try {
    const response = await axios.put(`${BASE_URL}/restaurant/update/${restaurantId}`, updatedData);

    // 응답에서 message를 안전하게 반환
    if (response && response.data && response.data.message) {
      return response.data; // 응답 데이터 반환
    } else {
      throw new Error('서버에서 message를 반환하지 않았습니다.');
    }
  } catch (error) {
    console.error('레스토랑 수정 실패:', error.response?.data?.error || error.message);
    throw error; // 에러를 외부로 던져서 상위에서 처리하도록 함
  }
};


//레스토랑 지우기 삭제

export const deleteRestaurant = async (restaurantId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/restaurant/delete/${restaurantId}`);
    console.log(response.data.message);
  } catch (error) {
    console.error('레스토랑 삭제 실패:', error.response?.data?.error || error.message);
  }
};

//스케줄 가져옥api
export const fetchRestaurantSchedule = async (restaurantId,token) => {
  try {
    const response = await axios.get(`${BASE_URL}/schedule/${restaurantId}`,{
      method:'get',
      headers:{
        'Authorization': `Bearer ${token}`, // 인증 토큰을 추가
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching restaurants:', error);
    throw new Error('레스토랑 스케줄을 가져오는 데 실패했습니다.');
  }
}

// 메뉴 등록 함수
export const insertMenu = async (restaurantId, menuData) => {
  try {
    const response = await axios.post(`${BASE_URL}/restaurant/menu/${restaurantId}/insert`, menuData);
    return response;
  } catch (error) {
    console.error('메뉴 등록 실패:', error);
    throw error; // 호출한 곳에서 예외를 처리할 수 있도록 오류를 던집니다.
  }
};

// 메뉴 삭제 함수
export const deleteMenu = async (restaurantId, menuId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/restaurant/menu/${restaurantId}/${menuId}/delete`);
    return response;
  } catch (error) {
    console.error('메뉴 삭제 실패:', error);
    throw error; // 호출한 곳에서 예외를 처리할 수 있도록 오류를 던집니다.
  }
};