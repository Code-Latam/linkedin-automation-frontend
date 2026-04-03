// store/adminSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Alert {
  type: string;
  severity: 'high' | 'medium' | 'low' | 'info';
  clientId?: string;
  clientName?: string;
  message: string;
  timestamp: string;
}

interface AdminState {
  apiKeySet: boolean;
  isLoading: boolean;
  error: string | null;
  activeAlerts: Alert[];
  lastRefreshed: Date | null;
}

const initialState: AdminState = {
  apiKeySet: typeof window !== 'undefined' ? !!localStorage.getItem('admin_api_key') : false,
  isLoading: false,
  error: null,
  activeAlerts: [],
  lastRefreshed: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setApiKey: (state, action: PayloadAction<string>) => {
      localStorage.setItem('admin_api_key', action.payload);
      state.apiKeySet = true;
    },
    clearApiKey: (state) => {
      localStorage.removeItem('admin_api_key');
      state.apiKeySet = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setActiveAlerts: (state, action: PayloadAction<Alert[]>) => {
      state.activeAlerts = action.payload;
    },
    setLastRefreshed: (state) => {
      state.lastRefreshed = new Date();
    },
  },
});

export const {
  setApiKey,
  clearApiKey,
  setLoading,
  setError,
  setActiveAlerts,
  setLastRefreshed,
} = adminSlice.actions;

export default adminSlice.reducer;