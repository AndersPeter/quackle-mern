import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import commentService from './commentService'

const initialState = {
  commentsByQuack: {},  // { [quackId]: Comment[] }
  isLoading: false,
  isError: false,
  message: '',
}

const getToken = (thunkAPI) => thunkAPI.getState().auth.user.token

const handleError = (error, thunkAPI) => {
  const message =
    (error.response?.data?.message) || error.message || error.toString()
  return thunkAPI.rejectWithValue(message)
}

export const getComments = createAsyncThunk(
  'comments/get',
  async (quackId, thunkAPI) => {
    try {
      const data = await commentService.getComments(quackId, getToken(thunkAPI))
      return { quackId, comments: data }
    } catch (error) {
      return handleError(error, thunkAPI)
    }
  }
)

export const createComment = createAsyncThunk(
  'comments/create',
  async ({ quackId, text }, thunkAPI) => {
    try {
      const data = await commentService.createComment({ quackId, text }, getToken(thunkAPI))
      return { quackId, comment: data }
    } catch (error) {
      return handleError(error, thunkAPI)
    }
  }
)

export const deleteComment = createAsyncThunk(
  'comments/delete',
  async ({ id, quackId }, thunkAPI) => {
    try {
      await commentService.deleteComment(id, getToken(thunkAPI))
      return { id, quackId }
    } catch (error) {
      return handleError(error, thunkAPI)
    }
  }
)

export const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getComments.pending, (state) => { state.isLoading = true })
      .addCase(getComments.fulfilled, (state, action) => {
        state.isLoading = false
        state.commentsByQuack[action.payload.quackId] = action.payload.comments
      })
      .addCase(getComments.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createComment.fulfilled, (state, action) => {
        const { quackId, comment } = action.payload
        if (!state.commentsByQuack[quackId]) state.commentsByQuack[quackId] = []
        state.commentsByQuack[quackId].push(comment)
      })
      .addCase(createComment.rejected, (state, action) => {
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { id, quackId } = action.payload
        if (state.commentsByQuack[quackId]) {
          state.commentsByQuack[quackId] = state.commentsByQuack[quackId].filter(
            (c) => c._id !== id
          )
        }
      })
  },
})

export const { reset } = commentSlice.actions
export default commentSlice.reducer
