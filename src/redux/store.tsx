import { configureStore } from '@reduxjs/toolkit';
import invoicesReducer from './invoicesSlice';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    invoices: invoicesReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
