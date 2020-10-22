import { createSlice } from "@reduxjs/toolkit";

export const adsAccSlice = createSlice({
	name: "adsAcc",
	initialState: {
		detailsDialog: false,
		adsAccID: "",
		isLoadingAdsAcc: false,
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
		setAdsAccDetailID: (state, action) => {
			state.AdsAccID = action.payload;
		},
		setLoadAdsAccStatus: (state, action) => {
			state.isLoadingAdsAcc = action.payload;
		},
	},
});

export const {
	toggleDetailsDialog,
	closeDetailsDialog,
	openDetailsDialog,
	setAdsAccDetailID,
	setLoadAdsAccStatus,
} = adsAccSlice.actions;

export default adsAccSlice.reducer;
