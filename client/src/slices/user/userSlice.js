import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    name: "",
    cref_number: null,
    description: null,
    config: {
        is_client: true,
        is_dark_theme: false,
        is_complainter_anonymous: true,
        is_rater_anonymous: false,
        email_notification_permission: true,
        device_notification_permission: true,
        is_english: false,
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
                ...action.payload.config,
            }
        }),
        resetUser: () => initialState
    }
});

export const { setUser, resetUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
