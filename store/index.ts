import { configureStore } from "@reduxjs/toolkit";
import AuthSlice from "@/store/slices/authSlice";
import LinkedInSlice from "@/store/slices/linkedInSlice";

export const store = configureStore({
    reducer: {
        auth:AuthSlice,
        linkedIn:LinkedInSlice,
    },
    devTools:true,
});

// TYPES
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
