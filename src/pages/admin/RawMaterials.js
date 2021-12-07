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
} from '@mui/material';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
// ? redux
import { useDispatch, useSelector } from 'react-redux';
import { getRawMaterials } from '../../redux/actions/rawMaterialActions';

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
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
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
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
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
  const rows = useSelector((state) => state.rawMaterialReducers);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  React.useEffect(() => {
    dispatch(getRawMaterials(page + 1, rowsPerPage));
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

  const handleRowDoubleClick = (id) => {
    console.log(id);
  };

  return (
    <TableContainer component={Paper}>
      <Table
        align='right'
        sx={{ width: 700, minWidth: 500 }}
        aria-label='custom pagination table'
      >
        <TableHead>
          <TableRow>
            <TableCell component='th' scope='row'>
              raw material name
            </TableCell>
            <TableCell align='right'>inventory</TableCell>
            <TableCell align='right'>price per bottle</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            // * for frontend pagination
            // (rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map
            // * for backend pagination
            rows.map((row) => (
              <TableRow
                style={{ cursor: 'pointer' }}
                onDoubleClick={() => handleRowDoubleClick(row.id)}
                key={row.id}
              >
                <TableCell component='th' scope='row'>
                  {row.materialName}
                </TableCell>
                {/* <TableCell style={{ width: 160 }} align='right'>
                {row.inventory}
              </TableCell> */}
                <TableCell align='right'>
                  {`${Math.floor(row.inventory / row.unitPerBottle)} bottles ${
                    row.inventory % row.unitPerBottle
                  } ${row.unit}`}
                </TableCell>
                <TableCell align='right'>
                  {`${(row.priceRpPerUnit * row.inventory).toLocaleString(
                    'en-US',
                    { maximumFractionDigits: 2 }
                  )} Rp`}
                </TableCell>
              </TableRow>
            ))
          }

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>
              <button className='rounded-sm bg-green-500 text-base p-1'>
                Add New Raw Material
              </button>
            </TableCell>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
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
  );
}
