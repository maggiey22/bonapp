import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import './Navbar.css';

export default class Navbar extends Component {
    // isActive = (tab) => window.location.pathname === tab;

    //isActive={this.isActive('/')}
    render() {
        // console.log(this.props.activeTab); todo - why does it print twice consec'ly?
        return (
            <nav className="navbar">
                <span><NavLink className="tab" activeClassName="active-tab" exact to="/">Search</NavLink></span>
                <span><NavLink className="tab" activeClassName="active-tab" to="/recipes">Recipes</NavLink></span>
                <span><NavLink className="tab" activeClassName="active-tab" to="/settings">Settings</NavLink></span>
                <span><NavLink className="tab" activeClassName="active-tab" to="/about">About</NavLink></span>
            </nav>
        );
    }
}