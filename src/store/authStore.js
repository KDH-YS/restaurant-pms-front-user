// store/authStore.js
import { create } from 'zustand';
import {jwtDecode} from 'jwt-decode'; // jwt-decode 모듈 가져오기

export const useAuthStore = create((set) => ({
  // 초기값을 로컬스토리지나 세션스토리지에서 읽어옵니다.
  token: localStorage.getItem("token") || sessionStorage.getItem("token") || null,

  // token이 있을 경우, jwtDecode로 userId를 추출합니다.
  userId: (() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    return token ? jwtDecode(token).userId : null;
  })(),

  // userName 초기화 (token이 있을 경우에만 디코딩한 값으로 설정)
  userName: localStorage.getItem("userName") || sessionStorage.getItem("userName")|| null,

  // userRole 초기화 (token이 있을 경우에만 디코딩한 값으로 설정)
  userRole: (() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    return token ? jwtDecode(token).userRole : localStorage.getItem("userRole") || sessionStorage.getItem("userRole") || null;
  })(),

  // restaurantId 초기화 (로컬 스토리지 또는 세션 스토리지에서 읽어옴)
  restaurantId:   (() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    return token ? jwtDecode(token).restaurantId  : null;
  })(),



  // 상태 업데이트 액션
  setToken: (newToken, rememberMe = false) => {
    // rememberMe가 true이면 로컬스토리지, 아니면 세션스토리지에 저장
    if (rememberMe) {
      localStorage.setItem("token", newToken);
    } else {
      sessionStorage.setItem("token", newToken);
    }
    set({ token: newToken });
  },

  setRestaurantId: (newRestaurantId) => set({ restaurantId: newRestaurantId }),
  setUserId: (newUserId) => set({ userId: newUserId }),

  setUserName: (newUserName, rememberMe = false) => {
    // rememberMe가 true이면 로컬스토리지, 아니면 세션스토리지에 저장
    if (rememberMe) {
      localStorage.setItem("userName", newUserName);
    } else {
      sessionStorage.setItem("userName", newUserName);
    }
    set({ userName: newUserName });
  },
  setUserRole: (newUserRole) => set({ userRole: newUserRole }),

  // 로그아웃 처리
  clearAuth: () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.removeItem("userId");
    sessionStorage.removeItem("userId");
    localStorage.removeItem("userName");
    sessionStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    sessionStorage.removeItem("userRole");
    localStorage.removeItem("restaurantId");
    sessionStorage.removeItem("restaurantId");

    set({
      token: null,
      userId: null,
      userName: null,
      userRole: null,
      restaurantId: null,
    });
  },
}));
