import React, { Component } from 'react';

import './AddIngredient.css';

export default class AddIngredient extends Component {
    state = { name: '' };

    onChange = (e) => {
        this.setState({ name: e.target.value });
    }

    onSubmit = (e) => {
        e.preventDefault();
        
        if (this.state.name === '') {
            return null;
        }

        this.props.add(this.state.name);
        this.setState({name: ''});
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <span>
                    <input
                        className="text-field"
                        autoFocus
                        type="text"
                        name="name"
                        placeholder="Add an item..."
                        value={this.state.name}
                        onChange={this.onChange}
                    />
                    {/* TODO: css for extra buttons
                        <input
                        className="add-btn"
                        type="submit"
                        value="+"
                    /> */}
                </span>
            </form>
        )
    }
}