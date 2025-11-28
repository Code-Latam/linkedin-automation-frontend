import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "@/store/slices/authSlice";

export const store = configureStore({
    reducer: {
        auth:AuthSlice,
    },
    devTools:true,
});

// TYPES
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
