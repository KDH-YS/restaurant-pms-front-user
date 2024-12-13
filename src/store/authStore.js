// store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null, // JWT 토큰
      userId: null,
      userName: null, // 사용자 이름
      userRole: null, // 사용자 권한
      restaurantId: null,
      setToken: (newToken) => set({ token: newToken }),
      setrestaurantId: (newrestaurantId) => set({ restaurantId: newrestaurantId }),
      setUserId: (newUserId) => set({ userId: newUserId }),
      setUserName: (newUserName) => set({ userName: newUserName }),
      setUserRole: (newUserRole) => set({ userRole: newUserRole }),
      clearAuth: () => set({ token: null, userName: null, userRole: null }), // 로그아웃 시 상태 초기화
    }),
    {
      name: 'auth-storage', // 로컬 스토리지에 저장될 키 이름
      getStorage: () => localStorage, // 로컬 스토리지 사용
    }
  )
);
