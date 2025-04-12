const { getDeviceSize } = require("./InteractiveUtils");

let MarketDataStructure = [
  {
    field: "instrument_token",
    start: 2,
    end: 6,
    type: "n",
  },
  {
    field: "last_traded_price",
    start: 6,
    end: 10,
    type: "p",
  },
  {
    field: "last_traded_time",
    start: 10,
    end: 14,
    type: "t",
  },
  {
    field: "last_traded_quantity",
    start: 14,
    end: 18,
    type: "n",
  },
  {
    field: "trade_volume",
    start: 18,
    end: 22,
    type: "n",
  },
  {
    field: "best_bid_price",
    start: 22,
    end: 26,
    type: "p",
  },
  {
    field: "best_bid_quantity",
    start: 26,
    end: 30,
    type: "n",
  },
  {
    field: "best_ask_price",
    start: 30,
    end: 34,
    type: "p",
  },
  {
    field: "best_ask_quantity",
    start: 34,
    end: 38,
    type: "n",
  },
  {
    field: "total_buy_quantity",
    start: 38,
    end: 46,
    type: "n",
  },
  {
    field: "total_sell_quantity",
    start: 46,
    end: 54,
    type: "n",
  },
  {
    field: "average_trade_price",
    start: 54,
    end: 58,
    type: "p",
  },
  {
    field: "exchange_timestamp",
    start: 58,
    end: 62,
    type: "t",
  },
  {
    field: "open_price",
    start: 62,
    end: 66,
    type: "p",
  },
  {
    field: "high_price",
    start: 66,
    end: 70,
    type: "p",
  },
  {
    field: "low_price",
    start: 70,
    end: 74,
    type: "p",
  },
  {
    field: "close_price",
    start: 74,
    end: 78,
    type: "p",
  },
  {
    field: "yearly_high_price",
    start: 78,
    end: 82,
    type: "p",
  },
  {
    field: "yearly_low_price",
    start: 82,
    end: 86,
    type: "p",
  },
];

let FullSnapQuoteDataStructure = [
  {
    field: "instrument_token",
    start: 2,
    end: 6,
    type: "n",
  },
  {
    field: "top_5_buyers",
    start: 6,
    end: 26,
    type: "a_n",
  },
  {
    field: "top_5_bid_prices",
    start: 26,
    end: 46,
    type: "a_p",
  },
  {
    field: "top_5_bid_quantities",
    start: 46,
    end: 66,
    type: "a_n",
  },
  {
    field: "top_5_sellers",
    start: 66,
    end: 86,
    type: "a_n",
  },
  {
    field: "top_5_ask_prices",
    start: 86,
    end: 106,
    type: "a_p",
  },
  {
    field: "top_5_ask_quantities",
    start: 106,
    end: 126,
    type: "a_n",
  },
  {
    field: "average_traded_price",
    start: 126,
    end: 130,
    type: "p",
  },
  {
    field: "open_price",
    start: 130,
    end: 134,
    type: "p",
  },
  {
    field: "high_price",
    start: 134,
    end: 138,
    type: "p",
  },
  {
    field: "low_price",
    start: 138,
    end: 142,
    type: "p",
  },
  {
    field: "close_price",
    start: 142,
    end: 146,
    type: "p",
  },
  {
    field: "total_buy_quantity",
    start: 146,
    end: 154,
    type: "n",
  },
  {
    field: "total_sell_quantity",
    start: 154,
    end: 162,
    type: "n",
  },
  {
    field: "volume",
    start: 162,
    end: 166,
    type: "n",
  },
];

let Exchanges = [
  {
    exchange: "NSE",
    code: 1,
    multiplier: 100,
  },
  {
    exchange: "NFO",
    code: 2,
    multiplier: 100,
  },
  {
    exchange: "CDS",
    code: 3,
    multiplier: 10000000,
  },
  {
    exchange: "MCX",
    code: 4,
    multiplier: 100,
  },
  {
    exchange: "BSE",
    code: 6,
    multiplier: 100,
  },
  {
    exchange: "BFO",
    code: 7,
    multiplier: 100,
  },
];

const DEVICE_SIZE = getDeviceSize();

function getExchangeCode(exchange) {
  return Exchanges.find((e) => e.exchange === exchange);
}

function getExchangeName(code) {
  return Exchanges.find((e) => e.code === code);
}

function getCandleDuration(range, index = false) {
  switch (range) {
    case "D":
      return {
        candle: 1,
        duration: 1,
        title: "1M",
        mixed: false,
      };
    case "1D":
      return {
        candle: 1,
        duration: DEVICE_SIZE === "S" ? 5 : 1,
        title: "1M",
        mixed: false,
      };
    case "5D":
      return {
        candle: 1,
        duration: DEVICE_SIZE === "S" ? 30 : 5,
        title: "5M",
        mixed: false,
      };
    case "1M":
      return {
        candle: 1,
        duration: DEVICE_SIZE === "S" ? 120 : 30,
        title: "30",
        mixed: false,
      };
    case "3M":
      return {
        candle: 2,
        duration: 1,
        title: "60M",
        mixed: index ? true : false,
      };
    case "6M":
      return {
        candle: 3,
        duration: 1,
        title: "1440M",
        mixed: index ? true : false,
      };
    case "YTD":
      return {
        candle: 3,
        duration: 1,
        title: "1440M",
        mixed: index ? true : false,
      };
    case "1Y":
      return {
        candle: 3,
        duration: 1,
        title: "1440M",
        mixed: false,
      };
    case "5Y":
      return {
        candle: 3,
        duration: 1,
        title: "1440M",
        mixed: true,
      };

    case "MAX":
      return {
        candle: 3,
        duration: 1,
        title: "1440M",
        mixed: true,
      };
    default:
      return {
        candle: 3,
        duration: 1,
        title: "1440M",
        mixed: false,
      };
  }
}

module.exports = {
  MarketDataStructure,
  FullSnapQuoteDataStructure,
  getExchangeCode,
  getExchangeName,
  getCandleDuration,
};
