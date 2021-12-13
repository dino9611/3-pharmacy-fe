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
import { getProducts, resetState } from '../../redux/actions/productActions';
// ? components
import CreateModal from '../../components/CreateProductModal';
import EditModal from '../../components/EditProductModal';

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
  const rows = useSelector((state) => state.productReducers.products);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(9);

  // * modal states
  const [editModalIsOpen, seteditModalIsOpen] = React.useState(false);
  const [modalIsOpen, setmodalIsOpen] = React.useState(false);

  const [input, setinput] = React.useState({ stock: '' });
  const initInput = React.useRef(null);

  React.useEffect(() => {
    dispatch(getProducts(page + 1, rowsPerPage));
    return () => dispatch(resetState('products'));
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
    const { id, stock } = row;
    initInput.current = {
      stock,
    };
    setinput({
      id,
      stock,
    });
    seteditModalIsOpen(true);
  };

  return (
    <>
      <EditModal
        title='Edit Product'
        initInput={initInput}
        input={input}
        setinput={setinput}
        open={editModalIsOpen}
        setOpen={seteditModalIsOpen}
      />
      <CreateModal
        title='Add Product'
        open={modalIsOpen}
        setOpen={setmodalIsOpen}
      />
      <TableContainer
        sx={{ width: 4 / 5, top: 15, right: 10, position: 'absolute' }}
        elevation={12}
        component={Paper}
      >
        <Table sx={{ minWidth: 500 }} aria-label='custom pagination table'>
          <TableHead>
            <TableRow>
              <TableCell component='th' scope='row'>
                product name
              </TableCell>
              <TableCell align='right'>stock</TableCell>
              <TableCell align='right'>product price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              // * for frontend pagination
              // (rowsPerPage > 0 ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : rows).map
              // * for backend pagination
              rows.map((row) => (
                <TableRow
                  className=' hover:bg-gray-200 cursor-pointer'
                  onDoubleClick={() => handleRowDoubleClick(row)}
                  key={row.id}
                >
                  <TableCell component='th' scope='row'>
                    {row.productName}
                  </TableCell>

                  <TableCell align='right'>{row.stock}</TableCell>
                  <TableCell align='right'>
                    {`Rp ${row.productPriceRp.toLocaleString('en-US', {
                      maximumFractionDigits: 2,
                    })}`}
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
                <button
                  onClick={() => setmodalIsOpen(!modalIsOpen)}
                  className='btn bg-third text-white hover:bg-primary-450 transition-colors'
                >
                  Add New Product
                </button>
              </TableCell>
              <TablePagination
                // rowsPerPageOptions={[5, 9, 25, { label: 'All', value: -1 }]}
                rowsPerPageOptions={[5, 9]}
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
    </>
  );
}
