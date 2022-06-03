import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import currenciesReducer from "@/features/currencies/currenciesSlice";
import currencyMiddleware from "@/features/currencies/currencyMiddleware";
const store = configureStore({
  reducer: {
    currenciesStore: currenciesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([currencyMiddleware]),
});
export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
