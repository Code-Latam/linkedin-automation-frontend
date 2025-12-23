import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";

export interface LinkedInProfile {
    firstName: string;
    lastName: string;
    headline: string;
    summary: string;
    profilePictureUrlLarge: string | null;
    websites: string[];
}

export interface LinkedInState {
    isConnected: boolean;
    isConnecting: boolean;
    connectionStatus: 'idle' | 'connecting' | 'success' | 'failed';
    authUrl: string | null;
    accountId: string | null;
    error: string | null;

    // NEW
    hasProfile: boolean;
    profile: LinkedInProfile | null;
    isLoadingProfile: boolean;
}

const initialState: LinkedInState = {
    hasProfile: false,
    profile: null,
    isLoadingProfile: false,
    isConnected: false,
    isConnecting: false,
    connectionStatus: 'idle',
    authUrl: null,
    accountId: null,
    error: null,
};

// Create LinkedIn Auth Link
export const createLinkedInAuthLink = createAsyncThunk(
    "linkedin/createAuthLink",
    async (_, thunkAPI) => {
        try {
            const res = await api.post("/unipile/create-auth-link");
            return res.data; // { success: true, authUrl: string, linkedId: string }
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to create LinkedIn auth link"
            );
        }
    }
);

// Check LinkedIn Connection Status
// linkedInSlice.ts

export const checkLinkedInConnection = createAsyncThunk(
    'linkedin/checkConnection',
    async (payload: { accountId?: string } | undefined, thunkAPI) => {
        try {
            const accountId = payload?.accountId;
            const res = await api.get('/unipile/connection-status', {
                params: accountId ? { accountId } : undefined,
            });
            return res.data; // { isConnected: boolean, accountId?: string }
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || 'Failed to check connection',
            );
        }
    },
);

export const fetchLinkedInProfile = createAsyncThunk(
    'linkedin/fetchProfile',
    async (payload: { accountId: string }, thunkAPI) => {
        try {
            const res = await api.get('/unipile/profile', {
                params: { accountId: payload.accountId },
            });
            // response shape: { hasProfile: boolean, profile: { ... } }
            return res.data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || 'Failed to load LinkedIn profile',
            );
        }
    },
);


const linkedinSlice = createSlice({
    name: "linkedin",
    initialState,
    reducers: {
        resetConnectionStatus(state) {
            state.connectionStatus = 'idle';
            state.error = null;
        },
        setConnectionSuccess(state, action) {
            state.isConnected = true;
            state.connectionStatus = 'success';
            state.accountId = action.payload.accountId;
        },
        setConnectionFailed(state, action) {
            state.isConnected = false;
            state.connectionStatus = 'failed';
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Create Auth Link
            .addCase(createLinkedInAuthLink.pending, (state) => {
                state.isConnecting = true;
                state.connectionStatus = 'connecting';
                state.error = null;
            })
            .addCase(createLinkedInAuthLink.fulfilled, (state, action) => {
                state.isConnecting = false;
                state.authUrl = action.payload.authUrl;
                state.error = null;
            })
            .addCase(createLinkedInAuthLink.rejected, (state, action: any) => {
                state.isConnecting = false;
                state.connectionStatus = 'failed';
                state.error = action.payload;
            })
            // Check Connection
            .addCase(checkLinkedInConnection.fulfilled, (state, action) => {
                state.isConnected = action.payload.isConnected;
                state.accountId = action.payload.accountId;
                if (action.payload.isConnected) {
                    state.connectionStatus = 'success';
                }
            })
            .addCase(fetchLinkedInProfile.pending, (state) => {
                state.isLoadingProfile = true;
                state.error = null;
            })
            .addCase(fetchLinkedInProfile.fulfilled, (state, action) => {
                state.isLoadingProfile = false;
                state.hasProfile = action.payload.hasProfile;
                state.profile = action.payload.profile ?? null;
            })
            .addCase(fetchLinkedInProfile.rejected, (state, action: any) => {
                state.isLoadingProfile = false;
                state.error = action.payload;
            });

    },
});

export const {
    resetConnectionStatus,
    setConnectionSuccess,
    setConnectionFailed
} = linkedinSlice.actions;

export default linkedinSlice.reducer;
