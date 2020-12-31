import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import ls from 'local-storage';
import axios from 'axios';

import './App.css';
import eggy from './eggy.png';

/*
Cooking Tree https://www.youtube.com/channel/UCtby6rJtBGgUm-2oD_E7bzw
HidaMari https://www.youtube.com/channel/UCcp9uRaBwInxl_SZqGRksDA

小麦粉だいすき https://www.youtube.com/user/taira1588/videos

seonkyoung longest
https://www.youtube.com/watch?v=ITp-8U5hCbQ

joc https://www.youtube.com/channel/UCvBtKQaoDhsHkrvtLjSAhyw
emma's goodies https://www.youtube.com/channel/UCgmOd6sRQRK7QoSazOfaIjQ
joshua weissman https://www.youtube.com/channel/UChBEbMKI1eCcejTtmI32UEw
sweet the mi https://www.youtube.com/channel/UCW3Zwj1ntR4I8OxEJvTM5XA
honeykki https://www.youtube.com/channel/UCvQPUPoMK0Smj-OHeUe9SEw
cooking with dog https://www.youtube.com/channel/UCpprBWvibvmOlI8yJOEAAjA

adam rag https://www.youtube.com/channel/UC9_p50tH3WmMslWRWKnM7dQ

*/

import Navbar from './components/Navbar';
import AddIngredient from './components/AddIngredient';
import IngredientList from './components/IngredientList';
import Recipes from './components/Recipes';
import Settings from './components/Settings';
import About from './components/About';

const BASE_SERVER_URL = 'http://localhost:5000'

const Page_404 = props => (
  <div>
    <h3>404: Page Not Found</h3>
    <Link to="/">Back to Search</Link>
  <script>
    {window.location = "/"}
  </script>
  </div>
);

// TODO - switch to a functional component
class App extends Component {
  state = {
    // TODO - switch to uuid since the following flow is buggy:
    /*
    add 3 ingredients
    delete the middle one => counter becomes 2
    add ingredient => 2 items have the same key
    */
    counter: 0,
    ingredients: [],
    channels: [],
    results: [],
  }

  addIngredient = (name) => {
    const newIngredient = {
      id: this.state.counter,
      name
    }
    const nextIngredients = [...this.state.ingredients, newIngredient];

    // TODO - use prevState instead of this.state since prevState is more accurate
    this.setState({
      counter: this.state.counter + 1,
      ingredients: nextIngredients
    });

    ls.set('counter', this.state.counter + 1);
    ls.set('ingredients', nextIngredients);
  }

  deleteIngredient = (id) => {
    const nextState = {
      ...this.state,
      ingredients: this.state.ingredients.filter(ingred => ingred.id !== id)
    };
    this.setState(nextState);
    ls.set('counter', nextState.counter);
    ls.set('ingredients', nextState.ingredients);
    /*
    this.setState(prevState => ({
      ...prevState,
      ingredients: prevState.ingredients.filter(ingred => ingred.id !== id)
    }));
    */
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
      alert("Nothing to search for.");
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
        console.log(res.data)
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
                          <AddIngredient add={this.addIngredient}/>
                          <div className="list">
                            <IngredientList ingredients={this.state.ingredients} deleteIngredient={this.deleteIngredient}/> 
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
    )
  }
}

export default App;


/*

state = {
    counter: 2,
    ingredients: [
      {
        id: 0,
        name: 'Egg'
      },
      {
        id: 1,
        name: 'Milk'
      }
    ]
  }

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <br/>
        <Switch>
          <Route path="/" exact component={IngredientList} />
          <Route path="/results" exact component={Results} />
          <Route component={Page_404}></Route>
        </Switch>
      </div>
    </Router>
  );
}
*/