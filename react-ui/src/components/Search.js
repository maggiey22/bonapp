import React, { Component } from 'react';

import './Search.css';

import AddItem from './item/AddItem';
import ItemList from './item/ItemList';

export default class Search extends Component {
    render() {
        return (
            <div className="search">
                <div className="col left-col">
                    <React.Fragment>
                        <AddItem add={this.props.addIngredient} placeholder="Add an ingredient..." className="ingredient"/>
                        <div className="list">
                            <ItemList className="ingredient" items={this.props.ingredients} deleteItem={this.props.deleteIngredient}/> 
                        </div>
                    </React.Fragment>
                </div>
                <div id="instructions" className="col right-col">
                    <p>Find recipes for the ingredients you already have!</p>
                    <div>
                        <button className="blue-btn" id="search-btn" onClick={this.props.search}>Search</button>
                        <br/>
                        <button className="blue-btn" id="clear-ingred-btn" onClick={this.props.resetIngredients}>Clear list</button>
                    </div>
                </div>
            </div>
        );
    }
}
