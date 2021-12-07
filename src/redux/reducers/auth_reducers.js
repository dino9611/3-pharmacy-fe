const initial_state = {
  id: 0,
};

export const authReducers = (state = initial_state, action) => {
  switch (action.type) {
    case 'login':
      return { ...state, ...action.payload, isLogin: true };
    case 'logout':
      return initial_state;
    default:
      return state;
  }
};
