import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../types';

export interface AuthState {
  user: User | null;
  username: string | null;
  password: string | null;
  accessToken: string | null;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: AuthState = {
  user: null,
  username: null,
  password: null,
  accessToken: null,
  status: 'idle',
};

type LoginCredentials = {
  username: string;
  password: string;
};

type LoginResponse = {
  access_token: string;
  user: User;
};

export const loginUser = createAsyncThunk<LoginResponse, LoginCredentials, { rejectValue: string }>(
  'auth/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      return response.data.data;
    } catch (err) {
      return rejectWithValue('Failed to login');
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.username = null;
      state.password = null;
      state.accessToken = null;
    },
    setCredentials(state, action: PayloadAction<{ username: string; password: string }>) {
      state.username = action.payload.username;
      state.password = action.payload.password;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'idle';
        state.user = action.payload.user;
        state.accessToken = action.payload.access_token;
        const loginMeta = action.meta as unknown as { arg: LoginCredentials }; 
        state.username = loginMeta.arg.username;
        state.password = loginMeta.arg.password;
      })
      .addCase(loginUser.rejected, (state) => {
        state.status = 'failed';
      })
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
