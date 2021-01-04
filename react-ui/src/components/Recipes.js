import React, { useState } from 'react';
import ls from 'local-storage';

import './Recipes.css';

function Recipes() {
    const [results] = useState(ls.get('results'));
    // const displayText = useRef('Select a video to see ingredients.'); // this is wrong since we do want it to re-render when its state changes
    const [text, setText] = (results.length !== 0) ? useState(`Click on ? to see ingredients.`) : useState(`Hmmm, it looks like we couldn't find any recipes! 😢`);

    return (
        <div className="container">
            <div className="col left-col">
                {results.length} results found.
                {results.map((vid) =>
                // TODO - duplicate keys still possible
                    <div className="video" key={vid.id}>
                        <button className="blue-btn" id="info-btn" onClick={() => setText(`${vid.desc}`)}>?</button>
                        <iframe title="Video title here" width="276" height="156" frameBorder="0" src={`https://www.youtube.com/embed/${vid.id}`} allow="encrypted-media" allowFullScreen></iframe>
                    </div>)
                }
            </div>
                <div className="col right-col">
                <div className="note" id="ingredients-note">
                    <p id="ingredients">{text}</p>
                </div>
            </div>
        </div>
    );
}

export default Recipes;
