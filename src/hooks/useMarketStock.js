import { useEffect, useRef, useState } from "react";
import { readMarketData, setChange } from "../exports/FormatData";
import { StockPrice } from "../exports/StockPrice";
import { IndexPrice } from "../exports/IndexPrice";
import { GetStockConfig } from "../exports/GetStockConfig";

const LIVEFEED_BASE_URL = process.env.REACT_APP_LIVEFEED_BASE_URL;
let WEBSOCKET_INTERVAL = false;

function IsMarketOpen() {
    const now = new Date();
    const day = now.getDay();

    if (day == 6 || day == 0) {
        return false;
    }

    const ISTTimeInMillis = now.getTime();

    const startOfDayIST = new Date(ISTTimeInMillis);
    startOfDayIST.setHours(0, 0, 0, 0);

    const timeDifferenceInMillis = ISTTimeInMillis - startOfDayIST.getTime();

    const minutesPassed = Math.floor(timeDifferenceInMillis / (1000 * 60));

    if (minutesPassed >= 540 && minutesPassed <= 930) {
        return true;
    }

    return false;
}

const useMarketStock = (symbol, is_index = false) => {
    const wsRef = useRef(null);
    const configRef = useRef(null);
    const closeRef = useRef([]);

    const [configLoaded, setConfigLoaded] = useState(false);
    const [connection, setConnection] = useState(false);
    const [stockData, setStockData] = useState(null);

    useEffect(() => {
        GetWebSocketConnection();

        return () => {
            CloseWebSocketConnection();
        };
    }, []);

    useEffect(() => {
        // console.log('=============> GETTING CONFIG DATA FOR', symbol);
        setConfigLoaded(false);
        configRef.current = null;

        if (!symbol || symbol == "") return;

        async function GetConfig() {
            const config = await GetStockConfig(symbol);
            return config;
        }

        GetConfig()
            .then((data) => {
                configRef.current = data;
            })
            .catch(() => {
                configRef.current = false;
            })
            .finally(() => {
                setConfigLoaded(true);
            });

        return () => {
            CloseWebSocketData();
        };
    }, [symbol]);

    useEffect(() => {
        if (!configRef.current) return;
        GetCloseArray().then(() => {
            GetWebSocketData();
        })
    }, [connection, configLoaded]);

    async function GetCloseArray() {
        if (!configRef.current) return;

        if (is_index) {
            const data = await IndexPrice(symbol);
            if (!data.error) {
                closeRef.current = data.closearray;
            }
        } else {
            const config = configRef.current;
            const data = await StockPrice(config.exchange, config.code);
            if (!data.error) {
                closeRef.current = data.closearray;
            }
        }
    }

    function GetWebSocketConnection() {
        // console.log("===== GET WEBSOCKET CONNECTION =====");
        // console.log("CONNECTION STATUS is", connection, wsRef);

        if (connection || wsRef?.current) return;

        // console.log("CREATE NEW WEBSOCKET CONNECTION");
        let socket = new WebSocket(LIVEFEED_BASE_URL);
        wsRef.current = socket;

        socket.onopen = () => {
            // console.log("OPEN ON WEBSOCKET");
            // console.log('===== CONNECTION ESTABLISHED =====')
            setConnection(true);
        };

        socket.onclose = () => {
            // console.log("CLOSE ON WEBSOCKET");
            wsRef.current = false;
            setConnection(false);
        };

        socket.onerror = () => {
            // console.log("ERROR ON WEBSOCKET");
            wsRef.current = false;
            setConnection(false);
        };
    }

    function GetWebSocketData() {
        // console.log('GET SOCKET DATA FOR', symbol,connection)
        if (
            !connection ||
            !wsRef.current ||
            wsRef.current.readyState !== 1 ||
            !configRef.current
        )
            return;

        const ws = wsRef.current;
        const config = configRef.current;
        const close_array = closeRef.current;

        ws.onmessage = (response) => {
            var reader = new FileReader();
            reader.readAsArrayBuffer(response.data);

            let convertedData;

            reader.onloadend = async (event) => {
                let data = new Uint8Array(reader.result);

                if (response.data.size >= 86) {
                    if (stockData) {
                        convertedData = readMarketData(data, stockData["close_price"]);
                    } else {
                        convertedData = readMarketData(data, -1);
                    }

                    let livedata = convertedData.livedata;

                    if (
                        !IsMarketOpen() &&
                        livedata.last_traded_price === livedata.close_price
                    ) {
                        let last_close;

                        const last_close_array = close_array.filter((c) => {
                            return c !== livedata.close_price;
                        });


                        last_close =
                            last_close_array.length > 0
                                ? last_close_array[0]
                                : livedata.last_traded_price;

                        // console.log(symbol,livedata.last_traded_price,last_close_array,last_close)

                        const { change_price, change_percentage } = setChange(
                            livedata.last_traded_price,
                            last_close
                        );

                        // console.log(symbol,change_price, change_percentage)

                        livedata["last_traded_price"] = livedata.last_traded_price;
                        livedata["change_price"] = change_price;
                        livedata["change_percentage"] = change_percentage;
                    }

                    setStockData(livedata);
                }
            };
        };

        // console.log('SUBSCRIBE',symbol,config)
        ws.send(
            JSON.stringify({
                a: "subscribe",
                v: [[config.exchange, config.code]],
                m: "marketdata",
            })
        );

        ws.onclose = () => {
            // console.log('CLOSE EVENT FIRE IN WEBSCOKET FOR', symbol)
            clearInterval(WEBSOCKET_INTERVAL);
        };

        WEBSOCKET_INTERVAL = setInterval(() => {
            if ((!ws && WEBSOCKET_INTERVAL) || ws.readyState === 3) {
                clearInterval(WEBSOCKET_INTERVAL);
                return;
            }
            ws.send(
                JSON.stringify({
                    a: "h",
                    v: [[config.exchange, config.code]],
                    m: "",
                })
            );
        }, 10 * 1000);
    }

    function CloseWebSocketData() {
        // console.log('CLOSE SOCKET DATA FOR', symbol);
        if (!wsRef.current || wsRef.current.readyState !== 1 || !configRef.current)
            return;

        const ws = wsRef.current;
        const config = configRef.current;
        // console.log('UNSUBSCRIBE',symbol,config);

        ws.send(
            JSON.stringify({
                a: "unsubscribe",
                v: [[config.exchange, config.code]],
                m: "marketdata",
            })
        );

        if (WEBSOCKET_INTERVAL) {
            clearInterval(WEBSOCKET_INTERVAL);
        }
    }

    function CloseWebSocketConnection() {
        // console.log("===== CLOSE WEBSOCKET CONNECTION =====");

        const ws = wsRef.current;

        // console.log("WEB SOCKET =>", ws);

        if (!ws) return;
        // console.log("CLOSE SOCKET");

        if (ws.readyState === 1) {
            ws.close();
            setConnection(false);
        }
    }

    return stockData;
};

export default useMarketStock;
