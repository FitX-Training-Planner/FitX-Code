import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    ID: null,
    name: "",
    crefNumber: null,
    description: null,
    config: {
        isClient: true,
        isDarkTheme: false,
        isComplainterAnonymous: true,
        isRaterAnonymous: false,
        emailNotificationPermission: true,
        isEnglish: false,
        photoUrl: null
    }
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (_, action) => action.payload,
        updateUser: (state, action) => ({ 
            ...state, 
            ...action.payload,
            config: {
                ...state.config,
                ...(action.payload.config || {}),
            }
        }),
        resetUser: () => initialState
    }
});

export const { setUser, resetUser, updateUser } = userSlice.actions;

export default userSlice.reducer;
