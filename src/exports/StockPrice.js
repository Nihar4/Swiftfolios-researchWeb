// const axios = require("axios");
import axios from "axios";
const moment = require('moment');
const { getExchangeName } = require('./MessageStructure');

const HISTORICAL_BASE_URL = process.env.REACT_APP_HISTORICAL_BASE_URL;


export const StockPrice = async (exchange, token) => {

    return new Promise((resolve, reject) => {

        const start_time = moment().subtract(1, 'weeks').unix();
        const end_time = moment().unix();
        exchange = getExchangeName(exchange).exchange;

        let closearray = [];

        axios.get(`${HISTORICAL_BASE_URL}?exchange=${exchange}&token=${token}&candletype=3&starttime=${start_time}&endtime=${end_time}&data_duration=1`)
            .then((response) => {
                const data = response.data;
                if (data.status === 'success') {
                    const candles = data.data.candles;
                    candles.forEach(candle => {
                        closearray.push(candle[4] && parseFloat(candle[4]));
                    });
                    resolve({
                        error: false,
                        closearray: closearray.reverse()
                    })
                }
                else {
                    resolve({
                        error: true,
                    })
                }

            })
            .catch((error) => {
                console.log(error)
                resolve({
                    error: true,
                })
            })
    })
}
