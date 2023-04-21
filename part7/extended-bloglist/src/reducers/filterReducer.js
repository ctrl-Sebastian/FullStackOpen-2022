import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
    name: 'filter',
    initialState: '',
    reducers: {
        filterChange(state, action) {
            state = action.payload
            return state
        },
        getFilter: (state) => state,
    },
})

/*
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
*/
export const { filterChange } = filterSlice.actions
export default filterSlice.reducer