import React, { PureComponent } from 'react';

export class CryptoItem extends PureComponent {

    render(){
        return (
            <tr>
                <td>{this.props.data.FROM+" : "+this.props.data.TO}</td>
                <td>{this.props.data.PRICE}</td>
                <td>{this.props.data.MARKET}</td>
                <td>
                    <div className="is-grouped field">
                        <span className="control">
                            <button title="Refresh Data" onClick={this.props.onRefresh} 
                                className="button is-small is-rounded is-primary">
                                Refresh
                            </button>
                        </span>
                        <span className="control">
                            <button className="delete" title="Delete From Tracker" onClick={this.props.onDelete}></button>
                        </span>
                    </div>
                </td>
            </tr>
        );
    }
}