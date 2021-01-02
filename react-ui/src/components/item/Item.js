import React, { Component } from 'react';

import './Item.css';

export default class Item extends Component {

    deleteItem = () => {
        this.props.deleteItem(this.props.id);
    }

    render() {
        const { className, item } = this.props;

        if (className === 'ingredient') {
            const { id, name } = item;

            return (
                <div id={`ingred-${id}`} className={className}>
                    <button id={`del-ingred-btn-${id}`} className={`del-ingred-btn`} onClick={this.deleteItem}>X</button>
                    {name}
                </div>
            );
        } else {
            return (
                <div id={`chan-${item}`} className={className}>
                    <button id={`del-chan-btn-${item}`} className={`del-chan-btn`} onClick={this.deleteItem}>X</button>
                    {item}
                </div>
            );
        }

    }
}