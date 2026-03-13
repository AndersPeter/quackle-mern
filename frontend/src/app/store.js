import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'
import quackReducer from '../features/quacks/quackSlice'
import questionReducer from '../features/questions/questionSlice'
import commentReducer from '../features/comments/commentSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quacks: quackReducer,
    questions: questionReducer,
    comments: commentReducer,
  },
});
