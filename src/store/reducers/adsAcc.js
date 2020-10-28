import { createSlice } from "@reduxjs/toolkit";

export const adsAccSlice = createSlice({
  name: "adsAcc",
  initialState: {
    detailsDialog: false,
    ownersDialog: false,
    adsAccOwnersId: [],
    adsAccID: "",
    adsAccOwnersName: "",
    isLoadingAdsAcc: false,
    selectedVia: "",
    adsAccStatus: 0,
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
    setSelectedVia: (state, action) => {
      state.selectedVia = action.payload;
    },
    setAdsAccStatus: (state, action) => {
      state.adsAccStatus = action.payload;
    },
    setAdsAccOwnersId: (state, action) => {
      state.adsAccOwnersId = action.payload;
    },
    setAdsAccOwnersName: (state, action) => {
      state.adsAccOwnersName = action.payload;
    },
    openAdsAccOwnersDialog: (state, action) => {
      state.ownersDialog = true;
    },
    closeAdsAccOwnersDialog: (state, action) => {
      state.ownersDialog = false;
    },
  },
});

export const {
  toggleDetailsDialog,
  closeDetailsDialog,
  openDetailsDialog,
  setAdsAccDetailID,
  setLoadAdsAccStatus,
  setSelectedVia,
  setAdsAccStatus,
  setAdsAccOwnersId,
  setAdsAccOwnersName,
  closeAdsAccOwnersDialog,
  openAdsAccOwnersDialog,
} = adsAccSlice.actions;

export default adsAccSlice.reducer;
