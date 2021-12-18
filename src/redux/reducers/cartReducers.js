const initial_state = []

export const cartReducers = (state = initial_state, action) => {
    switch (action.type) {
        case 'setcart':
            return action.payload;
        case 'resetcart':
            return initial_state;
        default:
            return state;
    }
}