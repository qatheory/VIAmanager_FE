import { createSlice } from "@reduxjs/toolkit";

export const bmSlice = createSlice({
	name: "bm",
	initialState: {
		detailsDialog: false,
		adsAccOwnedDialog: false,
		ownersDialog: false,
		bmOwnersId: [],
		bmID: "",
		bmOwnersName: "",
		isLoadingBm: false,
		selectedVia: "",
		bmVerificationStatus: 0,
		bmStatus: 2,
		AdsAccOwnedId: "",
		AdsAccOwnedName: "",
		AdsAccOwnedVia: "",
		downloadStatus: false,
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
		setBmDetailID: (state, action) => {
			state.BmID = action.payload;
		},
		setLoadBmStatus: (state, action) => {
			state.isLoadingBm = action.payload;
		},
		setSelectedVia: (state, action) => {
			state.selectedVia = action.payload;
		},
		setBmVerificationStatus: (state, action) => {
			state.bmVerificationStatus = action.payload;
		},
		setBmStatus: (state, action) => {
			state.bmStatus = action.payload;
		},
		setBmOwnersId: (state, action) => {
			state.bmOwnersId = action.payload;
		},
		setBmOwnersName: (state, action) => {
			state.bmOwnersName = action.payload;
		},
		openBmOwnersDialog: (state, action) => {
			state.ownersDialog = true;
		},
		closeBmOwnersDialog: (state, action) => {
			state.ownersDialog = false;
		},
		setAdsAccOwnedId: (state, action) => {
			state.AdsAccOwnedId = action.payload;
		},
		setAdsAccOwnedName: (state, action) => {
			state.AdsAccOwnedName = action.payload;
		},
		setAdsAccOwnedVia: (state, action) => {
			state.AdsAccOwnedVia = action.payload;
		},
		openAdsAccOwnedDialog: (state, action) => {
			state.adsAccOwnedDialog = true;
		},
		closeAdsAccOwnedDialog: (state, action) => {
			state.adsAccOwnedDialog = false;
		},
		setDownloadStatus: (state, action) => {
			state.downloadStatus = action.payload;
		},
	},
});

export const {
	toggleDetailsDialog,
	closeDetailsDialog,
	openDetailsDialog,
	setBmDetailID,
	setLoadBmStatus,
	setSelectedVia,
	setBmVerificationStatus,
	setBmStatus,
	setBmOwnersId,
	setBmOwnersName,
	closeBmOwnersDialog,
	openBmOwnersDialog,
	setAdsAccOwnedId,
	setAdsAccOwnedName,
	setAdsAccOwnedVia,
	openAdsAccOwnedDialog,
	closeAdsAccOwnedDialog,
	setDownloadStatus,
} = bmSlice.actions;

export default bmSlice.reducer;
