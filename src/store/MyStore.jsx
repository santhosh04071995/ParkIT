import { configureStore, combineReducers } from "@reduxjs/toolkit";

import UserSearchSlice from "../slice/UserSearchSlice";
import SpotDetailSlice from "@/slice/SpotDetailSlice";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["searchBranch", "spotBranch"] // 👈 ONLY persist this
};
const rootReducer = combineReducers({
  searchBranch: UserSearchSlice,
  spotBranch: SpotDetailSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
const MyStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default MyStore;
export const persistor = persistStore(MyStore);





// import { configureStore } from "@reduxjs/toolkit";
// import UserSearchSlice from '../slice/UserSearchSlice'
// import SpotDetailSlice from "@/slice/SpotDetailSlice";
  
// let MyStore = configureStore({
//     reducer:{
//         searchBranch : UserSearchSlice,
//         spotBranch: SpotDetailSlice
//     }
// })
// export default MyStore