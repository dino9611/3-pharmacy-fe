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
import { Bar, Line } from 'react-chartjs-2';
// ? mui
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Box from '@mui/material/Box';
// ? redux
import { useDispatch, useSelector } from 'react-redux';
import {
  getRevenue,
  getPotentialRevenue,
  getYearlyPotentialRevenue,
  getYearlyRevenue,
  resetState,
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
  handleFail: (err) => toast.error(err.response.data.message || 'server error'),
  // handleFinally: () => {},
};
const currYear = new Date().getFullYear();

export default function Revenue() {
  const dispatch = useDispatch();
  const statsReducers = useSelector((state) => state.statsReducers);
  // const profit = useSelector((state) => state.revenueReducers.profit);

  const [yearMonthStart, setyearMonthStart] = React.useState(
    new Date(currYear, 0, 1)
  );
  const [yearMonthEnd, setyearMonthEnd] = React.useState(
    new Date(currYear, 11, 1)
  );

  React.useEffect(() => {
    dispatch(getRevenue({ yearMonthStart, yearMonthEnd }, handleResult));
    dispatch(
      getPotentialRevenue({ yearMonthStart, yearMonthEnd }, handleResult)
    );
    dispatch(getYearlyRevenue(handleResult));
    dispatch(getYearlyPotentialRevenue(handleResult));
    return () => {
      dispatch(resetState('revenue'));
      dispatch(resetState('potentialRevenue'));
      dispatch(resetState('yearlyRevenue'));
      dispatch(resetState('yearlyPotentialRevenue'));
    };
  }, [dispatch, yearMonthStart, yearMonthEnd]);

  const data1 = {
    labels: statsReducers.revenue.map(
      (el) => `${el.year}-${intToMonth(el.month)}`
    ),
    datasets: [
      // {
      //   label: 'Profit',
      //   data: profit.map((el) => el.totalProfitRp),
      //   borderColor: 'rgb(53, 162, 235)',
      //   backgroundColor: 'rgba(53, 162, 235, 0.5)',
      // },
      {
        label: 'Revenue',
        data: statsReducers.revenue.map((el) => el.totalRevenueRp),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Potential Revenue',
        data: statsReducers.potentialRevenue.map(
          (el) => el.totalPotentialRevenueRp
        ),
        borderColor: 'rgb(99, 255, 132)',
        backgroundColor: 'rgba(99, 255, 132, 0.5)',
      },
    ],
  };
  const data2 = {
    labels: statsReducers.yearlyRevenue.map((el) => el.year),
    datasets: [
      {
        label: 'Revenue',
        data: statsReducers.yearlyRevenue.map((el) => el.totalRevenueRp),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Potential Revenue',
        data: statsReducers.yearlyPotentialRevenue.map(
          (el) => el.totalPotentialRevenueRp
        ),
        borderColor: 'rgb(99, 255, 132)',
        backgroundColor: 'rgba(99, 255, 132, 0.5)',
      },
    ],
  };

  return (
    <div className='absolute right-0 w-4/5'>
      <div className='flex'>
        <ViewsDatePicker
          value={yearMonthStart}
          setvalue={setyearMonthStart}
          label={'Year-Month Start'}
        />
        <ViewsDatePicker
          value={yearMonthEnd}
          setvalue={setyearMonthEnd}
          label={'Year-Month End'}
        />
      </div>
      {/* <div>select year</div> */}
      <Bar options={options1} data={data1} style={{ padding: '0 10px' }} />
      <Line
        options={options2}
        data={data2}
        style={{ margin: '50px 0', padding: '0 10px' }}
      />
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
      // text: 'Monthly Revenue and Profit',
      text: 'Monthly Revenue',
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
const options2 = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      // text: 'Yearly Revenue and Profit',
      text: 'Yearly Revenue',
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
          minDate={new Date('2012-03-01')}
          maxDate={new Date('2023-06-01')}
          value={value}
          // onChange={(e) => console.log(e)}
          onChange={(e) => setvalue(e)}
          renderInput={(params) => <TextField {...params} helperText={null} />}
        />
      </Box>
    </LocalizationProvider>
  );
}
