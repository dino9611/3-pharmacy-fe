import React from 'react';
import { createPopper } from '@popperjs/core';
// ? hooks
import { useOnClickOutside } from '../../hooks';
// ? components
// import AdminTableDropdown from '../Dropdowns/AdminTableDropdown';
import ModalOverlay from '../Modals/AdminModalOverlay';

export default function AdminTable({
  name,
  page,
  maxPage,
  cols,
  rows,
  emptyRows,
  actions: { setPage },
  CreateModal,
  EditModal,
  DeleteModal,
  DetailsModal,
}) {
  const [createIsOpen, setcreateIsOpen] = React.useState(false);
  const [editIsOpen, seteditIsOpen] = React.useState(false);
  const [deleteIsOpen, setdeleteIsOpen] = React.useState();
  const [detailsIsOpen, setdetailsIsOpen] = React.useState(false);

  const toggleCreateModal =
    CreateModal === undefined
      ? undefined
      : () => setcreateIsOpen(!createIsOpen);
  const toggleDeleteModal =
    DeleteModal === undefined
      ? undefined
      : () => setdeleteIsOpen(!deleteIsOpen);
  const toggleEditModal =
    EditModal === undefined ? undefined : () => seteditIsOpen(!editIsOpen);
  const toggleDetailsModal =
    DetailsModal === undefined
      ? undefined
      : () => setdetailsIsOpen(!detailsIsOpen);

  const [initialValues, setinitialValues] = React.useState({
    materialName: 'Chemical A',
    bottleChange: 0,
    unitPerBottle: 0,
    priceRpPerUnit: 0,
    unit: 'mg',
  });

  return (
    <>
      {CreateModal !== undefined && (
        <ModalOverlay isOpen={createIsOpen} toggleModal={toggleCreateModal}>
          <CreateModal toggleModal={toggleCreateModal} />
        </ModalOverlay>
      )}
      {EditModal !== undefined && (
        <ModalOverlay isOpen={editIsOpen} toggleModal={toggleEditModal}>
          <EditModal
            toggleModal={toggleEditModal}
            initialValues={initialValues}
          />
        </ModalOverlay>
      )}
      {DeleteModal !== undefined && (
        <ModalOverlay isOpen={deleteIsOpen} toggleModal={toggleDeleteModal}>
          <DetailsModal toggleModal={toggleDeleteModal} />
        </ModalOverlay>
      )}
      {DetailsModal !== undefined && (
        <ModalOverlay isOpen={detailsIsOpen} toggleModal={toggleDetailsModal}>
          <DetailsModal toggleModal={toggleDetailsModal} />
        </ModalOverlay>
      )}
      <div className='relative flex flex-col min-w-0 break-words w-full shadow-lg rounded bg-white my-1'>
        <div className='rounded-t mb-0 px-4 py-3 bg-blue-200 border-black border border-solid'>
          <div className='flex flex-wrap items-center'>
            <div className='relative w-full px-4 max-w-full flex justify-between'>
              <h3 className='text-xl font-semibold self-center'>{name}</h3>
              <button className='btn btn-blue' onClick={toggleCreateModal}>
                Add New {name}
              </button>
            </div>
          </div>
        </div>
        <div className='block w-full overflow-x-auto'>
          {/* Table */}
          <table className='w-full table-auto'>
            <thead>
              <tr>
                {cols.map((el) => (
                  <th
                    key={el.label}
                    className='h-10 text-center align-middle border-black border border-solid text-xs uppercase border-l-0 border-r-0 border-t-0 whitespace-nowrap font-semibold bg-gray-200'
                  >
                    {el.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className='h-12 bg-blue-300'>
                  {cols.map((col) =>
                    col.label ? (
                      <td
                        key={col.label}
                        className={'text-sm text-center ' + col.className}
                      >
                        {col.format(row)}
                      </td>
                    ) : (
                      <td
                        key={col.label}
                        className='h-12 flex justify-center items-center'
                      >
                        <AdminTableDropdown
                          row={row}
                          index={index}
                          setinitialValues={setinitialValues}
                          toggleDetailsModal={toggleDetailsModal}
                          toggleEditModal={toggleEditModal}
                          toggleDeleteModal={toggleDeleteModal}
                        />
                      </td>
                    )
                  )}
                </tr>
              ))}
              {emptyRows > 0 && renderEmptyRows(emptyRows, cols)}
            </tbody>
          </table>
          <div className='flex justify-end rounded-b mb-0 px-12 py-3 bg-blue-200 border-black border border-solid'>
            <button
              onClick={() => setPage(page - 1)}
              className={`mx-4 ${
                page < 1 ? 'text-gray-500 cursor-default' : 'text-black'
              }`}
              disabled={page < 1}
            >
              <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
            <button
              onClick={() => setPage(page + 1)}
              className={`mx-4 ${
                emptyRows > 0 || page + 1 >= maxPage
                  ? 'text-gray-500 cursor-default'
                  : 'text-black'
              }`}
              disabled={emptyRows > 0 || page + 1 >= maxPage}
            >
              <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                  clipRule='evenodd'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

const renderEmptyRows = (n, cols) => {
  let out = [];
  for (let i = 0; i < n; i++)
    out.push(
      <tr key={i} className='h-12 bg-blue-300'>
        <td colSpan={cols.length}></td>
      </tr>
    );
  return out;
};

const AdminTableDropdown = ({
  row,
  index,
  setinitialValues,
  toggleDetailsModal,
  toggleEditModal,
  toggleDeleteModal,
}) => {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: 'left-start',
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  useOnClickOutside(popoverDropdownRef, closeDropdownPopover);

  return (
    <>
      <a
        className='text-blueGray-500 py-1 px-3'
        href='#pablo'
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <svg
          className='w-5 h-5 cursor-pointer'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeWidth='2'
            d='M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z'
          ></path>
        </svg>
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? 'block ' : 'hidden ') +
          'bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48'
        }
      >
        {toggleDetailsModal !== undefined && (
          <a
            href='#pablo'
            className={
              'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700'
            }
            onClick={(e) => {
              e.preventDefault();
              closeDropdownPopover();
              toggleDetailsModal();
              setinitialValues({ ...row, index });
            }}
          >
            Details
          </a>
        )}
        {toggleEditModal !== undefined && (
          <a
            href='#pablo'
            className={
              'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700'
            }
            onClick={(e) => {
              e.preventDefault();
              closeDropdownPopover();
              toggleEditModal();
              setinitialValues({ ...row, index });
            }}
          >
            Edit
          </a>
        )}
        {toggleDeleteModal !== undefined && (
          <a
            href='#pablo'
            className={
              'text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700'
            }
            onClick={(e) => {
              e.preventDefault();
              closeDropdownPopover();
              toggleDeleteModal();
            }}
          >
            Delete
          </a>
        )}
      </div>
    </>
  );
};
