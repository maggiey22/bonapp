import React, { Component } from 'react';

import './AddItem.css';

export default class AddItem extends Component {
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
                        id={`${this.props.className}-field`}
                        className="input-field"
                        autoFocus
                        type="text"
                        name="name"
                        placeholder={this.props.placeholder}
                        value={this.state.name}
                        onChange={this.onChange}
                    />
                </span>
            </form>
        );
    }
}