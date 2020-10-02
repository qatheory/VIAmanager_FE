import { configureStore } from '@reduxjs/toolkit'
import viewSettingsReducer from './reducers/viewSettings'

export default configureStore({
    reducer: {
        viewSettings: viewSettingsReducer
    }
})