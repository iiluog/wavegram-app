import { create } from 'zustand';
import { BASE_URL } from '../services/apiSWR';

const useUserStore = create((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  clearCurrentUser: () => set({ currentUser: null }),
  getProfileImageUrl: (image) => {
    if (image) {
      return `${BASE_URL}/uploads/${image}`;
    }
    return 'https://placehold.co/40x40?text=.';
  }
}));

export default useUserStore;