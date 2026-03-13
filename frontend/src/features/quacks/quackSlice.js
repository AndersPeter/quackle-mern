import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import quackService from './quackService'

const initialState = {
  myQuack: null,
  myQuacks: [],
  allQuacks: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

const getToken = (thunkAPI) => thunkAPI.getState().auth.user.token

const handleError = (error, thunkAPI) => {
  const message =
    (error.response && error.response.data && error.response.data.message) ||
    error.message ||
    error.toString()
  return thunkAPI.rejectWithValue(message)
}

export const getMyQuacks = createAsyncThunk(
  'quacks/getMine',
  async (_, thunkAPI) => {
    try {
      return await quackService.getMyQuacks(getToken(thunkAPI))
    } catch (error) {
      return handleError(error, thunkAPI)
    }
  }
)

export const getQuestionQuacks = createAsyncThunk(
  'quacks/getForQuestion',
  async (questionId, thunkAPI) => {
    try {
      return await quackService.getQuestionQuacks(questionId, getToken(thunkAPI))
    } catch (error) {
      return handleError(error, thunkAPI)
    }
  }
)

export const createQuack = createAsyncThunk(
  'quacks/create',
  async (quackData, thunkAPI) => {
    try {
      return await quackService.createQuack(quackData, getToken(thunkAPI))
    } catch (error) {
      return handleError(error, thunkAPI)
    }
  }
)

export const updateQuack = createAsyncThunk(
  'quacks/update',
  async ({ id, ...quackData }, thunkAPI) => {
    try {
      return await quackService.updateQuack(id, quackData, getToken(thunkAPI))
    } catch (error) {
      return handleError(error, thunkAPI)
    }
  }
)

export const deleteQuack = createAsyncThunk(
  'quacks/delete',
  async (id, thunkAPI) => {
    try {
      return await quackService.deleteQuack(id, getToken(thunkAPI))
    } catch (error) {
      return handleError(error, thunkAPI)
    }
  }
)

export const resonateQuack = createAsyncThunk(
  'quacks/resonate',
  async (id, thunkAPI) => {
    try {
      return await quackService.resonateQuack(id, getToken(thunkAPI))
    } catch (error) {
      return handleError(error, thunkAPI)
    }
  }
)

export const quackSlice = createSlice({
  name: 'quacks',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyQuacks.pending, (state) => { state.isLoading = true })
      .addCase(getMyQuacks.fulfilled, (state, action) => {
        state.isLoading = false
        state.myQuacks = action.payload
      })
      .addCase(getMyQuacks.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getQuestionQuacks.pending, (state) => { state.isLoading = true })
      .addCase(getQuestionQuacks.fulfilled, (state, action) => {
        state.isLoading = false
        state.myQuack = action.payload.myQuack
        state.allQuacks = action.payload.allQuacks
      })
      .addCase(getQuestionQuacks.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createQuack.pending, (state) => { state.isLoading = true })
      .addCase(createQuack.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.myQuack = action.payload
      })
      .addCase(createQuack.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateQuack.fulfilled, (state, action) => {
        state.myQuack = action.payload
        if (state.allQuacks) {
          state.allQuacks = state.allQuacks.map((q) =>
            q._id === action.payload._id ? action.payload : q
          )
        }
      })
      .addCase(updateQuack.rejected, (state, action) => {
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteQuack.fulfilled, (state) => {
        state.myQuack = null
        state.allQuacks = null
      })
      .addCase(resonateQuack.fulfilled, (state, action) => {
        state.allQuacks = action.payload
        if (state.myQuack) {
          const updated = action.payload.find((q) => q._id === state.myQuack._id)
          if (updated) state.myQuack = updated
        }
      })
      .addCase(resonateQuack.rejected, (state, action) => {
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = quackSlice.actions
export default quackSlice.reducer
