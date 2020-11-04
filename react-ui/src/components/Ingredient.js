import React, { Component } from 'react';
// import axios from 'axios';

import './Ingredient.css';

export default class Ingredient extends Component {
    
    deleteIngredient = () => {
        this.props.deleteIngredient(this.props.id);
    }

    render() {
        // const { id, name } = this.props.ingredient;
        const { name } = this.props.ingredient;
        
        return (
            <div className="item">
                <button className="delete-btn" onClick={this.deleteIngredient}>X</button>
                {name}
            </div>
        )
    }
}