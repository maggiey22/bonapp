import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import './App.css';

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

import Navbar from './components/navbar.component';
import IngredientList from './components/search.component';
import Results from './components/results.component';

const Page_404 = props => (
  <div>
    <h3>404 Page Not Found!</h3>
    <Link to="/">Search</Link>
  <script>
    {window.location = "/"}
  </script>
  </div>
);

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

export default App;
