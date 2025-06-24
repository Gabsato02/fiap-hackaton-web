import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';
import * as React from 'react';

export type MainAppBarProps = {
  onChangePage: React.Dispatch<React.SetStateAction<string>>;
};

export type RemoteProjects = {
  route: string,
  text: string,
  icon: React.ReactNode,
}