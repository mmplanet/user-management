import {configureStore} from '@reduxjs/toolkit'
import userSlice from '../features/user/userSlice'
import groupSlice from '../features/group/groupSlice'

export default configureStore({
    reducer: {
        user: userSlice.reducer,
        group: groupSlice.reducer,
    }
})
