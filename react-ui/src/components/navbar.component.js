import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// move this back to App.js maybe
export default class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                <Link to="/" className="navbar-brand">YouTube Recipe Finder</Link>
            </nav>
        );
    }
}