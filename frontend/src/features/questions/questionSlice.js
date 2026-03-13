import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import questionService from './questionService'

const initialState = {
  questions: [],
  myQuestion: null,        // current question in the user's sequence
  nextQuestionAt: null,    // Date when next question unlocks
  questionNumber: null,
  totalQuestions: null,
  todaysQuestion: null,
  nextAvailableDate: null,
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

export const getQuestionByIndex = createAsyncThunk(
  'questions/getByIndex',
  async (index, thunkAPI) => {
    try {
      return await questionService.getQuestionByIndex(index, getToken(thunkAPI))
    } catch (error) {
      return handleError(error, thunkAPI)
    }
  }
)

export const getMyQuestion = createAsyncThunk(
  'questions/getMine',
  async (_, thunkAPI) => {
    try {
      return await questionService.getMyQuestion(getToken(thunkAPI))
    } catch (error) {
      return handleError(error, thunkAPI)
    }
  }
)

export const getTodaysQuestion = createAsyncThunk(
  'questions/getToday',
  async (_, thunkAPI) => {
    try {
      return await questionService.getTodaysQuestion()
    } catch (error) {
      return handleError(error, thunkAPI)
    }
  }
)

export const getNextAvailableDate = createAsyncThunk(
  'questions/getNextAvailableDate',
  async (_, thunkAPI) => {
    try {
      return await questionService.getNextAvailableDate(getToken(thunkAPI))
    } catch (error) {
      return handleError(error, thunkAPI)
    }
  }
)

export const reorderQuestions = createAsyncThunk(
  'questions/reorder',
  async (ids, thunkAPI) => {
    try {
      return await questionService.reorderQuestions(ids, getToken(thunkAPI))
    } catch (error) {
      return handleError(error, thunkAPI)
    }
  }
)

export const getQuestions = createAsyncThunk(
  'questions/getAll',
  async (_, thunkAPI) => {
    try {
      return await questionService.getQuestions(getToken(thunkAPI))
    } catch (error) {
      return handleError(error, thunkAPI)
    }
  }
)

export const createQuestion = createAsyncThunk(
  'questions/create',
  async (questionData, thunkAPI) => {
    try {
      return await questionService.createQuestion(questionData, getToken(thunkAPI))
    } catch (error) {
      return handleError(error, thunkAPI)
    }
  }
)

export const updateQuestion = createAsyncThunk(
  'questions/update',
  async ({ id, questionData }, thunkAPI) => {
    try {
      return await questionService.updateQuestion(id, questionData, getToken(thunkAPI))
    } catch (error) {
      return handleError(error, thunkAPI)
    }
  }
)

export const deleteQuestion = createAsyncThunk(
  'questions/delete',
  async (id, thunkAPI) => {
    try {
      return await questionService.deleteQuestion(id, getToken(thunkAPI))
    } catch (error) {
      return handleError(error, thunkAPI)
    }
  }
)

export const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getQuestionByIndex.fulfilled, (state, action) => {
        state.myQuestion = action.payload.question
        state.questionNumber = action.payload.questionNumber
        state.totalQuestions = action.payload.totalQuestions
      })
      .addCase(getMyQuestion.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getMyQuestion.fulfilled, (state, action) => {
        state.isLoading = false
        state.myQuestion = action.payload.question
        state.nextQuestionAt = action.payload.nextQuestionAt
        state.questionNumber = action.payload.questionNumber
        state.totalQuestions = action.payload.totalQuestions
      })
      .addCase(getMyQuestion.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getTodaysQuestion.fulfilled, (state, action) => {
        state.todaysQuestion = action.payload
      })
      .addCase(getNextAvailableDate.fulfilled, (state, action) => {
        state.nextAvailableDate = action.payload.date
      })
      .addCase(reorderQuestions.fulfilled, (state, action) => {
        state.questions = action.payload
      })
      .addCase(getQuestions.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getQuestions.fulfilled, (state, action) => {
        state.isLoading = false
        state.questions = action.payload
      })
      .addCase(getQuestions.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(createQuestion.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.questions.push(action.payload)
        state.questions.sort(
          (a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate)
        )
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        const idx = state.questions.findIndex((q) => q._id === action.payload._id)
        if (idx !== -1) state.questions[idx] = action.payload
        state.questions.sort(
          (a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate)
        )
      })
      .addCase(updateQuestion.rejected, (state, action) => {
        state.isError = true
        state.message = action.payload
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.questions = state.questions.filter((q) => q._id !== action.payload.id)
      })
  },
})

export const { reset } = questionSlice.actions
export default questionSlice.reducer
