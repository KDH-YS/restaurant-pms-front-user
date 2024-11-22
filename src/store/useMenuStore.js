import {create} from 'zustand';
import { persist } from 'zustand/middleware';

const useMenuStore = create(
  persist(
    (set) => ({
      selectedCard: null,  // 초기값은 null
      setSelectedCard: (card) => set({ selectedCard: card }),
    }),
    {
      name: 'menu-store',  // 로컬 스토리지에 저장할 키
      getStorage: () => localStorage,  // localStorage에 저장
    }
  )
);

export default useMenuStore;
