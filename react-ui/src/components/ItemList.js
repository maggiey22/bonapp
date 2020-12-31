import React from 'react';
import Item from './Item';

function ItemList(props) {
    return (
        <div>
        {props.items.map((item) =>
            <Item className={props.className} id={item.id} key={item.id} item={item} deleteItem={props.deleteItem} />
        )}
        </div>
    );
}

export default ItemList;
