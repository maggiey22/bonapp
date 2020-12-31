import React, { Component } from 'react';
import ls from 'local-storage';
import axios from 'axios';

import './Search.css';

import AddItem from './item/AddItem';
import ItemList from './item/ItemList';

const BASE_SERVER_URL = 'http://localhost:5000';

export default class Search extends Component {
    // not sure if state and componentDidMount are needed in App.js
    state = {
        counter: 0,
        ingredients: [], // TODO - use map instead
        channels: [],
        results: [],
    }

    componentDidMount() {
        this.setState({
            counter: ls.get('counter') || 0,
            ingredients: ls.get('ingredients') || [],
            channels: ls.get('channels') || [],
        });
    }

    addIngredient = (name) => {
        const currCount = this.state.counter;
        const newIngredient = {
            id: currCount, // TODO - use object hash (after switch to map over array for holding ingredients)
            name
        }
        const nextIngredients = [...this.state.ingredients, newIngredient];

        // TODO - use prevState instead of this.state since prevState is more accurate
        this.setState({
            counter: currCount + 1,
            ingredients: nextIngredients
        });

        ls.set('counter', currCount + 1);
        ls.set('ingredients', nextIngredients);
    }

    deleteIngredient = (id) => {
        /*
        this is also safe! reading this.state after a setState is unsafe, but we aren't doing that here
        const nextState = {
            ...this.state,
            ingredients: this.state.ingredients.filter(ingred => ingred.id !== id)
        };
        this.setState(nextState);
        ls.set('counter', nextState.counter);
        ls.set('ingredients', nextState.ingredients);
        */
        this.setState(prevState => ({
                ...prevState,
                ingredients: prevState.ingredients.filter(ingred => ingred.id !== id)
            }),
            () => {
                ls.set('counter', this.state.counter);
                ls.set('ingredients', this.state.ingredients);
            }
        );
    }

    deleteAllIngredients = () => {
        const nextState = {
            counter: 0,
            ingredients: [],
            results: [],
        }
        this.setState(nextState);
        ls.set('counter', nextState.counter);
        ls.set('ingredients', nextState.ingredients);
        ls.set('results', nextState.results);
    }

    search = () => {
        if (ls.get('ingredients').length === 0) {
            alert('Nothing to search for.');
            return null;
        }

        const body = {
            items: this.state.ingredients,
            channels: ['UC84Zkx_92divh3h4sKXeDew', 'UCK27TX8CB0yFnXPNZRbIK5g']
        }
        // axios.post(`${BASE_SERVER_URL}/search`, body)
        axios.post(`${BASE_SERVER_URL}/search/dummydata`, body)
            .then(res => {
                const nextState = {
                    results: res.data,
                }
                this.setState(nextState);
                ls.set('results', nextState.results)
                window.location = '/recipes';
            });
    }

    render() {
        return (
            <div className="search">
                <div className="col left-col">
                    <React.Fragment>
                        <AddItem add={this.addIngredient} placeholder="Add an ingredient..." className="ingredient-field"/>
                        <div className="list">
                        <ItemList className="ingredient" items={this.state.ingredients} deleteItem={this.deleteIngredient}/> 
                        </div>
                    </React.Fragment>
                </div>
                <div id="instructions" className="col right-col">
                    <p>Find recipes for the ingredients you already have!</p>
                    <div>
                        <button className="pg1-btn" id="search-btn" onClick={this.search}>Search</button>
                        <br></br>
                        <button className="pg1-btn" id="clear-btn" onClick={this.deleteAllIngredients}>Clear list</button>
                    </div>
                </div>
            </div>
        );
    }
}
