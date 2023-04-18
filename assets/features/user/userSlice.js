import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {
    apiFetchUser,
    apiFetchUsers,
    apiLoginUser,
    apiRegisterUser,
    apiUpdateUser,
} from "../../app/InterNationsAPI";

export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async (args, thunkAPI) => {
        return await apiFetchUser(args);
    },
);

export const fetchUsers = createAsyncThunk(
    'user/fetchUsers',
    async (args, thunkAPI) => {
        const response = await apiFetchUsers(args);
        return response;
    },
);

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async (args, thunkAPI) => {
        const response = await apiUpdateUser(args);
        return response;
    },
);

export const loginUser = createAsyncThunk(
    'user/login',
    async (args, thunkAPI) => {
        const response = await apiLoginUser(args.email, args.password);

        return response;
    }
)

export const registerUser = createAsyncThunk(
    'user/register',
    async (args, thunkAPI) => {
        const response = await apiRegisterUser(
            args.email,
            args.password,
            args.firstName,
            args.lastName
        );

        return response;
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState: {
        loading: 'idle',
        userData: {},
        allUsers: [],
        token: null,
        errorMessage: null,
    },
    reducers: {
        getUser(state, action) {
            state.userData = action.payload;
        },
        setUserToken(state, action) {
            state.token = action.payload;
        },
        setUserData(state, action) {
            state.userData = action.payload;
        },
        logoutUser(state, action) {
            state.userData = {};
            state.token = null;
        },
    },
    extraReducers: {
        [fetchUser.pending]: (state, action) => {
            state.loading = 'pending';
        },
        [fetchUser.fulfilled]: (state, action) => {
            state.loading = 'fulfilled';
            state.userData = action.payload;
        },
        [fetchUser.rejected]: (state, action) => {
            state.loading = 'rejected';
        },
        [updateUser.pending]: (state, action) => {
            state.loading = 'pending';
        },
        [updateUser.fulfilled]: (state, action) => {
            state.loading = 'fulfilled';
            state.userData = action.payload;
        },
        [updateUser.rejected]: (state, action) => {
            state.loading = 'rejected';
        },
        [fetchUsers.pending]: (state, action) => {
            state.loading = 'pending';
        },
        [fetchUsers.fulfilled]: (state, action) => {
            state.loading = 'fulfilled';
            state.allUsers = action.payload;
        },
        [fetchUsers.rejected]: (state, action) => {
            state.loading = 'rejected';
        },
        [loginUser.pending]: (state, action) => {
            state.loading = 'pending';
        },
        [loginUser.fulfilled]: (state, action) => {
            state.loading = 'fulfilled';
            if (typeof action.payload !== "undefined"
                && typeof action.payload.code !== "undefined"
                && action.payload.code === 401) {
                state.errorMessage = action.payload.message;
            }
            if (typeof action.payload !== "undefined"
                && typeof action.payload.token !== "undefined") {
                state.token = action.payload.token;
            }
        },
        [loginUser.rejected]: (state, action) => {
            state.loading = 'rejected';
        },
        [registerUser.pending]: (state, action) => {
            state.loading = 'pending';
        },
        [registerUser.fulfilled]: (state, action) => {
            state.loading = 'fulfilled';
            if (typeof action.payload !== "undefined"
                && typeof action.payload.code !== "undefined"
                && action.payload.code === 401) {
                state.errorMessage = action.payload.message;
            }
            if (typeof action.payload !== "undefined"
                && typeof action.payload.jwtToken !== "undefined") {
                state.userData = action.payload;
                state.token = action.payload.jwtToken;
                delete state.userData.jwtToken;
            }
        },
        [registerUser.rejected]: (state, action) => {
            state.loading = 'rejected';
        },
    }
});


// Extract and export each action creator by name
export const {
    getUser,
    setUserToken,
    setUserData,
    logoutUser
} = userSlice.actions;

// Export the reducer, either as a default or named export
export default userSlice;
