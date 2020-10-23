import { createSlice } from "@reduxjs/toolkit";

export const viaSlice = createSlice({
	name: "via",
	initialState: {
		detailsDialog: false,
		deleteDialog: false,
		loginDialog: false,
		viaID: "",
		viaDeleteID: "",
		viaDeleteName: "",
		isLoadingVias: false,
		loginInfo: {},
		searchParams: {
			name: "",
			fbName: "",
			email: "",
			fbid: "",
			label: "",
			status: "",
		},
	},
	reducers: {
		clearSearchParam: (state) => {
			state.searchParams = {};
		},
		setSearchParams: (state, action) => {
			state.searchParams = action.payload;
		},
		toggleDeleteDialog: (state) => {
			state.deleteDialog = !state.deleteDialog;
		},
		closeDeleteDialog: (state) => {
			state.deleteDialog = false;
		},
		openDeleteDialog: (state) => {
			state.deleteDialog = true;
		},
		toggleDetailsDialog: (state) => {
			state.detailsDialog = !state.detailsDialog;
		},
		closeDetailsDialog: (state) => {
			state.detailsDialog = false;
		},
		openDetailsDialog: (state) => {
			state.detailsDialog = true;
		},
		setViaDetailID: (state, action) => {
			state.viaID = action.payload;
		},
		setViaDeleteID: (state, action) => {
			state.viaDeleteID = action.payload;
		},
		setViaDeleteName: (state, action) => {
			state.viaDeleteName = action.payload;
		},
		setLoadViasStatus: (state, action) => {
			state.isLoadingVias = action.payload;
		},
		setViaLoginInfo: (state, action) => {
			state.loginInfo = action.payload;
		},
		closeLoginDialog: (state) => {
			state.loginDialog = false;
		},
		openLoginDialog: (state) => {
			state.loginDialog = true;
		},
	},
});

export const {
	toggleDeleteDialog,
	closeDeleteDialog,
	openDeleteDialog,
	toggleDetailsDialog,
	closeDetailsDialog,
	openDetailsDialog,
	closeLoginDialog,
	openLoginDialog,
	setViaDetailID,
	setViaDeleteID,
	setLoadViasStatus,
	setViaDeleteName,
	clearSearchParam,
	setSearchParams,
	setViaLoginInfo,
} = viaSlice.actions;

export default viaSlice.reducer;
