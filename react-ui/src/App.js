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
// const DEFAULT_CHANNELS = ['UC84Zkx_92divh3h4sKXeDew', 'UCK27TX8CB0yFnXPNZRbIK5g'];
const DEFAULT_CHANNELS = new Set(['UC84Zkx_92divh3h4sKXeDew', 'UCK27TX8CB0yFnXPNZRbIK5g']);

const Page_404 = () => (
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
                    const nextState = {
                        results: res.data,
                    }
                    this.setState(nextState);
                    ls.set('results', nextState.results);
                    ls.set('isUpdated', true);
                    window.location = '/recipes';
                });
        } else {
            console.log("Cached data up-to-date. Sending user to Recipes without making post request...");
            window.location = '/recipes';
        }
    }

    addDefaultChannels = (cb) => {
        ls.set('channels', DEFAULT_CHANNELS);
        this.setState(prevState => ({
                ...prevState,
                channels: DEFAULT_CHANNELS
            }),
            cb
        );
    }

    addIngredient = (name) => {
        const currCount = this.state.counter;
        const newIngredient = {
            id: currCount, // TODO - use object hash (after switch to map over array for holding ingredients)
            name
        }
        const nextIngredients = [...this.state.ingredients, newIngredient];

        this.setState({
            counter: currCount + 1,
            ingredients: nextIngredients
        });

        ls.set('counter', currCount + 1);
        ls.set('ingredients', nextIngredients);
        ls.set('isUpdated', false);
    }

    addChannel = (channel) => {
        // console.log("!!!!!!!!!!!!")
        // console.log(typeof(this.state.channels));
        // console.log(this.state.ingredients instanceof Array);
        // console.log(this.state.channels instanceof Set);
        this.setState(prevState => ({
                ...prevState,
                channels: new Set(prevState.channels).add(channel)
            }),
            () => {
                console.log('Added a channel!')
                ls.set('channels', this.state.channels);
                ls.set('isUpdated', false);
            }
        );
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
                ls.set('isUpdated', false);
            }
        );
    }

    deleteChannel = (channel) => {
        this.setState(prevState => ({
                ...prevState,
                channels: new Set(Array.from(prevState.channels).filter(c => c !== channel))
            }),
            () => {
                console.log(`Deleted channel ${channel}`);
                ls.set('channels', this.state.channels);
                ls.set('isUpdated', false);
            }
        );
    }

    resetIngredients = () => {
        const nextState = {
            counter: 0,
            ingredients: [],
            results: [],
        }
        this.setState(nextState);
        ls.set('counter', nextState.counter);
        ls.set('ingredients', nextState.ingredients);
        ls.set('results', nextState.results);
        ls.set('isUpdated', false);
    }

    resetChannels = () => {
        const nextState = {
            channels: new Set(),
            results: [],
        }
        this.setState(nextState, () => {
            console.log('Channel settings reset.');
            ls.set('channels', nextState.channels);
            ls.set('results', nextState.results);
            ls.set('isUpdated', false);
        });
    }

    search = () => {
        if (this.state.ingredients.length === 0 || ls.get('ingredients').length === 0) {
            alert('Nothing to search for.');
            return null;
        }
        console.log(this.state.channels.size);
        console.log(ls.get('channels').size);
        if (this.state.channels.size === 0 || ls.get('channels').size === 0) {
            console.log('Using default channels');
            this.addDefaultChannels(this.postSearchRequest); // do post request in callback
        } else {
            console.log('Using custom channels');
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
                                            reset={this.resetIngredients}
                                            {...props}
                                    />
                                )}/>
                                <Route path="/recipes" exact component={Recipes} />
                                <Route path="/settings" exact render={(props) => (
                                    <Settings
                                        channels={this.state.channels}
                                        addChannel={this.addChannel}
                                        deleteChannel={this.deleteChannel}
                                        reset={this.resetChannels}
                                        {...props}
                                    />
                                )}/>
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
