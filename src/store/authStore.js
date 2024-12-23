import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

const getStorageValue = (key) => {
  return localStorage.getItem(key) || sessionStorage.getItem(key) || null;
};
//(key)값을디코딩하는 메소드
const getDecodedTokenValue = (key) => {
  const token = getStorageValue("token");
  return token ? jwtDecode(token)[key] : null;
};

export const useAuthStore = create((set) => ({
  token: getStorageValue("token"),
  userId: getDecodedTokenValue("userId"),
  userName: getDecodedTokenValue("userName"),
  name: getDecodedTokenValue("name"),
  email: getDecodedTokenValue("email"),
  phone: getDecodedTokenValue("phone"),
  userRole: getDecodedTokenValue("auth"),
  restaurantId: getDecodedTokenValue("restaurantId")?.[0]?.restaurantId || null,// 레스토랑이 여러개일경우 처리 필요

  setToken: (newToken, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("token", newToken);
    set({ token: newToken });
  },
  setRestaurantId: (newRestaurantId) => set({ restaurantId: newRestaurantId }),
  setUserId: (newUserId) => set({ userId: newUserId }),
  setUserName: (newUserName) => set({ userName: newUserName }),
  setName: (newName) => set({ name: newName }),
  setEmail: (newEmail) => set({ email: newEmail }),
  setPhone: (newPhone) => set({ phone: newPhone }),
  setUserRole: (newUserRole) => set({ userRole: newUserRole }),

  clearAuth: () => {
    ["token", "userId", "userName", "name", "email", "phone", "userRole", "restaurantId"].forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    set({
      token: null,
      userId: null,
      userName: null,
      name: null,
      email: null,
      phone: null,
      userRole: null,
      restaurantId: null,
    });
  },
}));
