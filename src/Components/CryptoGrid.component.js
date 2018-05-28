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
            items : [],
            PctChg:"DAY",
            currentSort:{
                column:"PRICE",
                direction:"asc"
            }
        }
    }

    componentWillReceiveProps(nextProps){
        if (this.props.currencies !== nextProps.currencies || this.props.API !== nextProps.API || this.props.exchange !== nextProps.exchange){
            this.retrieveCurrencyInfo(nextProps.currencies, nextProps.api, nextProps.exchange);
        }
    }

    componentDidMount(){
        this.retrieveCurrencyInfo(this.props.currencies, this.props.api);
    }

    
    handleDelete(i){
        this.props.onDelete(this.state.items[i].FROM);
    }
    
    handleRefresh(i){
        this.props.api.getPrices([this.state.items[i].FROM], "USD").then((resp)=>{
            let newItems = this.state.items.slice();
            newItems[i] = this.mapToListAndFlatten(resp.data.DISPLAY)[0];
            this.setState({
                items : newItems
            });
        })
    }

    handlePercentChange = (event)=>{
        this.setState({
            PctChg:event.target.value
        });
    }
    
    //out of time for sort
    //keep track of current sort column and direction. on click, check if current sort is the same, if so
    //change direction to opposite and sort.
    //else sort asc by that field
    handleHeaderClick(field){
        // if (field === "CHANGEPCT") field = "CHANGEPCT"+this.state.PctChg;

        // let items = this.state.items.slice();

        // items.sort((a,b)=>{
        //     a[field]
        // })
    }
    
    renderRowItem(i, item) {
        return (<CryptoItem key={item.FROM+" : "+item.TO} data={item} onDelete={()=>this.handleDelete(i)} 
        onRefresh={()=>this.handleRefresh(i)} pctchange={this.state.PctChg}/>);
    }
    
    render (){
        return (
            <div className="container">
                <table className="table is-fullwidth is-hoverable">
                    <thead>
                        <tr>
                            <th>CurrencyPair</th>
                            <th onClick={()=>this.handleHeaderClick("PRICE")}>Price</th>
                            <th>Exchange</th>
                            <th onClick={()=>this.handleHeaderClick("MKTCAP")}>Market Cap</th>
                            <th onClick={()=>this.handleHeaderClick("CHANGEPCT")}>
                                % Chg
                                <div className="select">
                                    <select onChange={this.handlePercentChange}>
                                        <option value="DAY">Day</option>
                                        <option value="24HOUR">24 Hrs</option>
                                    </select>
                                </div>
                            </th>
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

    retrieveCurrencyInfo(currencies, api, exchange){
        if (currencies.length === 0){
            this.setState({
                items : []
            });
            return;
        }

        let currencyVals = currencies.map(curr=>curr.val);
        api.getPrices(currencyVals, "USD", exchange).then((resp)=>{
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