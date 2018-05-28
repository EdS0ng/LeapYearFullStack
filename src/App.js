import React, { Component } from 'react'
import 'bulma/css/bulma.css'
import './App.css'

import { Header } from './Components/Header.component';
import { CryptoGrid } from './Components/CryptoGrid.component';
import { CryptoAPI } from './Services/CryptoAPI.service';
import { DatabaseService } from './Services/DB.service';

const CryptoAPIUrl = "https://min-api.cryptocompare.com/data";
const DatabaseURL = "http://localhost:3005";

class App extends Component {
	DB;

	constructor(props){
		super(props);

		this.DB = new DatabaseService(DatabaseURL);

		this.state = {
			currencies : [],
			availableCurrencies:[],
			savedPairsRetrieved : false,
			API : new CryptoAPI(CryptoAPIUrl)
		}
	}

	componentDidMount(){
        this.state.API.getCoins().then(resp=>{
            this.setState({
                availableCurrencies : Object.keys(resp.data.Data)
            })
        })

		this.DB.getCurrencyPairs().then(resp=>{
			this.setState({
				currencies:resp.data
			});
		}, err=>{
			console.error(err);
		});
	}

	handleAdd = ()=>{
		let val = this.input.value;
		console.log(val);
		if (val && val !== "Select a CryptoCurrency"){
			this.DB.addCurrencyPair(val).then(resp=>{
				let newList = this.state.currencies.slice();
				newList.push(resp.data);
				this.setState({
					currencies:newList
				});
			})
		}
	}

	handleDelete = (pair)=>{
		let nextCurrencies = this.state.currencies.slice();
		
		let index = nextCurrencies.findIndex(currency => currency.val === pair);

		let toBeRemoved = nextCurrencies.splice(index, 1)[0];

		this.DB.removeCurrencyPair(toBeRemoved.id).then(resp=>{
			this.setState({
				currencies : nextCurrencies
			});
		})

	}

	render() {
		return (
			<React.Fragment>
				<Header />
				<div className="container marginTop">
					<div className="select">
                        <select ref={(input)=>this.input = input} defaultValue="Select a CryptoCurrency">
                            <option disabled>Select a CryptoCurrency</option>
							{this.state.availableCurrencies.map(coin=><option key={coin}>{coin}</option>)}
                        </select>
                    </div>
                    <button className="button is-success" onClick={this.handleAdd}>Save</button>
				</div>
				<CryptoGrid api={this.state.API} currencies={this.state.currencies} onDelete={this.handleDelete}/>
			</React.Fragment>
		)
	}
}

export default App
