import { configureStore } from "@reduxjs/toolkit";
import viewSettingsReducer from "./reducers/viewSettings";
import viaSlice from "./reducers/via";
export default configureStore({
  reducer: {
    viewSettings: viewSettingsReducer,
    via: viaSlice,
  },
});
