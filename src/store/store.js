import { configureStore } from "@reduxjs/toolkit";
import viewSettingsReducer from "./reducers/viewSettings";
import viaSlice from "./reducers/via";
import adsAccSlice from "./reducers/adsAcc";

export default configureStore({
	reducer: {
		viewSettings: viewSettingsReducer,
		via: viaSlice,
		adsAcc: adsAccSlice,
	},
});
