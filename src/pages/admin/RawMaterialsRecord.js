import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  // TextField,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import {
  FirstPage,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage,
} from '@mui/icons-material';
// ? redux
import { useDispatch, useSelector } from 'react-redux';
import {
  getRawMaterialsRecord,
  resetState,
} from '../../redux/actions/rawMaterialActions';

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label='first page'
      >
        {theme.direction === 'rtl' ? <LastPage /> : <FirstPage />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label='previous page'
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='next page'
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label='last page'
      >
        {theme.direction === 'rtl' ? <FirstPage /> : <LastPage />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function RawMaterialsTable() {
  const dispatch = useDispatch();
  // * pagination states
  const rows = useSelector(
    (state) => state.rawMaterialReducers.rawMaterialsRecord
  );
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(7);

  React.useEffect(() => {
    dispatch(getRawMaterialsRecord(page + 1, rowsPerPage));
    return () => dispatch(resetState('rawMaterialsRecord'));
  }, [dispatch, page, rowsPerPage]);

  // Avoid a layout jump when reaching the last page with empty rows.
  // * for frontend pagination
  // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  // * for backend pagination
  const emptyRows = rowsPerPage - rows.length;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowDoubleClick = (row) => {
    // const {
    //   raw_material_id,
    //   materialName,
    //   inventoryChange,
    //   unitPerBottle,
    //   unit,
    //   datetime,
    //   admin_id,
    // } = row;
  };

  return (
    <>
      <div className='w-4/5 absolute right-0'>
        <div className='mb-3 pt-0 h-24'></div>
        <TableContainer elevation={12} component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label='custom pagination table'>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#b4c6a6' }}>
                <TableCell component='th' scope='row'>
                  raw material name
                </TableCell>
                <TableCell align='right'>inventory change</TableCell>
                <TableCell align='right'>unit per bottle</TableCell>
                <TableCell align='right'>datetime</TableCell>
                <TableCell align='right'>admin id</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow
                  sx={{ height: 60 }}
                  onDoubleClick={() => handleRowDoubleClick(row)}
                  key={i}
                >
                  <TableCell component='th' scope='row'>
                    {row.materialName}
                  </TableCell>
                  <TableCell align='right'>
                    {`${Math.floor(
                      row.inventoryChange / row.unitPerBottle
                    )} bottles ${(
                      row.inventoryChange % row.unitPerBottle
                    ).toFixed(2)} ${row.unit}`}
                  </TableCell>
                  <TableCell align='right'>
                    {`${row.unitPerBottle} ${row.unit} per bottle`}
                  </TableCell>
                  <TableCell align='right'>
                    {row.datetime.slice(0, 19).replace('T', ' ')}
                  </TableCell>
                  <TableCell align='right'>
                    {row.admin_id || 'automatic'}
                  </TableCell>
                </TableRow>
              ))}

              {emptyRows > 0 && (
                <TableRow sx={{ height: 60 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow sx={{ backgroundColor: '#b4c6a6' }}>
                <TablePagination
                  // rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  rowsPerPageOptions={[10, 7]}
                  colSpan={5}
                  // * for frontend pagination
                  // count={rows.length}
                  // * for backend pagination (use number of rows from backend. Don't use 'SELECT COUNT(*)')
                  count={100}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
