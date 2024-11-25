// src/api.js
import axios from 'axios';

// API 기본 URL을 설정합니다.
const BASE_URL = 'http://localhost:8080/api';

// GET 요청을 처리하는 함수 예시
export const fetchRestaurants = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/restaurant`);  // params 없이 요청
    return response.data;
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }
};
export const searchRestaurants = async (params) => {
    try {
      const response = await axios.get(`${BASE_URL}/restaurant/search`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      throw error;
    }
  };