import React from 'react';
// ? redux
import { useDispatch, useSelector } from 'react-redux';
import {
  getRawMaterialsRecord,
  resetState,
} from '../../redux/actions/rawMaterialActions';
// ? components
import AdminTable from '../../components/Tables/AdminTable';
import ViewsDatePicker from '../../components/ViewsDatePicker';

import { toast } from 'react-toastify';
import { useDebounce } from '../../hooks';

const currYear = new Date().getFullYear();

export default function RawMaterialsRecordTable() {
  const dispatch = useDispatch();
  // * pagination states
  const rows = useSelector(
    (state) => state.rawMaterialReducers.rawMaterialsRecord
  );
  const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const rowsPerPage = 7;

  const [yearMonthStart, setyearMonthStart] = React.useState(
    new Date(currYear - 1, 0, 1)
  );
  const [yearMonthEnd, setyearMonthEnd] = React.useState(
    // new Date(currYear, 11, 1)
    new Date()
  );

  const [search, setsearch] = React.useState('');
  const handleSearchChange = useDebounce((e) => setsearch(e.target.value), 700);

  // * modal states
  React.useEffect(() => {
    dispatch(
      getRawMaterialsRecord(
        {
          page: page + 1,
          limit: rowsPerPage,
          yearMonthStart,
          yearMonthEnd,
          search,
        },
        {
          handleFail: (err) =>
            toast.error(err.response?.data.message || 'server error'),
          handleFinally: (rowLength) =>
            !rowLength &&
            !search &&
            toast.error('no results', { autoClose: 2000 }),
        }
      )
    );
    return () => dispatch(resetState('rawMaterials'));
  }, [dispatch, page, rowsPerPage, yearMonthStart, yearMonthEnd, search]);
  const emptyRows = rowsPerPage - rows.length;

  return (
    <div className='px-3'>
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
          <p className='font-semibold text-sm rounded-lg self-center'>
            Year-Month Range
          </p>
          <div className='flex'>
            <ViewsDatePicker
              value={yearMonthStart}
              setvalue={setyearMonthStart}
              label='From'
            />
            <ViewsDatePicker
              value={yearMonthEnd}
              setvalue={setyearMonthEnd}
              label='Up To'
            />
          </div>
        </div>
      </div>
      <AdminTable
        name='Raw Materials Changes'
        page={page}
        maxPage={5}
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
              `${
                row.inventoryChange < 0
                  ? Math.ceil(row.inventoryChange / row.unitPerBottle)
                  : Math.floor(row.inventoryChange / row.unitPerBottle)
              } bottles ${(
                row.inventoryChange %
                (row.unitPerBottle / 1000)
              ).toFixed(2)} ${
                row.unit === 'mg' ? 'gr' : row.unit === 'ml' ? 'liter' : ''
              }`,
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
        rows={rows}
        emptyRows={emptyRows}
        actions={{
          setPage,
        }}
      />
    </div>
  );
}
