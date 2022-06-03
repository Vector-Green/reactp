import "@/views/HomePage.scss";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  startConnection,
  Currency,
} from "@/features/currencies/currenciesSlice";
import { AppDispatch, RootState } from "@/app/store";
import { Flipper, Flipped } from "react-flip-toolkit";
import dayjs from "dayjs";

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(startConnection());
  }, []);

  const currenciesStore = useSelector(
    (state: RootState) => state.currenciesStore
  );

  const sortedCurrencies = useMemo(() => {
    return [...currenciesStore.currencies].sort((a, b) => {
      return b.change - a.change;
    });
  }, [currenciesStore.currencies]);

  return (
    <>
      <div className="page">
        {/* {currenciesStore.status === "loading" && (
            <img src={require("@/assets/preloader.svg")} alt="preloader"></img>
          )} */}

        {currenciesStore.status === "idle" && (
          <Flipper flipKey={sortedCurrencies} className="container">
            {sortedCurrencies.map((currency: Currency, index: number) => {
              return (
                <Flipped key={currency.ticker} flipId={currency.ticker}>
                  <div className="block">
                    <div className="logo">
                      <div className="ticker">{currency.ticker}</div>
                      <div className="exchange">{currency.exchange}</div>
                    </div>

                    <div className="price">{currency.price}</div>
                    <div className="dividend">{currency.dividend}</div>
                    <div className="yield">{currency.yield}</div>

                    <div className="change">
                      {currency.change > 0 && (
                        <svg viewBox="0 0 24 24">
                          <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"></path>
                        </svg>
                      )}

                      {currency.change < 0 && (
                        <svg viewBox="0 0 24 24">
                          <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"></path>
                        </svg>
                      )}

                      <span>{currency.change}</span>
                    </div>

                    <div className="change-percent">
                      {currency.change_percent}
                    </div>
                    <div>
                      {dayjs(currency.last_trade_time).format("h:mm:ss A")}
                    </div>
                  </div>
                </Flipped>
              );
            })}
          </Flipper>
        )}

        {/* {currenciesStore.status === "failed" && (
            <>
              <img
                src={require("@/assets/cloudError.svg")}
                alt="Cloud Error"
              ></img>

              <h1>
                {typeof currenciesStore.error == "string" &&
                  currenciesStore.error}
              </h1>
            </>
          )} */}
      </div>
    </>
  );
};
export default HomePage;
