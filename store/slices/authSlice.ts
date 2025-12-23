import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/axios";
import Cookies from "js-cookie";

export interface AuthState {
    user: any;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    showOnboarding: boolean; // Add this
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    showOnboarding: false, // Add this
};

// -----------------------------------------
// SIGNUP
// -----------------------------------------
export const signup = createAsyncThunk(
    "auth/signup",
    async (payload: { email: string; password: string; name: string }, thunkAPI) => {
        try {
            const res = await api.post("/auth/signup", payload);

            Cookies.set("accessToken", res.data.accessToken);
            Cookies.set("refreshToken", res.data.refreshToken);

            return res.data.user;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Signup Failed");
        }
    }
);

// -----------------------------------------
// LOGIN
// -----------------------------------------
export const login = createAsyncThunk(
    "auth/login",
    async (payload: { email: string; password: string }, thunkAPI) => {
        try {
            const res = await api.post("/auth/login", payload);

            Cookies.set("accessToken", res.data.accessToken);
            Cookies.set("refreshToken", res.data.refreshToken);

            return res.data.user;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Login Failed");
        }
    }
);

// ------------------------------------------------------
// AUTH SLICE
// ------------------------------------------------------
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");

            state.user = null;
            state.isAuthenticated = false;
            state.showOnboarding = false; // Add this
        },

        setUser(state, action) {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
        },

        // Add this new action
        setShowOnboarding(state, action) {
            state.showOnboarding = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder
            // Signup
            .addCase(signup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.showOnboarding = true;
            })
            .addCase(signup.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.showOnboarding = true;
            })
            .addCase(login.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, setUser,setShowOnboarding } = authSlice.actions;
export default authSlice.reducer;
