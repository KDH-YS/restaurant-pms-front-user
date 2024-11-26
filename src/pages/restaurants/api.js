// src/api.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

export const fetchRestaurants = async (page = 1, size = 24) => {
  try {
    const response = await axios.get(`${BASE_URL}/restaurant`, { params: { page, size } });
    return response.data;  // 응답 데이터 그대로 반환
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }
};

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
