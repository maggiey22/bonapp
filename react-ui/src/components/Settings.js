import React from 'react';

import './Settings.css';

import AddItem from './item/AddItem';
import ItemList from './item/ItemList';

function Settings(props) {
    return (
        <div id="settings-container">
            <p id="title">Channels to Search</p>
            <div>
                <AddItem add={props.addChannel} placeholder="Add a YouTube channel URL..." className="channel"/>
                <button className="blue-btn" id="clear-settings-btn" onClick={props.resetChannels}>Clear list</button>
            </div>
            <div id="channel-list-container">
                <ItemList className="channel" items={props.channels} deleteItem={props.deleteChannel}/> 
            </div>
        </div>
    );
}

export default Settings;
