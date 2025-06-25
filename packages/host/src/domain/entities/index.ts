import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';
import { Dispatch, ReactNode, SetStateAction } from 'react';

export type MainAppBarProps = {
  onChangePage: Dispatch<SetStateAction<string>>;
};

export type RemoteProjects = {
  route: string,
  text: string,
  icon: ReactNode,
};

export type UserInfo = {
  token: string,
  email: string,
  name: string,
  photoURL: string,
  id: string,
};