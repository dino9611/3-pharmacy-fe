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
import { getRawMaterials } from '../../redux/actions/rawMaterialActions';
// ? components
import CreateModal from '../../components/CreateRawMaterialModal';
import EditModal from '../../components/EditRawMaterialModal';

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
  const rows = useSelector((state) => state.rawMaterialReducers);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // * modal states
  const [editModalIsOpen, seteditModalIsOpen] = React.useState(false);
  const [modalIsOpen, setmodalIsOpen] = React.useState(false);

  const [input, setinput] = React.useState({
    materialName: '',
    bottleChange: '',
    bottles: '',
    unitPerBottle: '',
    priceRpPerUnit: '',
    unit: '',
  });
  const initInput = React.useRef(null);

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

  const handleRowDoubleClick = (row) => {
    const { id, materialName, unitPerBottle, priceRpPerUnit, unit } = row;
    initInput.current = {
      materialName,
      bottleChange: 0,
      unitPerBottle,
      priceRpPerUnit,
      unit,
    };
    setinput({
      id,
      materialName,
      bottleChange: 0,
      unitPerBottle,
      priceRpPerUnit,
      unit,
    });
    seteditModalIsOpen(true);
    // update raw_material based on id of the element with index i in rows array
    // get id of raw_material in rows array and get the single
    // replace element of index i in rows array with the updated raw_material
  };

  return (
    <>
      <EditModal
        title='Edit Raw Material'
        initInput={initInput}
        input={input}
        setinput={setinput}
        open={editModalIsOpen}
        setOpen={seteditModalIsOpen}
      />
      <CreateModal
        title='Add Raw Material'
        open={modalIsOpen}
        setOpen={setmodalIsOpen}
      />
      <TableContainer
        sx={{ width: 3 / 4, top: 15, right: 15, position: 'absolute' }}
        elevation={12}
        component={Paper}
      >
        <Table sx={{ minWidth: 500 }} aria-label='custom pagination table'>
          <TableHead>
            <TableRow>
              <TableCell component='th' scope='row'>
                raw material name
              </TableCell>
              <TableCell align='right'>inventory</TableCell>
              <TableCell align='right'>unit per bottle</TableCell>
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
                  className=' hover:bg-gray-200 cursor-pointer'
                  onDoubleClick={() => handleRowDoubleClick(row)}
                  key={row.id}
                >
                  <TableCell component='th' scope='row'>
                    {row.materialName}
                  </TableCell>
                  {/* <TableCell style={{ width: 160 }} align='right'>
                {row.inventory}
              </TableCell> */}
                  <TableCell align='right'>
                    {`${Math.floor(
                      row.inventory / row.unitPerBottle
                    )} bottles ${row.inventory % row.unitPerBottle} ${
                      row.unit
                    }`}
                  </TableCell>
                  <TableCell align='right'>
                    {`${row.unitPerBottle} ${row.unit} per bottle`}
                  </TableCell>
                  <TableCell align='right'>
                    {`${(row.priceRpPerUnit * row.unitPerBottle).toLocaleString(
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
                <button
                  onClick={() => setmodalIsOpen(!modalIsOpen)}
                  className='btn bg-third text-white hover:bg-primary-450 transition-colors'
                >
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
    </>
  );
}
