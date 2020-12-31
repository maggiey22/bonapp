import React from 'react';
import { NavLink } from 'react-router-dom';

import './Navbar.css';

function Navbar() {
    // console.log(this.props.activeTab); TODO - why does it print twice consecutively?

    // removed onClick={(e) => { e.preventDefault(); props.search();}} from Recipes NavLink to reduce API requests (otherwise it searches again on click) 
    return (
        <nav className="navbar">
            <span><NavLink className="tab" activeClassName="active-tab" exact to="/">Search</NavLink></span>
            <span><NavLink className="tab" activeClassName="active-tab" to="/recipes">Recipes</NavLink></span>
            <span><NavLink className="tab" activeClassName="active-tab" to="/settings">Settings</NavLink></span>
            <span><NavLink className="tab" activeClassName="active-tab" to="/about">About</NavLink></span>
        </nav>
    );
}

export default Navbar;