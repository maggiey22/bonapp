import React, { Component } from 'react';

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
                <input
                    autoFocus
                    type="text"
                    name="name"
                    placeholder="Add Ingredient"
                    value={this.state.name}
                    onChange={this.onChange}
                />
                <input
                    type="submit"
                    value="Submit"
                />
            </form>
        )
    }
}