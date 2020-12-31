import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import ls from 'local-storage';
import axios from 'axios';

import './App.css';
import eggy from './eggy.png';

import Navbar from './components/Navbar';
import AddItem from './components/AddItem';
import ItemList from './components/ItemList';
import Recipes from './components/Recipes';
import Settings from './components/Settings';
import About from './components/About';

const BASE_SERVER_URL = 'http://localhost:5000';

const Page_404 = props => (
    <div>
        <h3>404: Page Not Found</h3>
        <Link to="/">Back to Search</Link>
        <script>
            {window.location = "/"}
        </script>
    </div>
);

class App extends Component {
    state = {
        counter: 0,
        ingredients: [], // TODO - use map instead
        channels: [],
        results: [],
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

    componentDidMount() {
        this.setState({
            counter: ls.get('counter') || 0,
            ingredients: ls.get('ingredients') || [],
            channels: ls.get('channels') || [],
        });
    }

    render() {
        return (
            <Router>
            <div className="App">
                <div className="App-header">
                <Link to="/" className="App-homelink">
                    <img src={eggy} alt="Eggy logo!" className="App-logo"/>
                    YouTube Recipe Finder
                </Link>
                </div>
                <div className="tabs">
                <Navbar activeTab={window.location.pathname} search={this.search}/>
                <div className="file-bkgd">
                    <Switch>
                    <Route path="/" exact render={() => (
                        <div className="search">
                            <div className="col left-col">
                            {/* TODO - refactor to have this react fragment in IngredientList instead (?)
                            I think there may be some issues with styling because some css is split up
                            e.g. 100% width on input overflows the left column div :/
                            */}
                            <React.Fragment>
                                <AddItem add={this.addIngredient} placeholder="Add an ingredient..." className="ingredient-field"/>
                                <div className="list">
                                <ItemList className="ingredient" items={this.state.ingredients} deleteItem={this.deleteIngredient}/> 
                                </div>
                            </React.Fragment>
                            </div>
                            <div id="instructions" className="col right-col">
                            {/* TODO - fix formatting without brrrr */}
                            <p>Find recipes for the ingredients you already have!</p>
                            <div>
                                <button className="pg1-btn" id="search-btn" onClick={this.search}>Search</button>
                                <br></br>
                                <button className="pg1-btn" id="clear-btn" onClick={this.deleteAllIngredients}>Clear list</button>
                            </div>
                            </div>
                        </div>
                        )}
                    />
                    <Route path="/recipes" exact component={Recipes} />
                    <Route path="/settings" exact component={Settings} />
                    <Route path="/about" exact component={About} />
                    <Route component={Page_404} />
                    </Switch>
                </div>
                </div>
            </div>
            </Router>
        );
    }
}

export default App;
