import { configureStore } from "@reduxjs/toolkit";
import viewSettingsReducer from "./reducers/viewSettings";
import viaReducer from "./reducers/via";
import adsAccSReducer from "./reducers/adsAcc";
import bmReducer from "./reducers/bm";
export default configureStore({
  reducer: {
    viewSettings: viewSettingsReducer,
    via: viaReducer,
    adsAcc: adsAccSReducer,
    bm: bmReducer,
  },
});
