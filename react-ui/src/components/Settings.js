import React, { Component } from 'react';
import ls from 'local-storage';

export default class Settings extends Component {
    render() {
        return (
            <div>
                <p>You are on the Settings component!</p>
                <p>counter: {ls.get('counter')}</p>
                <p>ingredients: {JSON.stringify(ls.get('ingredients'))}</p>
                <p>results: {JSON.stringify(ls.get('results'))}</p>
            </div>
        )
    }
}
