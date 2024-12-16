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
  userName: getStorageValue("userName"),
  userRole: getDecodedTokenValue("auth"),
  restaurantId: getDecodedTokenValue("restaurantId"),

  // 상태 업데이트 액션
  setToken: (newToken, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("token", newToken);
    set({ token: newToken });
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

  setUserRole: (newUserRole, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("auth", newUserRole);
    set({ userRole: newUserRole });
  },

  clearAuth: () => {
    ["token", "userId", "userName", "userRole", "restaurantId"].forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    set({
      token: null,
      userId: null,
      userName: null,
      userRole: null,
      restaurantId: null,
    });
  },
}));
