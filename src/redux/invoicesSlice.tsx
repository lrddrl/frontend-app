import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Invoice } from '../types';
import { RootState } from './store';

export interface InvoicesState {  
  invoices: Invoice[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: InvoicesState = {
  invoices: [],
  status: 'idle',
  error: null,
};

type FetchInvoicesArgs = {
    page: number;
    limit: number;
  };

export const fetchInvoices = createAsyncThunk<Invoice[], FetchInvoicesArgs, { state: RootState, rejectValue: string }>(
    'invoices/fetchInvoices',
    async ({ page, limit }, { getState, rejectWithValue }) => {
      const state = getState();
      const token = state.auth.accessToken;
      try {
        const response = await axios.get(`/api/invoices?page=${page}&limit=${limit}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (err) {
        return rejectWithValue('Failed to fetch invoices');
      }
    }
  );
  

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInvoices.fulfilled, (state, action: PayloadAction<Invoice[]>) => {
        state.status = 'idle';
        state.invoices = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default invoicesSlice.reducer;
