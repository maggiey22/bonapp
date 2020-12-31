import React from 'react';
import ls from 'local-storage';

function Settings() {
    return (
        <div>
            <p>You are on the Settings component!</p>
            <p>counter: {ls.get('counter')}</p>
            <p>ingredients: {JSON.stringify(ls.get('ingredients'))}</p>
            <p>results: {JSON.stringify(ls.get('results'))}</p>
        </div>
    );
}

export default Settings;
