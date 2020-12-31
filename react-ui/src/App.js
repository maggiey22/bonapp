import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import './App.css';
import eggy from './eggy.png';

import Navbar from './components/Navbar';
import Search from './components/Search';
import Recipes from './components/Recipes';
import Settings from './components/Settings';
import About from './components/About';

const Page_404 = () => (
    <div>
        <h3>404: Page Not Found</h3>
        <Link to="/">Back to Search</Link>
        <script>
            {window.location = "/"}
        </script>
    </div>
);

function App() {
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
                            <Route path="/" exact component={Search} />
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

export default App;
