import { configureStore } from "@reduxjs/toolkit";
import socialDataReducer from "./socialDataSlice";

export const store = configureStore({
    reducer: {
        socialData: socialDataReducer,
    },
});