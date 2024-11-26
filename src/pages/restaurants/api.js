// src/api.js
import axios from 'axios';

// API 기본 URL을 설정합니다.
const BASE_URL = 'http://localhost:8080/api';

// GET 요청을 처리하는 함수 예시
export const fetchRestaurants = async (page = 1, size = 24) => {
  try {
    const response = await axios.get(`${BASE_URL}/restaurant`, {
      params: {
        page,  // 페이지 번호
        size   // 페이지 크기
      }
    });
    // console.log('fetchRestaurants 응답 데이터:', response.data);  // 응답 데이터 확인용
    // 응답 형식에 맞게 데이터를 반환
    return response.data;  // 만약 response.data가 { content: [...] } 형식이면 return response.data.content;
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }
};
// 수정된 searchRestaurants 예시
export const searchRestaurants = async (params) => {
  try {
    const response = await axios.get(`${BASE_URL}/restaurant/search`, { params });
    console.log('searchRestaurants 응답 데이터:', response.data);  // 응답 데이터 확인용
    return response.data;  // 응답 데이터 형식에 맞게 처리
  } catch (error) {
    console.error('Error searching restaurants:', error);
    throw error;
  }
  };