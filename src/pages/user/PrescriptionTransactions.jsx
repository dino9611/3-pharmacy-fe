import React from 'react';
import { Pagination, CircularProgress, Divider } from '@mui/material';
import { toast } from 'react-toastify';
import { parseDate } from '../../helpers/parseDate';
import { useSelector, useDispatch } from 'react-redux';
import {
  confirmDelivery,
  getPrescriptionDetails,
  getPrescriptions,
  resetState,
  uploadPayment,
} from '../../redux/actions/prescriptionActions';
import EmptyPrescriptions from '../Asset/empty-products.svg';
import ModalOverlay from '../../components/Modals/AdminModalOverlay';
import { API_URL } from '../../constants/api';
import { useDebounce } from '../../hooks';

export default function Prescriptions() {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.auth.isLogin);
  const prescriptions = useSelector(
    (state) => state.prescriptionReducers.prescriptions
  );
  const prescriptionDetails = useSelector(
    (state) => state.prescriptionReducers.prescriptionDetails
  );

  const count = 5;
  const [page, setpage] = React.useState(1);

  const [filter, setfilter] = React.useState('initial');
  // const [sort, setsort] = React.useState('');
  const [search, setsearch] = React.useState('');
  const handleSearchChange = useDebounce((e) => setsearch(e.target.value), 700);

  const [isLoading, setisLoading] = React.useState(true);
  const [detailsIsOpen, setdetailsIsOpen] = React.useState(false);
  const [currentDetails, setcurrentDetails] = React.useState();

  React.useEffect(() => {
    if (isLogin) {
      setisLoading(true);
      dispatch(
        getPrescriptions(
          { page: 1, limit: 5 * count, filter, search },
          {
            handleFinally: () => setisLoading(false),
          }
        )
      );
    } else setisLoading(false);
    return () => {
      dispatch(resetState('prescriptions'));
    };
  }, [dispatch, filter, search, isLogin]);

  const renderCurrItems = () => {
    let out = [];
    for (let i = 0; i < prescriptions.length; i++) {
      const el = prescriptions[i];
      if (Math.ceil((i + 1) / 5) === page) out.push(el);
    }
    const emptyRows = 5 - out.length;
    for (let i = 0; i < emptyRows; i++) out.push(null);
    return out.map((el, i) =>
      el === null ? (
        <div key={i} className='h-20 my-2' />
      ) : (
        <div
          key={i}
          className='rounded bg-white h-20 p-4 my-2 flex items-center shadow-lg'
        >
          <h3
            className={`text-md phone:text-sm text-black font-bold ${
              filter === 'waitingPayment' ? 'w-2/6' : 'w-3/6'
            }`}
          >
            {el.prescriptionName ? el.prescriptionName : '...'}
          </h3>

          {filter === 'waitingPayment' ? (
            <p className='w-3/6'>{'expired at: ' + parseDate(el.expiredAt)}</p>
          ) : (
            <p className='w-2/6'>{parseDate(el.createdAt)}</p>
          )}
          <button
            className='w-1/6 text-sm phone:text-xs text-primary1 font-bold hover:text-lightblue'
            onClick={() => {
              dispatch(getPrescriptionDetails(el.id));
              setcurrentDetails(el);
              setdetailsIsOpen(true);
            }}
          >
            Details
          </button>
        </div>
      )
    );
  };

  return (
    <div className='grid grid-cols-7 grid-rows-1 gap-y-4 font-poppins bg-lightblue'>
      <DetailsModal
        status={filter}
        details={{ ...currentDetails, medicines: prescriptionDetails }}
        detailsIsOpen={detailsIsOpen}
        setdetailsIsOpen={setdetailsIsOpen}
      />
      <div className='col-span-full lg:px-20 px-10 phone:px-0'>
        <div className='h-auto p-3 flex justify-around phone:justify-between'>
          <div className='w-1/2 px-1'>
            <h4 className='font-semibold'>Search</h4>
            <input
              className='h-14 shadow-md phone:h-10 phone:text-xs border-gray-300 border-solid focus:outline-none px-4 rounded-md mr-2 w-full phone:mx-auto phone:mb-2'
              type='text'
              placeholder='Search by prescription name...'
              onChange={handleSearchChange}
            />
          </div>

          <div className='w-1/2 px-1'>
            <h4 className='font-semibold'>Filter By Status</h4>
            <select
              value={filter}
              // defaultValue='default'
              onChange={(e) => setfilter(e.target.value)}
              className='h-14 shadow-md phone:h-10 phone:text-xs mr-2 bg-white px-4 rounded-md focus:outline-none appearance-none w-full phone:mx-auto phone:mb-2'
            >
              <option value='initial'>Processing image</option>
              <option value='waitingPayment'>Waiting for payment</option>
              <option value='waitPaymentApproval'>Processing payment</option>
              <option value='paymentAcc'>Payment accepted</option>
              <option value='processing'>Processing order</option>
              <option value='otw'>On delivery</option>
              <option value='delivered'>Delivered</option>
              <option value='failed'>Rejected or expired</option>
            </select>
          </div>
        </div>

        <div className='h-full p-5'>
          {isLoading ? (
            <div className='text-center h-96'>
              <CircularProgress sx={{ size: 40 }} />
            </div>
          ) : prescriptions.length ? (
            renderCurrItems()
          ) : (
            <>
              <img
                src={EmptyPrescriptions}
                alt='EmptyPrescriptions'
                className='w-3/5 phone:w-9/12 mx-auto mb-6'
              />
              <p className='text-lg phone:text-sm font-bold text-primary1 text-center'>
                {isLogin ? 'No results' : 'Login to view your history'}
              </p>
            </>
          )}
          <div className='w-max mx-auto p-5'>
            <Pagination
              count={Math.ceil(prescriptions.length / 5)}
              page={page}
              onChange={(e, val) => setpage(val)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const DetailsModal = ({ status, details, detailsIsOpen, setdetailsIsOpen }) => {
  const fileInput = React.useRef(null);
  const [file, setfile] = React.useState(null);

  const dispatch = useDispatch();
  React.useEffect(() => {
    if (!detailsIsOpen) dispatch(resetState('prescriptionDetails'));
  }, [dispatch, detailsIsOpen]);
  React.useEffect(() => {
    if (file !== null)
      dispatch(
        uploadPayment(
          { file, id: details.id },
          {
            handleSuccess: () =>
              toast.success('Upload Success', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 5000,
              }),
            handleFail: (error) =>
              toast.error(error.response?.data.message || 'Server Error', {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 5000,
              }),
            handleFinally: () => {
              setdetailsIsOpen(false);
              dispatch(getPrescriptions());
            },
          }
        )
      );
  }, [dispatch, file, details.id, setdetailsIsOpen]);

  return (
    <ModalOverlay
      isOpen={detailsIsOpen}
      toggleModal={() => setdetailsIsOpen(!detailsIsOpen)}
    >
      <div className='h-3/4 phone:h-96 w-96 p-5 bg-white font-poppins overflow-y-auto rounded'>
        <input
          ref={fileInput}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={(e) => {
            if (e.target.files[0]) {
              setfile(e.target.files[0]);
            } else {
              setfile(null);
            }
          }}
        />
        <div className='flex justify-between'>
          <h1 className='text-2xl font-bold text-primary1'>
            Prescription Details
          </h1>
          <svg
            onClick={() => setdetailsIsOpen(false)}
            className='w-6 h-6 cursor-pointer hover:text-grey-light'
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
        </div>
        <img
          className='object-contain w-full h-80 phone:h-52'
          src={API_URL + details.image}
          alt='prescription'
        />
        {status === 'initial' ? (
          <p className='text-center font-medium'>
            please wait for admin to approve the prescription
          </p>
        ) : (
          <div>
            <div className=' flex text-center mb-4 font-semibold'>
              <div className='flex-1'>Medicine</div>
              <div className='flex-1'>Quantity</div>
              <div className='flex-1'>Price</div>
            </div>
            {details.medicines.length &&
              details.medicines.map((val, index) => {
                return (
                  <div key={index} className=' flex text-center mt-1'>
                    <div className='flex-1'>{val.medicineName}</div>
                    <div className='flex-1'>{val.qty}</div>
                    <div className='flex-1'>
                      {(val.priceRp * (1 + 2 / 10)).toFixed(2)}
                    </div>
                  </div>
                );
              })}
            <Divider sx={{ mt: 2 }} />
            <div className='flex justify-between mt-4 mx-5'>
              <div className='font-semibold'>Grand Total</div>
              <div className='pr-6'>
                Rp{' '}
                {details.medicines.length &&
                  (
                    (1 + 2 / 10) * // plus 20% profit
                    details.medicines.reduce(
                      (runningSum, el) => runningSum + el.priceRp * el.qty,
                      0
                    )
                  ).toFixed(2)}
              </div>
            </div>
            {status !== 'failed' ? (
              <div className=' mt-12 text-red-500 text-center text-sm'>
                Please contact an admin if you see anything suspicious
              </div>
            ) : (
              <div className=' mt-12 text-red-500 text-center'>
                {details.status === 'imgRej'
                  ? 'image rejected'
                  : details.status}
              </div>
            )}
            {status === 'waitingPayment' ? (
              <div className='mt-2 w-full flex justify-center items-center'>
                <button
                  className='h-10 btn btn-primary flex'
                  onClick={() => fileInput.current.click()}
                >
                  <svg
                    className='w-6 h-6'
                    data-darkreader-inline-fill=''
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Upload Payment
                </button>
              </div>
            ) : status === 'otw' ? (
              <div className='mt-2 w-full flex justify-center items-center'>
                <button
                  className='h-10 btn btn-primary flex'
                  onClick={() =>
                    dispatch(
                      confirmDelivery(details.id, {
                        handleSuccess: () =>
                          toast.success('Delivery is confirmed!'),
                        handleFail: (error) =>
                          toast.error(
                            error.response?.data.message || 'Server Error'
                          ),
                        handleFinally: () => setdetailsIsOpen(false),
                      })
                    )
                  }
                >
                  Confirm Delivery
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </ModalOverlay>
  );
};
