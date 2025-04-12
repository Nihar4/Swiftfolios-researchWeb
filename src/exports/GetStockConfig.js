// const axios = require("axios");
import axios from "axios";


// const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;
const REQUEST_BASE_URL = "https://www.swiftfolios.com/api/v1";

const cache = new Map();

export const GetStockConfig = async (symbol) => {
  return new Promise((resolve, reject) => {
    if (cache.has(symbol)) {
      const cached_data = cache.get(symbol);
      resolve(cached_data);
    } else {
      axios
        .get(`${REQUEST_BASE_URL}/GetStockConfig/${symbol}`)
        .then((response) => {
          response = response.data;
          if (!response.error) {
            let stock = response.stock;
            cache.set(symbol, stock);
            resolve(stock);
          }
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};
