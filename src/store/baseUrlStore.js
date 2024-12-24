import {create} from 'zustand';

// 상태를 설정할 때, set 없이 baseURL을 고정값으로 설정합니다.
const baseUrlStore = create(() => ({
  apiUrl: 'http://localhost:8080', // baseURL을 고정값으로 설정
}));

export default baseUrlStore;