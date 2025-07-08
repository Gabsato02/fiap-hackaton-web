import * as React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/pt-br';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CustomDatePickerProps } from '../../domain/entities';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function CustomDatePicker({
  label,
  value,
  onChange,
}: CustomDatePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      <DemoContainer components={['DatePicker']}>
        <DatePicker
          sx={{ width: '100%' }}
          label={label}
          value={value}
          onChange={onChange}
          timezone="America/Sao_Paulo"
        />
      </DemoContainer>
    </LocalizationProvider>
  );
};
