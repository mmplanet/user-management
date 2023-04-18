import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {apiFetchGroups,} from "../../app/InterNationsAPI";

export const fetchGroups = createAsyncThunk(
    'user/fetchGroups',
    async (args, thunkAPI) => {
        return await apiFetchGroups(args);
    },
);

const groupSlice = createSlice({
    name: 'group',
    initialState: {
        loading: 'idle',
        allGroups: [],
        errorMessage: null,
    },
    reducers: {},
    extraReducers: {
        [fetchGroups.pending]: (state, action) => {
            state.loading = 'pending';
        },
        [fetchGroups.fulfilled]: (state, action) => {
            state.loading = 'fulfilled';
            state.allGroups = action.payload;
        },
        [fetchGroups.rejected]: (state, action) => {
            state.loading = 'rejected';
        },
    }
});


// Extract and export each action creator by name
export const {} = groupSlice.actions;

// Export the reducer, either as a default or named export
export default groupSlice;
