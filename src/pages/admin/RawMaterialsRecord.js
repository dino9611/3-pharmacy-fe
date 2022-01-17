import React from 'react';
// ? redux
import { useDispatch, useSelector } from 'react-redux';
import {
  getRawMaterialsRecord,
  resetState,
} from '../../redux/actions/rawMaterialActions';
// ? components
import AdminTable from '../../components/Tables/AdminTable';

import { toast } from 'react-toastify';

export default function RawMaterialsRecordTable() {
  const dispatch = useDispatch();
  // * pagination states
  const rows = useSelector(
    (state) => state.rawMaterialReducers.rawMaterialsRecord
  );
  const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const rowsPerPage = 8;

  // * modal states
  React.useEffect(() => {
    dispatch(
      getRawMaterialsRecord(page + 1, rowsPerPage, {
        handleFail: (err) =>
          toast.error(err.response?.data.message || 'server error'),
      })
    );
    return () => dispatch(resetState('rawMaterials'));
  }, [dispatch, page, rowsPerPage]);
  const emptyRows = rowsPerPage - rows.length;

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  return (
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
            } bottles ${(row.inventoryChange % row.unitPerBottle).toFixed(2)} ${
              row.unit
            }`,
        },
        {
          label: 'Unit Per Bottle',
          className: '',
          format: (row) => `${row.unitPerBottle} ${row.unit} per bottle`,
        },
        {
          label: 'Datetime',
          className: '',
          format: (row) => row.datetime.slice(0, 19).replace('T', ' '),
        },
        { label: '' },
      ]}
      rows={rows}
      emptyRows={emptyRows}
      actions={{
        setPage,
      }}
    />
  );
}
