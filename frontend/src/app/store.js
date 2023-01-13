import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'
import quackReducer from '../features/quacks/quackSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quacks: quackReducer,
  },
});
