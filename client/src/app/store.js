import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/user/userSlice";

const storagedUser = localStorage.getItem("FitXUser");

const preloadedState = 
    storagedUser
    ? { 
        user: JSON.parse(storagedUser)
    }
    : undefined;

export const store = configureStore({
    reducer: {
        user: userReducer,
    },
    preloadedState
});

store.subscribe(() => {
    const state = store.getState();

    localStorage.setItem("FitXUser", JSON.stringify(state.user));
});
