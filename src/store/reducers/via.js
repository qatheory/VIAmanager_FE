import { createSlice } from "@reduxjs/toolkit";

export const viaSlice = createSlice({
	name: "via",
	initialState: {
		detailsDialog: false,
		viaID: "",
		isLoadingVias: false,
	},
	reducers: {
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
		setLoadViasStatus: (state, action) => {
			state.isLoadingVias = action.payload;
		},
	},
});

export const {
	toggleDetailsDialog,
	closeDetailsDialog,
	openDetailsDialog,
	setViaDetailID,
	setLoadViasStatus,
} = viaSlice.actions;

export default viaSlice.reducer;
