import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

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

function getStyles(name, compositions, theme) {
  return {
    fontWeight:
      compositions.indexOf(name) === -1 || true
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelect({ input, setinput, label, options }) {
  const theme = useTheme();

  const prevLength = React.useRef(0);

  const handleChange = (event) => {
    let {
      target: { value },
    } = event;
    value = typeof value === 'string' ? value.split(',') : value;
    if (prevLength.current <= value.length) {
      setOpen(true);
    } else {
      const removeIndex = value.length - 1;
      input.compositions.splice(removeIndex, 1);
      input.compositionsAmount.splice(removeIndex, 1);
    }
    prevLength.current = value.length;
    setinput({
      ...input,
      compositions: value,
    });
  };

  // * dialog
  const [open, setOpen] = React.useState(false);
  const [amount, setamount] = React.useState(0);

  const handleCancel = () => {
    setOpen(false);
    input.compositions.pop();
    setamount(0);
  };
  const handleConfirm = () => {
    setOpen(false);
    const compositionsAmount = [
      ...input.compositionsAmount,
      parseFloat(amount),
    ];
    setinput({ ...input, compositionsAmount });
    setamount(0);
  };

  // console.log(input);
  return (
    <div>
      <Dialog open={open} onClose={handleCancel}>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='composition amount'
            type='number'
            fullWidth
            value={amount}
            onChange={(e) => setamount(e.target.value)}
            variant='standard'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>

      <FormControl sx={{ mt: 1, width: '100%' }}>
        <InputLabel id='demo-multiple-name-label'>{label}</InputLabel>
        <Select
          labelId='demo-multiple-name-label'
          id='demo-multiple-name'
          multiple
          value={input.compositions}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          MenuProps={MenuProps}
        >
          {options.map((el) => (
            <MenuItem
              key={el.id}
              value={el.id}
              style={getStyles(el.id, input.compositions, theme)}
            >
              {el.materialName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
