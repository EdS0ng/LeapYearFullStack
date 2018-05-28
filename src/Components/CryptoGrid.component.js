import React, { Component } from 'react';

import { CryptoItem } from './CryptoItem.component';

/**
 * Props : { currencies : [], api : class}
 * 
 */
export class CryptoGrid extends Component {
    constructor (props){
        super(props);
        this.state = {
            items : []
        }
    }

    componentWillReceiveProps(nextProps){
        if (this.props.currencies !== nextProps.currencies || this.props.API !== nextProps.API){
            this.retrieveCurrencyInfo(nextProps.currencies, nextProps.api);
        }
    }

    componentDidMount(){
        this.retrieveCurrencyInfo(this.props.currencies, this.props.api);
    }

    
    handleDelete(i){
        this.props.onDelete(this.state.items[i].FROM);
    }
    
    handleRefresh(i){
        // this.state.api.getPrices()
    }
    
    renderRowItem(i, item) {
        return (<CryptoItem key={item.FROM+" : "+item.TO} data={item} onDelete={()=>this.handleDelete(i)} 
        onRefresh={()=>this.handleRefresh(i)}/>);
    }
    
    render (){
        return (
            <div className="container">
                <table className="table is-fullwidth is-hoverable">
                    <thead>
                        <tr>
                            <th>CurrencyPair</th>
                            <th>Price</th>
                            <th>Exchange</th>
                            <th></th>
                        </tr>
                    </thead>
                        <tbody>
                            {this.state.items.map((item, index)=>this.renderRowItem(index, item))}
                        </tbody>
                </table>
            </div>
        );
    }

    retrieveCurrencyInfo(currencies, api){
        if (currencies.length === 0){
            this.setState({
                items : []
            });
            return;
        }

        let currencyVals = currencies.map(curr=>curr.val);
        api.getPrices(currencyVals, "USD").then((resp)=>{
            this.setState({
                items : this.mapToListAndFlatten(resp.data.DISPLAY)
            })
        }, (error)=>{
            console.error(error);
        })
    }

    //maybe later...too much complexity for now
    // checkCurrencyChange(nextCurrencies){
    //     let currentCurrencies = this.props.currencies;
    //     let diffs = [];

    //     nextCurrencies.forEach(currency =>{
    //         let ind = this.state.items.findIndex(item=>item.FROM === currency);
    //         if (ind === -1) diffs.push({})
    //     })
    // }

    mapToListAndFlatten(data){
        let flatArr = [];

        this.ObjectToArray(data, "FROM").forEach(currency =>{
            let from = currency.FROM;
            delete currency.FROM; //we don't want this as an element

            this.ObjectToArray(currency, "TO").forEach(item =>{
                item["FROM"] = from;
                flatArr.push(item);
            })
        });

        return flatArr;
    }

    ObjectToArray(obj, keyToProp){
        let Arr = [];
        let keys = Object.keys(obj);
        keys.forEach(key=>{
            if (keyToProp) obj[key][keyToProp] = key; //add the key as a property so we don't lose this info
            Arr.push(obj[key]);
        });

        return Arr;
    }
}