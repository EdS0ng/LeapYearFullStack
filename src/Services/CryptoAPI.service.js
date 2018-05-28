import axios from 'axios';

export class CryptoAPI {
    provider;

    constructor (endpoint){
        this.provider = axios.create({
            baseURL:endpoint
        });
    }

    getPrices(fromCurrencies, to, exchange){
        return this.provider.get("pricemultifull", {
            params:{
                fsyms:fromCurrencies.join(","),
                tsyms:to,
                e:exchange
            }
        });
    }

    getCoins(){
        return this.provider.get("all/coinlist");
    }

    getExchanges(){
        return this.provider.get("all/exchanges");
    }
}