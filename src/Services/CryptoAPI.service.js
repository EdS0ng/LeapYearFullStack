import axios from 'axios';

export class CryptoAPI {
    provider;

    constructor (endpoint){
        this.provider = axios.create({
            baseURL:endpoint
        });
    }

    getPrices(fromCurrencies, to){
        return this.provider.get("pricemultifull", {
            params:{
                fsyms:fromCurrencies.join(","),
                tsyms:to
            }
        });
    }

    getCoins(){
        return this.provider.get("all/coinlist");
    }
}