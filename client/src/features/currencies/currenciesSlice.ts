import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface Currency {
  ticker: string;
  exchange: string;
  price: number;
  change: number;
  change_percent: number;
  dividend: number;
  yield: number;
  last_trade_time: Date;
}

export interface CurrencyStore {
  currencies: Currency[];
  isSocketIoConnected: boolean;
  status: "idle" | "loading" | "failed";
  error: null | unknown;
}

// export const fetchCurrencies = createAsyncThunk(
//   "counter/fetchCurrencies",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await fetch(
//         "https://jsonplaceholder.typicode.com/todos?_limit=10"
//       );

//       if (!response.ok) {
//         throw new Error("Server rejected request");
//       }
//       const data = await response.json();

//       return data;
//     } catch (error) {
//       if (error instanceof Error) return rejectWithValue(error.message);
//     }
//   }
// );

export const currenciesSlice = createSlice({
  name: "counter",
  initialState: <CurrencyStore>{
    currencies: [],
    isSocketIoConnected: false,
    status: "idle",
    error: null,
  },

  reducers: {
    setCurrencies(state, action) {
      state.currencies = action.payload;
    },

    startConnection() {},

    setConnectionStatus(state, action) {
      state.isSocketIoConnected = action.payload;
    },
  },

  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchCurrencies.pending, (state) => {
  //       state.status = "loading";
  //     })
  //     .addCase(fetchCurrencies.fulfilled, (state, action) => {
  //       state.status = "idle";
  //       state.currencies = action.payload;
  //     })
  //     .addCase(fetchCurrencies.rejected, (state, action) => {
  //       state.status = "failed";
  //       state.error = action.payload;
  //     });
  // },
});

export const { setCurrencies, startConnection, setConnectionStatus } =
  currenciesSlice.actions;

export default currenciesSlice.reducer;
