import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AdminSideBar(props) {
  const location = useLocation();
  const [collapseShow, setCollapseShow] = React.useState('hidden');
  return (
    <>
      {/* <nav className='bg-primary-450 md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6'> */}
      <nav className='w-1/5 fixed bg-primary-450 left-0 block top-0 bottom-0 overflow-y-auto overflow-hidden shadow-xl flex-wrap items-center justify-between z-10 py-4 px-6'>
        <div className='md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto'>
          {/* Toggler */}
          <button
            className='cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent'
            type='button'
            onClick={() => setCollapseShow('bg-white m-2 py-3 px-6')}
          >
            <i className='fas fa-bars'></i>
          </button>
          {/* Brand */}
          <Link
            className='md:block md:pb-2 mr-0 inline-block whitespace-nowrap text-sm p-4 px-0 admin-font-style'
            to='/'
          >
            <span className='tokobat-font-style'>Tokobat</span> admin
          </Link>
          {/* User */}
          {/* <ul className='md:hidden items-center flex flex-wrap list-none'>
            <li className='inline-block relative'>
              <NotificationDropdown />
            </li>
            <li className='inline-block relative'>
              <UserDropdown />
            </li>
          </ul> */}
          {/* Collapse */}
          <div
            className={
              'md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded ' +
              collapseShow
            }
          >
            {/* Collapse header */}
            <div className='md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200'>
              <div className='flex flex-wrap'>
                <div className='w-6/12'>
                  <Link
                    className='md:block text-left md:pb-2 text-white mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0'
                    to='/'
                  >
                    Tokobat
                  </Link>
                </div>
                <div className='w-6/12 flex justify-end'>
                  <button
                    type='button'
                    className='cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent'
                    onClick={() => setCollapseShow('hidden')}
                  >
                    <i className='fas fa-times'></i>
                  </button>
                </div>
              </div>
            </div>
            {/* Form */}
            <form className='mt-6 mb-4 md:hidden'>
              <div className='mb-3 pt-0'>
                <input
                  type='text'
                  placeholder='Search'
                  className='border-0 px-3 py-2 h-12 border-solid  border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal'
                />
              </div>
            </form>

            {/* Divider */}
            <hr className='my-4 md:min-w-full' />
            {/* Heading */}
            <h6 className='md:min-w-full text-fourth text-xs uppercase font-bold block pt-1 pb-4 no-underline'>
              Manage
            </h6>
            {/* Navigation */}

            <ul className='md:flex-col md:min-w-full flex flex-col list-none'>
              <SidebarLink
                name={'Raw Materials'}
                pathname={'/admin/raw_materials'}
                location={location}
              />
              <SidebarLink
                name={'Products'}
                pathname={'/admin/products'}
                location={location}
              />
              <SidebarLink
                name={'Users'}
                pathname={'/admin/users'}
                location={location}
              />
              <SidebarLink
                name={'Prescriptions'}
                pathname={'/admin/prescriptions'}
                location={location}
              />
              <SidebarLink
                name={'Order'}
                pathname={'/admin/order'}
                location={location}
              />
            </ul>
            {/* Divider */}
            <hr className='my-4 md:min-w-full' />

            {/* Heading */}
            <h6 className='md:min-w-full text-fourth text-xs uppercase font-bold block pt-1 pb-4 no-underline'>
              Stats
            </h6>
            {/* Navigation */}
            <ul className='md:flex-col md:min-w-full flex flex-col list-none md:mb-4'>
              <SidebarLink
                name={'Revenue'}
                pathname={'/admin/revenue'}
                location={location}
              />
              <SidebarLink
                name={'Sales Report'}
                pathname={'/admin/sales_report'}
                location={location}
              />
            </ul>

            {/* Divider */}
            <hr className='my-4 md:min-w-full' />
            {/* Heading */}
            <h6 className='md:min-w-full text-fourth text-xs uppercase font-bold block pt-1 pb-4 no-underline'>
              History
            </h6>
            {/* Navigation */}
            <ul className='md:flex-col md:min-w-full flex flex-col list-none md:mb-4'>
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

              <div>
                <button className='bg-peach-dark hover:bg-peach-light w-3/4 rounded-lg py-2 mt-12'>
                  Log out
                </button>
              </div>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

function SidebarLink({ name, pathname, location }) {
  return (
    <li
      className={
        'items-center rounded-lg ' +
        (location.pathname === pathname ? 'bg-secondary' : '')
      }
    >
      <Link
        className={
          'pl-3 text-xs uppercase py-3 font-bold block ' +
          (location.pathname === pathname
            ? 'text-primary-450 '
            : 'text-secondary hover:text-white')
        }
        to={pathname}
      >
        {/* <i
          className={
            'fas fa-tv mr-2 text-sm ' +
            (location.pathname === pathname
              ? 'opacity-75'
              : 'text-blueGray-300')
          }
        ></i>{' '} */}
        {name}
      </Link>
    </li>
  );
}
