import React from 'react';
// ? mui
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
// ? redux
import { useDispatch, useSelector } from 'react-redux';
import {
  getRawMaterialsRecord,
  resetState,
} from '../../redux/actions/rawMaterialActions';
// ? components
import AdminTable from '../../components/Tables/AdminTable';

import { toast } from 'react-toastify';
import { useDebounce } from '../../hooks';

export default function RawMaterialsRecordTable() {
  const dispatch = useDispatch();
  // * pagination states
  const rows = useSelector(
    (state) => state.rawMaterialReducers.rawMaterialsRecord
  );
  const [date, setdate] = React.useState(new Date());

  const [search, setsearch] = React.useState('');
  const handleSearchChange = useDebounce((e) => setsearch(e.target.value), 700);

  const maxPage = 5;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(6);
  // * modal states
  const [currRows, setcurrRows] = React.useState([]);
  React.useEffect(() => {
    setcurrRows(
      rows.filter(
        (el, i) => rowsPerPage * page <= i && i < rowsPerPage * (page + 1)
      )
    );
  }, [page, rowsPerPage, rows]);
  React.useEffect(() => {
    dispatch(
      getRawMaterialsRecord(
        {
          page: 1,
          limit: rowsPerPage * maxPage,
          date,
          search,
        },
        {
          handleFail: (err) =>
            toast.error(err.response?.data.message || 'server error'),
        }
      )
    );
  }, [dispatch, page, rowsPerPage, date, search]);
  React.useEffect(() => {
    return () => dispatch(resetState('rawMaterialsRecord'));
  }, [dispatch]);
  // const emptyRows = rowsPerPage - rows.length;
  const emptyRows = rowsPerPage - currRows.length;

  return (
    <div className='px-3 w-full bg-lightblue'>
      <div className='flex items-center'>
        <div className='flex border-2 rounded h-12'>
          <input
            type='text'
            className='px-4 py-2 w-80'
            placeholder='Search Raw Materials...'
            onChange={handleSearchChange}
          />
          <div className='flex items-center justify-center px-4 border-l bg-white'>
            <svg
              className='w-6 h-6 text-gray-600'
              fill='currentColor'
              viewBox='0 0 24 24'
            >
              <path d='M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z' />
            </svg>
          </div>
        </div>
        <div className='rounded-lg px-4 my-3 flex justify-around'>
          <p className='font-semibold text-sm rounded-lg self-center mx-3'>
            Filter by Date
          </p>
          <div className='flex'>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label='Basic example'
                value={date}
                minDate={new Date(`2012-03-01`)}
                maxDate={new Date()}
                onChange={(newValue) => {
                  setdate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </div>
        </div>
      </div>
      <AdminTable
        name='Inventory Changes'
        page={page}
        maxPage={Math.ceil(rows.length / rowsPerPage)}
        cols={[
          {
            label: 'Raw Material Name',
            className: 'font-semibold',
            format: (row) => row.materialName,
          },
          {
            label: 'Inventory Change',
            className: '',
            format: (row) =>
              `${row.inventoryChange < 0 ? '-' : '+'}${
                row.inventoryChange < 0
                  ? Math.ceil(row.inventoryChange / row.unitPerBottle)
                  : Math.floor(row.inventoryChange / row.unitPerBottle)
              } bottles ${
                (row.inventoryChange < 0 ? -1 : 1) *
                ((row.inventoryChange % row.unitPerBottle) / 1000).toFixed(3)
              } ${row.unit === 'mg' ? 'gr' : row.unit === 'ml' ? 'liter' : ''}`,
          },
          {
            label: 'Unit Per Bottle',
            className: '',
            format: (row) =>
              `${(row.unitPerBottle / 1000).toLocaleString('en-US', {
                maximumFractionDigits: 2,
              })} ${
                row.unit === 'mg' ? 'gr' : row.unit === 'ml' ? 'liter' : ''
              } per bottle`,
          },
        ]}
        rows={currRows}
        rowsPerPage={rowsPerPage}
        emptyRows={emptyRows}
        actions={{
          setPage,
          setRowsPerPage,
        }}
        notFound={!rows.length}
      />
    </div>
  );
}
