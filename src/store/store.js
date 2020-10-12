import { configureStore } from '@reduxjs/toolkit'
import viewSettingsReducer from './reducers/viewSettings'
import workspaceSettingsReducer from './reducers/workspaceSettings'

export default configureStore({
    reducer: {
        workspaces: workspaceSettingsReducer,
        viewSettings: viewSettingsReducer,
        
    }
})