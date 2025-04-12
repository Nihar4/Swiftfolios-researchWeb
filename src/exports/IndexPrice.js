// const axios = require("axios");
import axios from "axios";
// const REQUEST_BASE_URL = process.env.REACT_APP_REQUEST_BASE_URL;
const REQUEST_BASE_URL = "https://www.swiftfolios.com/api/v1";


export const IndexPrice = async (index_name) => {

    return new Promise((resolve, reject) => {

        axios.get(`${REQUEST_BASE_URL}/LatestPriceIndex/${index_name}`)
            .then((response) => {
                const data = response.data;
                if (data.status === 'success') {

                    resolve({
                        error: false,
                        closearray: data.close
                    })
                }
                else {
                    resolve({
                        error: true,
                    })
                }

            })
            .catch((error) => {
                resolve({
                    error: true,
                })
            })
    })
}
