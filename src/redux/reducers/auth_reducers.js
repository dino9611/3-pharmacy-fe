const initial_state = {
  address: '',
  avatar: '',
  birthdate: '',
  createdAt: '',
  email: '',
  firstName: '',
  gender: '',
  id: 0,
  isVerified: 0,
  role: '',
  lastName: '',
  updatedAt: '',
  username: '',
  isLogin: false,
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
