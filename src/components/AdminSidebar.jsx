import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// ? css
import './styles/AdminSidebar.css';
// ? redux
import { useDispatch } from 'react-redux';
// ? dropdowns

export default function AdminSideBar(props) {
  const location = useLocation();
  const [collapseShow, setCollapseShow] = React.useState('hidden');
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch({ type: 'logout' });
    localStorage.removeItem('token');
  };
  return (
    <>
      {/* <nav className='bg-primary1 w-1/5 fixed left-0 block top-0 bottom-0 overflow-y-auto overflow-hidden shadow-xl flex-wrap items-center justify-between z-10 py-4 px-6 font-poppins'> */}
      {/* <nav className='font-poppins bg-primary1 w-1/5 md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6'> */}
      <nav className='font-poppins bg-primary1 lg:w-1/5 w-full lg:left-0 lg:block lg:fixed lg:top-0 lg:bottom-0 lg:overflow-y-auto lg:flex-row lg:flex-nowrap lg:overflow-hidden shadow-xl flex flex-wrap items-center justify-between relative z-10 py-4 px-6'>
        <div className='lg:flex-col lg:items-stretch lg:min-h-full lg:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto'>
          {/* Toggler */}
          <button
            className='cursor-pointer text-black opacity-50 lg:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent'
            type='button'
            onClick={() => setCollapseShow('bg-white m-2 py-3 px-6')}
          >
            {/* <i className='fas fa-bars'></i> */}
            <svg
              className='w-8 h-8 text-white'
              data-darkreader-inline-fill=''
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                clipRule='evenodd'
              />
            </svg>
          </button>
          {/* Brand */}
          <Link
            className='lg:block lg:pb-2 mr-0 inline-block whitespace-nowrap p-2 px-0 text-base text-white lg:text-2xl'
            to='/'
          >
            <span className='tokobat-font-style'>Tokobat</span> admin
          </Link>
          {/* User */}
          {/* <ul className='md:hidden items-center flex flex-wrap list-none'>
            <li className='inline-block relative'>
              <NotificationDropdown />
            </li>
            <li className='inline-block relative'><UserDropdown /></li>
          </ul> */}
          {/* Collapse */}
          <div
            className={
              'bg-primary1 lg:flex lg:flex-col lg:items-stretch lg:opacity-100 lg:relative lg:mt-4 lg:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded ' +
              collapseShow
            }
          >
            {/* Collapse header */}
            <div className='lg:min-w-full lg:hidden block pb-4 mb-4'>
              <div className='flex flex-wrap'>
                <div className='w-6/12'>
                  <Link
                    className='lg:block text-left lg:pb-2 text-white mr-0 inline-block whitespace-nowrap p-4 px-0'
                    to='/'
                  >
                    <span className='tokobat-font-style'>Tokobat</span> admin
                  </Link>
                </div>
                <div className='w-6/12 flex justify-end'>
                  <button
                    type='button'
                    className='cursor-pointer text-black opacity-50 lg:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent'
                    onClick={() => setCollapseShow('hidden')}
                  >
                    <svg
                      className='w-6 h-6 text-white'
                      data-darkreader-inline-fill=''
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className='my-4 lg:min-w-full' />
            {/* Heading */}
            <h6 className='lg:min-w-full text-white font-bold block pt-1 pb-4 no-underline'>
              View
            </h6>
            {/* Navigation */}
            <ul className='lg:flex-col lg:min-w-full flex flex-col list-none lg:mb-4'>
              <SidebarLink
                name={'Dashboard'}
                pathname={'/admin/dashboard'}
                location={location}
                svgPath={
                  <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z' />
                }
              />
              <SidebarLink
                name={'History'}
                pathname={'/admin/history'}
                location={location}
                svgPath={
                  <path d='M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z' />
                }
              />
            </ul>

            {/* Divider */}
            <hr className='my-4 lg:min-w-full' />
            {/* Heading */}
            <h6 className='lg:min-w-full text-white font-bold block pt-1 pb-4 no-underline'>
              Manage
            </h6>
            {/* Navigation */}

            <ul className='lg:flex-col lg:min-w-full flex flex-col list-none'>
              <SidebarLink
                name={'Raw Materials'}
                pathname={'/admin/raw_materials'}
                location={location}
                svgPath={
                  <path
                    fillRule='evenodd'
                    d='M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z'
                    clipRule='evenodd'
                  />
                }
              />
              <SidebarLink
                name={'Products'}
                pathname={'/admin/products'}
                location={location}
                svgPath={
                  <path
                    fillRule='evenodd'
                    d='M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z'
                    clipRule='evenodd'
                  />
                }
              />
              <SidebarLink
                name={'Users'}
                pathname={'/admin/users'}
                location={location}
                svgPath={
                  <path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' />
                }
              />
              <SidebarLink
                name={'Prescriptions'}
                pathname={'/admin/prescriptions'}
                location={location}
                svgPath={
                  <>
                    <path d='M9 2a1 1 0 000 2h2a1 1 0 100-2H9z' />
                    <path
                      fillRule='evenodd'
                      d='M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z'
                      clipRule='evenodd'
                    />{' '}
                  </>
                }
              />
            </ul>

            {/* Divider */}
            <hr className='my-4 lg:min-w-full' />
            {/* Heading */}
            <h6 className='lg:min-w-full text-white font-bold block pt-1 pb-4 no-underline'>
              History
            </h6>
            {/* Navigation */}
            <ul className='lg:flex-col lg:min-w-full flex flex-col list-none lg:mb-4'>
              <SidebarLink
                name={'Raw Materials Record'}
                pathname={'/admin/raw_materials_record'}
                location={location}
              />
              <SidebarLink
                name={'Order History'}
                pathname={'/admin/order_history'}
                location={location}
              />
              <SidebarLink
                name={'Prescription History'}
                pathname={'/admin/prescription_history'}
                location={location}
              />

              <Link to={'/'}>
                <button
                  onClick={onLogout}
                  className='bg-fourth2 hover:bg-fourth1 text-primary1 lg:w-3/4 w-full rounded-lg py-2 mt-12 lg:ml-4 font-bold'
                >
                  Log Out
                </button>
              </Link>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

function SidebarLink({ name, pathname, location, svgPath }) {
  return (
    <li
      className={
        'items-center rounded-lg ' +
        (location.pathname.includes(pathname) ? 'bg-fourth2' : '')
      }
    >
      <Link
        className={
          'pl-3 text-xs uppercase py-3 font-bold block ' +
          (location.pathname.includes(pathname)
            ? 'text-gray-800'
            : 'text-gray-300 hover:text-white hover:shadow-2xl hover:brightness-200')
        }
        to={pathname}
      >
        <div className='flex align-middle'>
          <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 20 20'>
            {svgPath}
          </svg>
          <p className='inline-block pl-1 pt-1'>{name}</p>
        </div>
      </Link>
    </li>
  );
}
