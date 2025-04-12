import {MarketDataStructure,FullSnapQuoteDataStructure} from './MessageStructure';

export const readMarketData = (data,prevClose)=>
{
    let multiplier = getMultiplier(1)
    let response = {}
    //add data fetched from api
    MarketDataStructure.forEach(m =>{
        response[m.field] = convertIntoFormat(data,m.start,m.end,m.type,multiplier);
    });
    // let PC = prevClose == -1 ? response['close_price'] : prevClose;
    let PC = response['close_price'];

    let changed_amount = convertIntoNumber(response['last_traded_price'])-convertIntoNumber(PC);

    if(Number.isNaN(changed_amount))
    {
        changed_amount = 0;
        PC = '-1';
    }
    response['change_price'] = convertIntoMoneyFormat(changed_amount);

    if(convertIntoNumber(PC) === 0){
        response['change_percentage'] = (0).toFixed(2)+'%';
    }
    else{
        response['change_percentage'] = ((changed_amount/convertIntoNumber(PC))*100).toFixed(2)+'%';
    }

    let size = MarketDataStructure[MarketDataStructure.length - 1].end;
    return {
        livedata : response,
        size : size
    };
}

export const readFullSnapQuoteData = (data)=>
{
    let multiplier = getMultiplier(1)
    let response = {}
    //add data fetched from api
    FullSnapQuoteDataStructure.forEach(m =>{
        response[m.field] = convertIntoFormat(data,m.start,m.end,m.type,multiplier);
    });

    let size = MarketDataStructure[MarketDataStructure.length - 1].end;
    return {
        livedata : response,
        size : size
    };
}

export const setChange = (lastPrice,OpenPrice)=>{
    let changed_amount = convertIntoNumber(lastPrice)-convertIntoNumber(OpenPrice);
    let change_price = convertIntoMoneyFormat(changed_amount);
    let change_percentage = convertIntoMoneyFormat(((changed_amount / convertIntoNumber(OpenPrice)) * 100).toFixed(2)) + '%';

    return {
        change_price,change_percentage
    }
}

export const readMarketStatus = (data)=>{
    let exchange_code = parseInt(buf2hex(data.slice(1,2),16));
    let market_type_length = parseInt(buf2hex(data.slice(2,4),16))/100;
    let market_type = buf2hex(data.slice(4,4+market_type_length),16);
    let status_length = parseInt(buf2hex(data.slice(4+market_type_length,6+market_type_length),16));
    let status = buf2hex(data.slice(6+market_type_length,6+market_type_length+status_length),16);
    let timestamp = getTimeStamp(parseInt(buf2hex(data.slice(6+market_type_length+status_length,10+market_type_length+status_length),16)));

    console.log(exchange_code,market_type_length,market_type,status_length,status,timestamp);

}

function convertIntoFormat(data,a,b,type,multiplier)
{
    if(type === 'p')
    {
        return (parseInt(buf2hex(data.slice(a,b)),16)/multiplier);
    }
    else if(type === 't')
    {
        return getTimeStamp(parseInt(buf2hex(data.slice(a,b)),16))
    }
    else if(type === 'a_n')
    {
        let res = []
        for(let i=a; i<b; i+=4)
        {
            res.push(parseInt(buf2hex(data.slice(i, i+4)),16));
        }
        return res;
    }
    else if(type === 'a_p')
    {
        let res = []
        for(let i=a; i<b; i+=4)
        {
            res.push(parseInt(buf2hex(data.slice(i, i+4)),16)/multiplier);
        }
        return res;
    }
    else
    {
        return (parseInt(buf2hex(data.slice(a,b)),16));
    }
}

function convertIntoNumber(num)
{
    // return parseFloat(num.replace(/,/g,''));
    return num
}

function convertIntoMoneyFormat(num) 
{ 
    if (num === undefined || isNaN(num)) {
        return '0.00';
    }
    return parseFloat(num).toLocaleString('en-IN',{
        minimumFractionDigits: 2,
        currency: 'INR'
    });
}

function getMultiplier(exchange)
{
    switch(exchange)
    {
        case 1:
            return 100;
        case 2:
            return 100
        case 3:
            return 10000000
        case 4:
            return 100
        case 6:
            return 100
        case 7:
            return 100
    }
}

function buf2hex(buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

function getTimeStamp(unix)
{
    var date = new Date(unix * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return formattedTime;
}


