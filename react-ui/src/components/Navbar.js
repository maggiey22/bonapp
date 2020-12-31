import React from 'react';
import { NavLink } from 'react-router-dom';

import './Navbar.css';

function Navbar(props) {
    // console.log(this.props.activeTab); TODO - why does it print twice consecutively?
    return (
        <nav className="navbar">
            <span><NavLink className="tab" activeClassName="active-tab" exact to="/">Search</NavLink></span>
            <span><NavLink className="tab" activeClassName="active-tab" to="/recipes" onClick={(e) => { e.preventDefault(); props.search();}}>Recipes</NavLink></span>
            <span><NavLink className="tab" activeClassName="active-tab" to="/settings">Settings</NavLink></span>
            <span><NavLink className="tab" activeClassName="active-tab" to="/about">About</NavLink></span>
        </nav>
    );

}

export default Navbar;