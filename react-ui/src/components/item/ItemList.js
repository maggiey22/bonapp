import React from 'react';
import Item from './Item';

function ItemList(props) {
    if (props.className === 'ingredient') {
        return (
            <div>
            {props.items.map((item) => <Item className={props.className}
                                             id={item.id}
                                             key={item.id}
                                             item={item}
                                             deleteItem={props.deleteItem}/>
            )}
            </div>
        );
    } else {
        return (
            <div>
            {Array.from(props.items).map((item) => <Item className={props.className}
                                             id={item}
                                             key={item}
                                             item={item}
                                             deleteItem={props.deleteItem}/>
            )}
            </div>
        );
    }
}

export default ItemList;
