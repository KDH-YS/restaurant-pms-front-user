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

//레스토랑 검색 api
export const searchRestaurants = async (searchParams) => {
  try {
    const response = await axios.get(`${BASE_URL}/restaurant/search`, { 
      params: searchParams,
     });
    return response.data;
  } catch (error) {
    console.error('Error searching restaurants:', error);
    throw new Error('레스토랑 검색에 실패했습니다.');
  }
};

// 레스토랑 상세 정보를 가져오는 함수
export const fetchRestaurantDetail = async (restaurantId) => {
  const restaurantIdString = String(restaurantId);
  try {
    const response = await axios.get(`${BASE_URL}/restaurant/${restaurantId}`);
    return response.data;  // 서버에서 반환한 레스토랑 정보
  } catch (error) {
    console.error('레스토랑 상세 정보를 가져오는 데 실패했습니다:', error);
    throw error;  // 에러를 다시 던짐
  }
};

//메뉴 가져옥api
export const fetchRestaurantMenu = async (restaurantId) => {
  try {
    const response = await axios.get(`${BASE_URL}/restaurant/menu/${restaurantId}`, {
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
    const response = await axios.post(`${BASE_URL}/restaurant/create`, restaurantData);
    console.log(response.data.message);
    return response.data;
  } catch (error) {
    console.error('레스토랑 등록 실패:', error.response?.data?.error || error.message);
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
export const fetchRestaurantSchedule = async (restaurantId) => {
  try {
    const response = await axios.get(`${BASE_URL}/schedule/${restaurantId}`, {
     });
    return response.data;
  } catch (error) {
    console.error('Error searching restaurants:', error);
    throw new Error('레스토랑 스케줄을 가져오는 데 실패했습니다.');
  }
}