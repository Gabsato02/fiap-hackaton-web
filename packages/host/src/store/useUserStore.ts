import { create } from 'zustand';
import { UserInfo } from '../domain/entities';

interface UserStore {
  userInfo: UserInfo;
  setUserInfo: (newInfo: UserInfo) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userInfo: {} as UserInfo,
  setUserInfo: (newInfo: UserInfo) =>
    set(() => ({
      userInfo: {
        ...newInfo,
      },
    })),
}));
