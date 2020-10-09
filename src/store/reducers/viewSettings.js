import { createSlice } from '@reduxjs/toolkit'

export const viewSettingsSlice = createSlice({
    name: 'viewSettings',
    initialState: {
        drawerStatus: false,
        loggedIn: (localStorage.getItem('token') || sessionStorage.getItem('token')) ? true : false,
        username: null
    },
    reducers: {
        toggleDrawer: state => {
            state.drawerStatus = !state.drawerStatus;
        },
        closeDrawer: state => {
            state.drawerStatus = false;
        },
        setLoggedIn: (state) => {
            state.loggedIn = true
        },
        setLoggedOut: (state) => {
            state.loggedIn = false
        },
        setUsername: (state, action) => {
            state.username = action.payload
        }
    }
})
export const selectDrawerStatus = state => state.viewSettings.drawerStatus;
export const selectLoggedIn = state => state.viewSettings.loggedIn;
export const selectUsername = state => state.viewSettings.username;

export const { toggleDrawer, closeDrawer, setLoggedIn, setLoggedOut, setUsername } = viewSettingsSlice.actions

export default viewSettingsSlice.reducer