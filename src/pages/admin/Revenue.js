import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  // PointElement,
  // LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
// import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
// ? redux
import { useDispatch, useSelector } from 'react-redux';
import { getRevenue, resetState } from '../../redux/actions/revenueActions';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  // PointElement,
  // LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Revenue() {
  const dispatch = useDispatch();
  const revenue = useSelector((state) => state.revenueReducers.revenue);

  React.useEffect(() => {
    dispatch(getRevenue());
    return () => dispatch(resetState('revenue'));
  }, [dispatch]);

  const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const data = {
    labels,
    datasets: [
      {
        label: 'Profit',
        data: labels.map(() => Math.ceil(Math.random() * 1000)),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Revenue',
        data: labels.map(() => Math.ceil(Math.random() * 1000)),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Potential Revenue',
        data: labels.map(() => Math.ceil(Math.random() * 1000)),
        borderColor: 'rgb(99, 255, 132)',
        backgroundColor: 'rgba(99, 255, 132, 0.5)',
      },
    ],
  };

  return (
    <div className='absolute right-0 w-4/5'>
      {/* <div>select year</div> */}
      {/* <Line options={options} data={data} /> */}
      <Bar options={options} data={data} />
    </div>
  );
}

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: `Revenue and Profit (${2019})`,
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
