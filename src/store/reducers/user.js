import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    detailsDialog: false,
    deleteDialog: false,
    resetPasswordDialog: false,
    userID: "",
    userDeleteId: "",
    userDeleteName: "",
    userResetPasswordId: "",
    userResetPasswordName: "",
    isLoadingUser: false,
    selectedVia: "",
    userStatus: 0,
    searchParams: {
      name: "",
    },
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
    setUserDetailID: (state, action) => {
      state.UserID = action.payload;
    },
    setLoadUsersStatus: (state, action) => {
      state.isLoadingUser = action.payload;
    },
    setSelectedVia: (state, action) => {
      state.selectedVia = action.payload;
    },
    setUserStatus: (state, action) => {
      state.userStatus = action.payload;
    },
    setUserDeleteId: (state, action) => {
      state.userDeleteId = action.payload;
    },
    setUserDeleteName: (state, action) => {
      state.openUserDeleteDialog = action.payload;
    },
    openUserDeleteDialog: (state, action) => {
      state.deleteDialog = true;
    },
    closeUserDeleteDialog: (state, action) => {
      state.deleteDialog = false;
    },
    setUserResetPasswordId: (state, action) => {
      state.userResetPasswordId = action.payload;
    },
    setUserResetPasswordName: (state, action) => {
      state.userResetPasswordName = action.payload;
    },
    openUserResetPasswordDialog: (state, action) => {
      state.resetPasswordDialog = true;
    },
    closeUserResetPasswordDialog: (state, action) => {
      state.resetPasswordDialog = false;
    },
    setSearchParams: (state, action) => {
      state.searchParams = action.payload;
    },
  },
});

export const {
  toggleDetailsDialog,
  closeDetailsDialog,
  openDetailsDialog,
  setUserDetailId,
  setLoadUsersStatus,
  setSelectedVia,
  setUserStatus,
  setUserDeleteId,
  setUserDeleteName,
  closeUserDeleteDialog,
  openUserDeleteDialog,
  setUserResetPasswordId,
  setUserResetPasswordName,
  openUserResetPasswordDialog,
  closeUserResetPasswordDialog,
  setSearchParams,
} = userSlice.actions;

export default userSlice.reducer;
