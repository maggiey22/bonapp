import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import axios from 'axios';
import ls from 'local-storage';

import './App.css';
import eggy from './eggy.png';

import Navbar from './components/Navbar';
import Search from './components/Search';
import Recipes from './components/Recipes';
import Settings from './components/Settings';
import About from './components/About';

const BASE_SERVER_URL = 'http://localhost:5000';
const DEFAULT_CHANNELS = [{id: 0, name: 'UC84Zkx_92divh3h4sKXeDew'}, {id: 1, name: 'UCK27TX8CB0yFnXPNZRbIK5g'}];

const Page_404 = () => (
    <div>
        <h3>404: Page Not Found</h3>
        <Link to="/">Back to Search</Link>
        <script>
            {window.location = "/"}
        </script>
    </div>
);

export default class App extends Component {
    state = {
        // counters to temporarily get around unique key issue - too many re-renders with uuid / hashing object should use a set
        counter: 0,         // TODO - rename to ingredCtr
        channelCtr: 0,
        ingredients: [],    // TODO - use map instead
        channels: [],       // TODO - ideally I would use a set, since channel IDs are unique already
        results: [],        // cached search results
        isUpdated: false,   // whether results are sync'd up with input
    }

    componentDidMount() {
        this.setState(() => ({
                counter: ls.get('counter') || 0,
                channelCtr: ls.get('channelCtr') || 0,
                ingredients: ls.get('ingredients') || [],
                channels: ls.get('channels') || [],
                results: ls.get('results') || [],
                isUpdated: ls.get('isUpdated') || false,
            }),
            () => {
                // set undefined properties in local storage
                if (!ls.get('counter')) ls.set('counter', 0);
                if (!ls.get('channelCtr')) ls.set('channelCtr', 0);
                if (!ls.get('ingredients')) ls.set('ingredients', []);
                if (!ls.get('channels')) ls.set('channels', []);
                if (!ls.get('results')) ls.set('results', []);
                if (!ls.get('isUpdated')) ls.set('isUpdated', false);

                console.log('App mounted');
            }
        );
    }

    postSearchRequest = () => {
        if (!ls.get('isUpdated')) {
            console.log("Sending post request to backend server...");

            const body = {
                items: this.state.ingredients,
                channels: this.state.channels
            }
            // axios.post(`${BASE_SERVER_URL}/search`, body)
            axios.post(`${BASE_SERVER_URL}/search/dummydata`, body)
                .then(res => {
                    this.setState((prevState) => ({
                            ...prevState,
                            results: res.data
                        }),
                        () => {
                            ls.set('results', this.state.results);
                            ls.set('isUpdated', true);
                            window.location = '/recipes';
                        }
                    );
                });
        } else {
            console.log("Cached data up-to-date. Sending user to Recipes without making post request...");
            window.location = '/recipes';
        }
    }

    addDefaultChannels = (cb) => {
        this.setState(prevState => ({
                ...prevState,
                channels: DEFAULT_CHANNELS
            }),
            () => {
                console.log('Setting default channels...');
                ls.set('channelCtr', DEFAULT_CHANNELS.length);
                ls.set('channels', DEFAULT_CHANNELS);
                cb();
            }
        );
    }

    addIngredient = (name) => {
        this.setState(prevState => ({
                ...prevState,
                counter: prevState.counter + 1,
                ingredients: [...prevState.ingredients, { id: prevState.counter, name }]
            }),
            () => {
                ls.set('counter', this.state.counter)
                ls.set('ingredients', this.state.ingredients);
                ls.set('isUpdated', false);
            }
        );
    }

    deleteIngredient = (id) => {
        this.setState(prevState => ({
                ...prevState,
                ingredients: prevState.ingredients.filter(ingred => ingred.id !== id)
            }),
            () => {
                ls.set('ingredients', this.state.ingredients);
                ls.set('isUpdated', false);
            }
        );
    }

    resetIngredients = () => {
        this.setState(prevState => ({
                ...prevState,
                counter: 0,
                ingredients: [],
                results: []
            }),
            () => {
                ls.set('counter', 0);
                ls.set('ingredients', []);
                ls.set('results', []);
                ls.set('isUpdated', false);
            }
        );
    }

    search = () => {
        if (this.state.ingredients.length === 0 || ls.get('counter') === 0) {
            alert('Nothing to search for.');
            return null;
        }

        if (this.state.channels.length === 0 || ls.get('channelCtr') === 0) {
            console.log('Using default channels');
            this.addDefaultChannels(this.postSearchRequest); // do post request in callback
        } else {
            console.log('Using channels in settings');
            this.postSearchRequest();
        }
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
                        <Navbar activeTab={window.location.pathname}/>
                        <div className="file-bkgd">
                            <Switch>
                                {/* TODO - should the / route wrap all the other routes? */}
                                <Route path="/" exact render={(props) => (
                                    <Search ingredients={this.state.ingredients}
                                            addIngredient={this.addIngredient}
                                            deleteIngredient={this.deleteIngredient}
                                            search={this.search}
                                            resetIngredients={this.resetIngredients}
                                            {...props}
                                    />
                                )}/>
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
