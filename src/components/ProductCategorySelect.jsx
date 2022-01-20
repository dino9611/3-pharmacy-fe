import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


export default function MultipleSelect({ input, setinput, label, options }) {
  const theme = useTheme();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setinput({
      ...input,
      categories: typeof value === 'string' ? value.split(',') : value,
    });
  };

  return (
    <div>
      <FormControl sx={{ mt: 1, width: '100%' }}>
        <InputLabel id='demo-multiple-name-label'>{label}</InputLabel>
        <Select
          labelId='demo-multiple-name-label'
          id='demo-multiple-name'
          multiple
          value={input.categories}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          MenuProps={MenuProps}
        >
          {options.map((el) => (
            <MenuItem
              key={el.id}
              value={el.id}
            >
              {el.categoryName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
