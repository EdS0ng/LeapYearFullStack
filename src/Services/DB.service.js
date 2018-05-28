import axios from 'axios';

export class DatabaseService {
    instance;

    constructor(baseUrl) {
        this.instance = axios.create({
            baseURL:baseUrl
        });
    }

    getCurrencyPairs(){
        return this.instance.get("CurrencyPairs");
    }

    addCurrencyPair(currency){
        return this.instance.post("CurrencyPairs", {currency:currency});
    }

    removeCurrencyPair(id){
        return this.instance.delete("CurrencyPairs/"+id);
    }




}