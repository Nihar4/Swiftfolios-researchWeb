import axios from "axios";

const ServerRequest = async ({
    method = "get",
    URL,
    data,
    headers = {},
    signal
}) => {
    console.log("bu",process.env.REACT_APP_REQUEST_BASE_URL)

    const base_url = process.env.REACT_APP_REQUEST_BASE_URL;
    let url = base_url + URL
    console.log("url",url)
    try {
        const result = await axios({
            method,
            url,
            data,
            headers,
            signal
        });
        return result.data;
    } catch (error) {
        if (error.code == "ERR_CANCELED") {
            console.log("cancelled")
            throw error;
        }
        return {
            server_error: true,
            message: error?.response?.data?.message || error?.message
        };
    }
};

export default ServerRequest;
