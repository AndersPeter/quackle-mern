import { createSlice, creatAsyncThunk} from "@reduxjs/toolkit"
import quackService from './quackService'

const initialState = {
    quacks: [],
    quack: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

export const quackSlice = createSlice({
    name: 'ticket',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {}
})

export const {reset} = quackSlice.actions
export default quackSlice.reducer