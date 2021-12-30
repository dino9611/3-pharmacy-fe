const initial_state = {
    adminOrder: [],
    userOrder: []
}

export const orderReducers = (state = initial_state, action) => {
    switch (action.type) {
        case 'setadminorder':
            return { ...state, adminOrder: action.payload };
        case 'resetadminorder':
            return { ...state, adminOrder: [] };
        case 'setuserorder':
            return { ...state, userOrder: action.payload };
        case 'resetuserorder':
            return { ...state, userOrder: [] };
        default:
            return state;
    }
}