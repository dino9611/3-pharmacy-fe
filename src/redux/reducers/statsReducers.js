import { actionTypes } from '../action-types';

const initialState = {
  revenue: [],
  potentialRevenue: [],
  salesByCategory: [],
  //
  recentRevenue: null,
  recentPotentialRevenue: null,
  recentNewUsers: null,
  recentCartedItems: null,
  //
  // productSales: [],
  // prescriptionSales: [],
  cartedItem: [],
  salesSuccessRate: [],
  pieCharts: {
    sales: [],
    prescriptionTransactions: [],
    productTransactions: [],
  },
};

export const statsReducers = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.revenue.SET_STATE:
      return { ...state, [action.propName]: action.payload };
    case actionTypes.revenue.RESET_STATE:
      return { ...state, [action.propName]: initialState[action.propName] };
    default:
      return state;
  }
};
