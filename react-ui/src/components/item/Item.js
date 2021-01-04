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
            <div id={`${className}-${id}`} className={`item ${className}-item`}>
                <button id={`del-${className}-btn-${id}`} className={`del-btn del-${className}-btn`} onClick={this.deleteItem}>X</button>
                {(className === 'channel') ? <a href={this.props.item.url}>{name}</a> : name}
            </div>
        );
    }
}