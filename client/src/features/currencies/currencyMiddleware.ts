import { Middleware } from "redux";
import { io, Socket } from "socket.io-client";
import {
  startConnection,
  setConnectionStatus,
  setCurrencies,
  Currency,
} from "@/features/currencies/currenciesSlice";

const currencyMiddleware: Middleware = (store) => {
  let socket: Socket;

  return (next) => (action) => {
    if (startConnection.match(action)) {
      socket = io("http://localhost:4000/");
      socket.emit("start");
      store.dispatch(setConnectionStatus(true));

      socket.on("ticker", (message: Currency[] = []) => {
        store.dispatch(setCurrencies(message));
      });
    }

    next(action);
  };
};

export default currencyMiddleware;
