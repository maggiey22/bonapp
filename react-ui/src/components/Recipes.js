import React, { useState } from 'react';
import ls from 'local-storage';

import './Recipes.css';

function Recipes() {
    const [results] = useState(ls.get('results'));
    // const displayText = useRef('Select a video to see ingredients.'); // this is wrong since we do want it to re-render when its state changes
    const [text, setText] = useState(`Click on ? to see ingredients.`);

    return (
        <div className="container">
            <div className="col left-col">
                {results.length} results found.
                {results.map((vid) =>
                    <div className="video" key={vid.id}>
                        <button className="info-btn" onClick={() => setText(`${vid.desc}`)}>?</button>
                        <iframe title="Video title here" width="276" height="156" frameBorder="0" src={`https://www.youtube.com/embed/${vid.id}`} allow="encrypted-media" allowFullScreen></iframe>
                    </div>)
                }
            </div>
                <div className="col right-col">
                <div className="ingredients-note">
                    <p id="ingredients">{text}</p>
                </div>
            </div>
        </div>
    );
}

export default Recipes;
