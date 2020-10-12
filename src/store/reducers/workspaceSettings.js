import { createSlice } from '@reduxjs/toolkit'

export const workspaceSettingsSlice = createSlice({
    name: 'workspaces',
    initialState: {
        currentWorkspace: {id:null,name:null}, 
        listWorkspaces:[]      
    },
    reducers: {
        setCurrentWorkspace: (state, action) => {
            state.currentWorkspace = action.payload;
            
        },
        setListWorkspaces: (state,action) => {
            state.listWorkspaces = action.payload
        }
    }
});
export const { setCurrentWorkspace,setListWorkspaces } = workspaceSettingsSlice.actions

export default workspaceSettingsSlice.reducer