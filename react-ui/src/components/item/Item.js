import React, { Component } from 'react';

import './Item.css';

export default class Item extends Component {

    deleteItem = () => {
        this.props.deleteItem(this.props.id);
    }

    render() {
        const { id, name } = this.props.item;

        return (
            <div id={`ingred-${id}`} className={this.props.className}>
                <button id={`del-ingred-btn-${id}`} className="del-ingred-btn" onClick={this.deleteItem}>X</button>
                {name}
            </div>
        );
    }
}