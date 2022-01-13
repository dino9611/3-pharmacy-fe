import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


export default function StatusSelect({ input, setinput, label }) {

    const dataStatus = [
        {id: 1, status: "imgAcc", display: "Image Accepted"},
        {id: 2, status: "imgRej", display: "Image Rejected"},
        {id: 3, status: "expired", display: "Payment Expired"},
        {id: 4, status: "paymentAcc", display: "Payment Accepted"},
        {id: 5, status: "paymentRej", display: "Payment Rejected"},
        {id: 6, status: "rejected", display: "Rejected"},
        {id: 7, status: "processing", display: "On Process"},
        {id: 8, status: "otw", display: "On Delivery"},
        {id: 9, status: "delivered", display: "Delivered"},
    ]
    // const initialStatus = [
    //   {status: ''}
    // ]

    // const handleChange = (e) => {
    //     setinput({...input, status : e.target.value});
    // };
    const handleChange = (event) => {
      setinput(event.target.value);
    };

  return (
    <div>
      <FormControl sx={{ mt: 1, width: '100%' }}>
        <InputLabel id='demo-simple-select-label'>{label}</InputLabel>
        <Select
          fullWidth
          labelId='demo-simple-select-label'
          id='demo-simple-select'
          value={input}
          // value={initialStatus.status}
          onChange={handleChange}
          label={label}
        >
          {dataStatus.map((val) => (
            <MenuItem
              key={val.id}
              value={val.status}
            >
              {val.display}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
