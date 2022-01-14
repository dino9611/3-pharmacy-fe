import React from 'react';
// ? chartjs
import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';
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
  getSalesByCategory,
  getRecentRevenue,
  getRecentNewUsers,
  getRecentPotentialRevenue,
  getRecentCartedItems,
} from '../../redux/actions/statsActions';

import { toast } from 'react-toastify';

ChartJS.register(
  CategoryScale,
  BarElement,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
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
    // new Date(currYear, 11, 1)
    new Date()
  );

  React.useEffect(() => {
    dispatch(getRevenue({ yearMonthStart, yearMonthEnd }, handleResult));
    dispatch(
      getPotentialRevenue({ yearMonthStart, yearMonthEnd }, handleResult)
    );
    dispatch(
      getSalesByCategory({ yearMonthStart, yearMonthEnd }, handleResult)
    );
    return () => {
      dispatch(resetState('revenue'));
      dispatch(resetState('potentialRevenue'));
      dispatch(resetState('salesByCategory'));
    };
  }, [dispatch, yearMonthStart, yearMonthEnd]);
  React.useEffect(() => {
    dispatch(getRecentRevenue(handleResult));
    dispatch(getRecentPotentialRevenue(handleResult));
    dispatch(getRecentNewUsers(handleResult));
    dispatch(getRecentCartedItems(handleResult));
    return () => {
      dispatch(resetState('recentRevenue'));
      dispatch(resetState('recentPotentialRevenue'));
      dispatch(resetState('recentNewUsers'));
      dispatch(resetState('recentCartedItems'));
    };
  }, [dispatch]);

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

  const data2 = {
    labels: ['waiting payment', 'rejected', 'success', 'expired'],
    datasets: [
      {
        // label: '# of Votes',
        data: [12, 19, 3, 5],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          // 'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          // 'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          // 'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          // 'rgba(255, 159, 64, 1)',
        ],
      },
    ],
  };

  const data3 = {
    labels: statsReducers.salesByCategory.map((el) => el.categoryName),
    datasets: [
      {
        label: 'Sales',
        data: statsReducers.salesByCategory.map((el) => el.cost + el.profit),
        borderColor: 'rgb(100, 44, 152)',
        backgroundColor: 'rgb(100, 44, 152, 0.5)',
        // borderColor: 'rgb(255, 99, 132)',
        // backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <div className='absolute right-0 lg:w-4/5 w-full font-poppins bg-secondary1'>
      {/* outmost div */}
      <div className='w-auto m-5 flex justify-between flex-wrap content-between'>
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
          change={statsReducers.recentPotentialRevenue}
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
          change={statsReducers.recentNewUsers}
          iconColor='#DD0F59'
          svgPath={
            <path
              strokeWidth='2'
              d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
            />
          }
        />

        <SingleStats
          label='Carted Items'
          change={statsReducers.recentCartedItems}
          iconColor='#7D249F'
          svgPath={
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z'
            />
          }
        />
      </div>

      <div className='bg-white rounded-lg m-5 flex justify-around pl-4'>
        <p className='font-semibold text-base rounded-lg self-center'>
          Filter by Year-Month
        </p>
        <div className='flex'>
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

      <div className='grid grid-cols-4 gap-3 m-5 grid-rows-2'>
        <div className='bg-white shadow-xl rounded-lg p-5 lg:col-span-3 col-span-4'>
          <p className='font-semibold text-base rounded-lg'>
            Monthly Revenue and Profit
          </p>
          <Line options={options1} data={data1} />
          {/* <div className='relative h-96'>
            <canvas id='line-chart'></canvas>
          </div> */}
        </div>

        <div className='flex lg:flex-col flex-row flex-wrap justify-between bg-white rounded-lg p-2 lg:row-span-2 row-span-2 lg:col-span-1 col-span-4 lg:order-none order-last'>
          <div className='lg:w-full w-1/2'>
            <p className='font-semibold text-base rounded-lg'>Transactions</p>
            <Pie data={data2} />
          </div>

          <div className='lg:w-full w-1/2'>
            <p className='font-semibold text-base rounded-lg'>Sales</p>
            <Pie
              data={{
                labels: ['prescriptions', 'products'],
                datasets: [
                  {
                    data: [12, 19],
                    backgroundColor: [
                      'rgba(255, 30, 30, 0.5)',
                      'rgba(30, 255, 30, 0.5)',
                      // 'rgba(54, 162, 235, 0.2)',
                    ],
                    borderColor: ['rgba(255, 0, 0, 1)', 'rgba(0, 255, 0, 1)'],
                  },
                ],
              }}
            />
          </div>

          <div className='lg:w-full w-1/2'>
            <p className='font-semibold text-base pt-2 rounded-lg'>
              Carted Items
            </p>
            <Pie data={data2} />
          </div>
        </div>

        <div className='bg-white shadow-xl rounded-lg p-5 lg:col-span-3 col-span-4'>
          <p className='font-semibold text-base rounded-lg'>
            Product Sales by Categories
          </p>
          <Bar options={options1} data={data3} />
        </div>

        {/* <div className='flex lg:flex-row flex-col justify-around bg-white rounded-lg p-2 row-span-2 lg:col-span-4 col-span-2'>
          <div className='bg-pink-400'>a</div>

          <div className='bg-blue-400 bg'>b</div>

          <div className='bg-indigo-400'>c</div>
        </div> */}
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
      <div className='mt-1 h-28 w-60 bg-white p-3 rounded-lg shadow-xl grid grid-cols-7'>
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
