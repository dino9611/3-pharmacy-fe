import React from 'react';

import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Box from '@mui/material/Box';

export default function ViewsDatePicker({ value, setvalue, label }) {
  // const [value, setValue] = React.useState(null > new Date());

  // console.log(value);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box m={2}>
        <DatePicker
          inputFormat='yyyy-MM'
          views={['year', 'month']}
          label={label}
          minDate={new Date(`2012-03-01`)}
          maxDate={new Date()}
          value={value}
          // onChange={(e) => console.log(e)}
          onChange={(e) => setvalue(e)}
          renderInput={(params) => <TextField {...params} helperText={null} />}
        />
      </Box>
    </LocalizationProvider>
  );
}
