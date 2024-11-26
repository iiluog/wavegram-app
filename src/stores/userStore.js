import { create } from 'zustand';

const useUserStore = create((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  clearCurrentUser: () => set({ currentUser: null }),
  logout: () => {
    // Rimuovi il token se lo stai usando
    localStorage.removeItem('token');
    // Resetta lo stato dell'utente
    set({ currentUser: null });
  },
  updateUser: (updatedUser) => set((state) => ({
    currentUser: { ...state.currentUser, ...updatedUser }
  })),
}));

export default useUserStore;