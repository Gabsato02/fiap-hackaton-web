import { create } from 'zustand';

export const useUserStore = create((set) => ({
  userInfo: {
    name: 'Gabriel'
  },
  setUserInfo: () => set((state) => ({ userInfo: state.userInfo })),
}))