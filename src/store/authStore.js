import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

const getStorageValue = (key) => {
  return localStorage.getItem(key) || sessionStorage.getItem(key) || null;
};

const getDecodedTokenValue = (key) => {
  const token = getStorageValue("token");
  return token ? jwtDecode(token)[key] : null;
};

export const useAuthStore = create((set) => ({
  token: getStorageValue("token"),
  userId: getDecodedTokenValue("userId"),
  userName: getDecodedTokenValue("userName"),
  name: getDecodedTokenValue("name"),
  userRole: getDecodedTokenValue("auth"),
  restaurantId: getDecodedTokenValue("restaurantId"),

  // 상태 업데이트 액션
  setToken: (newToken, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("token", newToken);
    set({ token: newToken });

    // 토큰 설정 시 userName, name, userRole도 함께 디코딩하여 상태에 저장
    const decodedToken = jwtDecode(newToken);
    const userName = decodedToken.user_name; // user_name 디코딩
    const name = decodedToken.name; // name 디코딩
    const userRole = decodedToken.auth;

    set({
      token: newToken,
      userName, // 디코딩된 userName 사용
      name, // 디코딩된 name 사용
      userRole, // 디코딩된 userRole 사용
    });
  },

  setRestaurantId: (newRestaurantId, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("restaurantId", newRestaurantId);
    set({ restaurantId: newRestaurantId });
  },

  setUserId: (newUserId, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("userId", newUserId);
    set({ userId: newUserId });
  },

  setUserName: (newUserName, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("userName", newUserName);
    set({ userName: newUserName });
  },

  setName: (newName, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("name", newName);
    set({ name: newName });
  },

  setUserRole: (newUserRole, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("auth", newUserRole);
    set({ userRole: newUserRole });
  },

  clearAuth: () => {
    ["token", "userId", "userName", "name", "userRole", "restaurantId"].forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    set({
      token: null,
      userId: null,
      userName: null,
      name: null,
      userRole: null,
      restaurantId: null,
    });
  },
}));
