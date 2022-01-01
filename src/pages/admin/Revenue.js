import React from 'react';
// ? chartjs
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
// ? mui
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Box from '@mui/material/Box';
// ? redux
import { useDispatch, useSelector } from 'react-redux';
import {
  resetState,
  getRevenue,
  getPotentialRevenue,
  getRecentRevenue,
} from '../../redux/actions/statsActions';

import { toast } from 'react-toastify';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const handleResult = {
  // handleSuccess: () => {},
  handleFail: (err) =>
    toast.error(err.response?.data.message || 'server error'),
  // handleFinally: () => {},
};
const currYear = new Date().getFullYear();

export default function Revenue() {
  const dispatch = useDispatch();
  const statsReducers = useSelector((state) => state.statsReducers);
  // const profit = useSelector((state) => state.revenueReducers.profit);

  const [yearMonthStart, setyearMonthStart] = React.useState(
    new Date(currYear - 1, 0, 1)
  );
  const [yearMonthEnd, setyearMonthEnd] = React.useState(
    new Date(currYear, 11, 1)
  );

  React.useEffect(() => {
    dispatch(getRevenue({ yearMonthStart, yearMonthEnd }, handleResult));
    dispatch(
      getPotentialRevenue({ yearMonthStart, yearMonthEnd }, handleResult)
    );
    dispatch(getRecentRevenue(handleResult));
    return () => {
      dispatch(resetState('revenue'));
      dispatch(resetState('potentialRevenue'));
      dispatch(resetState('recentRevenue'));
    };
  }, [dispatch, yearMonthStart, yearMonthEnd]);

  const data1 = {
    labels: statsReducers.revenue.map(
      (el) => `${el.year}-${intToMonth(el.month)}`
    ),
    datasets: [
      {
        label: 'Revenue',
        data: statsReducers.revenue.map((el) => el.cost + el.profit),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Profit',
        data: statsReducers.revenue.map((el) => el.profit),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Potential Revenue',
        data: statsReducers.potentialRevenue.map((el) => el.cost + el.profit),
        borderColor: 'rgb(99, 255, 132)',
        backgroundColor: 'rgba(99, 255, 132, 0.5)',
      },
    ],
  };

  return (
    <div className='absolute right-0 md:w-4/5 w-full font-poppins bg-secondary1'>
      {/* outmost div */}
      <div className='m-5 flex justify-between flex-wrap content-between'>
        <SingleStats
          label='Revenue'
          change={statsReducers.recentRevenue}
          iconColor='#3EA349'
          svgPath={
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
            />
          }
        />
        <SingleStats
          label='Potential Revenue'
          change={120}
          iconColor='#0A6FE6'
          svgPath={
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
            />
          }
        />
        <SingleStats
          label='New Users'
          change={-110}
          iconColor='#DD0F59'
          svgPath={
            <path
              strokeWidth='2'
              d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
            />
          }
        />
        {/* <SingleStats
          label='Potential Revenue'
          change={120}
          iconColor='#0A6FE6'
          svgPath={
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
            />
          }
        />
        <SingleStats
          label='New Users'
          change={-110}
          iconColor='#DD0F59'
          svgPath={
            <path
              strokeWidth='2'
              d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
            />
          }
        /> */}
        <SingleStats
          label='Bla Bla Bla'
          change={-110}
          iconColor='#7D249F'
          svgPath={
            <>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z'
              />
            </>
          }
        />
      </div>

      <div className='bg-white shadow-xl m-5 rounded-lg px-5 py-5'>
        <p className='font-semibold text-base pt-2 rounded-lg'>
          Monthly Revenue and Profit
        </p>
        <Line options={options1} data={data1} />
        <div className='flex justify-start'>
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
      {/* outmost div */}
    </div>
  );
}

const intToMonth = (n) =>
  [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ][n - 1];

const options1 = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      // text: 'Monthly Revenue',
    },
  },
  scales: {
    y: {
      ticks: {
        callback: (value) => 'Rp ' + value.toLocaleString(),
      },
    },
  },
};

function ViewsDatePicker({ value, setvalue, label }) {
  // const [value, setValue] = React.useState(null > new Date());

  // console.log(value);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box m={2}>
        <DatePicker
          inputFormat='yyyy-MM'
          views={['year', 'month']}
          label={label}
          minDate={new Date(`2012-03-01`)}
          maxDate={new Date()}
          value={value}
          // onChange={(e) => console.log(e)}
          onChange={(e) => setvalue(e)}
          renderInput={(params) => <TextField {...params} helperText={null} />}
        />
      </Box>
    </LocalizationProvider>
  );
}

const SingleStats = ({ label, change, svgPath, iconColor }) => {
  return (
    <>
      <div className='mt-1 h-28 w-60 bg-white hover:bg-blue-100 cursor-pointer p-3 rounded-lg shadow-xl grid grid-cols-7'>
        <svg
          style={{ backgroundColor: iconColor }}
          className='w-11 h-11 text-white rounded-md p-2 col-span-2'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          {svgPath}
        </svg>
        <h3 className='font-semibold mr-1 pt-2 col-span-5 text-left'>
          {label}
        </h3>
        {change > 0 ? (
          <svg
            className='w-6 h-6 text-green-500 font-extrabold col-span-1 ml-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
            ></path>
          </svg>
        ) : (
          <svg
            className='w-6 h-6 text-red-500 font-extrabold col-span-1 ml-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'
            ></path>
          </svg>
        )}
        <div className='col-span-6'>
          <p className='text-sm font-normal text-center'>
            <span className={`font-bold text-base ${change > 0}`}>
              {change > 0
                ? `+${Math.round(change * 100)}`
                : Math.round(change * 100)}
              %{' '}
            </span>
            since last day
          </p>
        </div>
      </div>
    </>
  );
};
