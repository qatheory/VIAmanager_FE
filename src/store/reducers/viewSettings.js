import { createSlice } from '@reduxjs/toolkit'

export const viewSettingsSlice = createSlice({
    name: 'viewSettings',
    initialState: {
        drawerStatus: false,

    },
    reducers: {
        toggleDrawer: state => {
            state.drawerStatus = !state.drawerStatus;
        },
        closeDrawer: state => {
            state.drawerStatus = false;
        }
    }
})
export const selectDrawerStatus = state => state.viewSettings.drawerStatus;

export const { toggleDrawer, closeDrawer } = viewSettingsSlice.actions

export default viewSettingsSlice.reducer