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
			exchanges:[],
			currentExchange:"CCCAGG",
			API : new CryptoAPI(CryptoAPIUrl)
		}
	}

	componentDidMount(){
        this.state.API.getCoins().then(resp=>{
            this.setState({
                availableCurrencies : Object.keys(resp.data.Data)
            })
        })

		this.state.API.getExchanges().then(resp=>{
			this.setState({
				exchanges:Object.keys(resp.data).filter(ex=> ex !== "CCCAGG")
			});
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

		this.input.value = "Select a CryptoCurrency";
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

	changeExchange = (ev)=>{
		this.setState({
			currentExchange: ev.target.value
		});
	}

	//ran out of time for exchange, unfortunately the api returns an error if even one pair is not in exchange
	render() {
		return (
			<React.Fragment>
				<Header />
				<div className="container marginTop columns">
					<div className="column">
						<div className="select">
							<select ref={(input)=>this.input = input} defaultValue="Select a CryptoCurrency">
								<option disabled>Select a CryptoCurrency</option>
								{this.state.availableCurrencies.map(coin=><option key={coin}>{coin}</option>)}
							</select>
						</div>
						<button className="button is-success" onClick={this.handleAdd}>Save</button>
					</div>
					<div className="column">
						<div className="select">
							<select disabled onChange={this.changeExchange} value={this.state.currentExchange}>
								<option>CCCAGG</option>
								{this.state.exchanges.map(ex=><option key={ex}>{ex}</option>)}
							</select>
						</div>
					</div>
				</div>
				<CryptoGrid api={this.state.API} currencies={this.state.currencies} 
					onDelete={this.handleDelete} exchange={this.state.currentExchange}/>
			</React.Fragment>
		)
	}
}

export default App
