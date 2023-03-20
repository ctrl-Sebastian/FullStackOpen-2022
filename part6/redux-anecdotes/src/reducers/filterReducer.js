const filterReducer = (state = '', action) => {
    switch (action.type) {
        case 'SET_FILTER':
            return state = action.data
        case 'GET_FILTER':
        default: return state
    }
}

export const filterChange = (filter )=> {
    return ({
        type: 'SET_FILTER',
        data: filter,
    })
}

export default filterReducer