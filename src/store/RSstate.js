import {create} from 'zustand';

const RSstate = create((set) => ({
  // 상태 정의
  reservations: [],
  selectedReservation: null,
  showModal: false,
  newDate: '',
  newTime: '',
  newPeople: '',
  newRequest: '',
  currentPage: 1,
  totalPages: 1,

  // 상태 업데이트 함수들
  setReservations: (reservations) => set({ reservations }),
  setSelectedReservation: (reservation) => set({ selectedReservation: reservation }),
  setShowModal: (show) => set({ showModal: show }),
  setNewDate: (date) => set({ newDate: date }),
  setNewTime: (time) => set({ newTime: time }),
  setNewPeople: (people) => set({ newPeople: people }),
  setNewRequest: (request) => set({ newRequest: request }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setTotalPages: (pages) => set({ totalPages: pages }),
}));

export default RSstate;
