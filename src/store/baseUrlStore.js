import { create } from 'zustand';

// baseURL을 동적으로 수정할 수 있도록 set을 사용한 상태 관리
const useBaseUrlStore = create((set) => ({
  apiUrl: 'http://localhost:8080', // 초기 값
  setApiUrl: (newUrl) => set({ apiUrl: newUrl }), // baseUrl을 동적으로 변경하는 함수
}));

export default useBaseUrlStore;
