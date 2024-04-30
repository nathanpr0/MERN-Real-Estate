import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice.js";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";

// COMBINE REDUCER
const rootReducer = combineReducers({ user: userReducer });

// PERSIST REDUCER
const persistConfig = { key: "root", storage, version: 1 };
const persistedReducer = persistReducer(persistConfig, rootReducer);

// STORE REDUCER
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
