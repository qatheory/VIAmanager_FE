import { createSlice } from "@reduxjs/toolkit";

export const viaSlice = createSlice({
  name: "via",
  initialState: {
    detailsDialog: false,
    viaID: "",
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
  },
});

export const {
  toggleDetailsDialog,
  closeDetailsDialog,
  openDetailsDialog,
  setViaDetailID,
} = viaSlice.actions;

export default viaSlice.reducer;
