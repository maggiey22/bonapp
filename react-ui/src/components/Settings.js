import React, { Component } from 'react';
import ls from 'local-storage';

import AddItem from './item/AddItem';
import ItemList from './item/ItemList';

export default class Settings extends Component {
    state = {
        counter: 0,
        ingredients: [], // TODO - use map instead
        channels: new Set(),
        results: [],
        isUpdated: false,
    }

    componentDidMount() {
        this.setState({
            counter: ls.get('counter') || 0,
            ingredients: ls.get('ingredients') || [],
            channels: ls.get('channels') || new Set(),
            results: ls.get('results') || [],
            isUpdated: ls.get('isUpdated') || false,
        });
    }

    render() {
        return (
            <div>
                <p>You are on the Settings component!</p>
                <AddItem add={this.props.addChannel} placeholder="Add a YouTube channel URL..." className="channel-field"/>
                <div className="channel-list">
                    <ItemList className="channel" items={this.props.channels} deleteItem={this.props.deleteChannel}/> 
                </div>
                <button onClick={this.props.reset}>Clear channels</button>
                {/* <p>counter: {this.state.counter}</p>
                <p>channels: {JSON.stringify(Array.from(this.state.channels))}</p>
                <p>ingredients: {JSON.stringify(this.state.ingredients)}</p>
                <p>results: {JSON.stringify(this.state.results)}</p> */}
                
                {/* <p>counter: {ls.get('counter')}</p>
                <p>channels: {JSON.stringify(Array.from(ls.get('channels')))}</p>
                <p>ingredients: {JSON.stringify(ls.get('ingredients'))}</p>
                <p>results: {JSON.stringify(ls.get('results'))}</p> */}
            </div>
        );
    }
}
