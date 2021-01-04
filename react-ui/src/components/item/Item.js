import React, { Component } from 'react';

import './Item.css';

export default class Item extends Component {

    deleteItem = () => {
        this.props.deleteItem(this.props.id);
    }

    render() {
        const className = this.props.className;
        const { id, name } = this.props.item;

        return (
            <div id={`${className}-${id}`} className={className}>
                <button id={`del-${className}-btn-${id}`} className={`del-btn del-${className}-btn`} onClick={this.deleteItem}>X</button>
                {name}
            </div>
        );
    }
}