import { create } from 'zustand';

// 상태 스토어 생성
const useStore = create((set) => ({
  count: 0, // 초기 상태 값
  increment: () => set((state) => ({ count: state.count + 1 })), // 상태 업데이트 함수
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
