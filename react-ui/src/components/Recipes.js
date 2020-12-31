import React, { useState, useRef } from 'react';
import ls from 'local-storage';

import './Recipes.css';

const ids = ['_7kPuVRBJtQ', '-VIH-BX7PfE', '2CMM2-E9xSA'];

function Recipes(props) {
    const [results, setResults] = useState(ls.get('results'))
    // const displayText = useRef('Select a video to see ingredients.'); // this is wrong since we do want it to re-render when its state changes
    const [text, setText] = useState('Select a video to see ingredients.');

    return (
        <div className="container">
            <div className="col left-col">
                {results.length} results found.
                {results.map((vid) =>
                    <div className="video" key={vid.id}>
                        <button className="button" onClick={() => setText(`${vid.desc}`)}>?</button>
                        <iframe title="Video title here" width="276" height="156" frameBorder="0" src={`https://www.youtube.com/embed/${vid.id}`} allow="encrypted-media" allowFullScreen></iframe>
                    </div>)}
            </div>
                <div className="col right-col">
                <div className="ingredients-note">
                    <p id="ingredients">{text}</p>
                </div>
            </div>
        </div>
    )
}

export default Recipes;
/*
export default class Recipes extends Component {
    // props = list of videos to render

    render() {
        const id = '_7kPuVRBJtQ';
        return (
            // this.props.ids.map((id) => (
                
            // ));
            <div className="container">
                    5 results found.
                <div className="video">
                    <button className="button">hi</button>
                    <iframe title="Video title here" width="276" height="156" frameBorder="0" src={`https://www.youtube.com/embed/${id}`} allow="encrypted-media" allowFullScreen></iframe>
                </div>
                <div className="ingredients-note">
                    <p id="ingredients">asfjalsdf</p>
                </div>
            </div>
        )
    }
}



<div className="container">
            <div className="col left-col">
                5 results found.
                <div className="video">
                    <button className="button" onClick={() => setText('new text here')}>hi</button>
                    <iframe title="Video title here" width="276" height="156" frameBorder="0" src={`https://www.youtube.com/embed/${id}`} allow="encrypted-media" allowFullScreen></iframe>
                </div>
                <div className="video">
                    <button className="button" onClick = {(newText) => setText('new text here')}>hi</button>
                    <iframe title="Video title here" width="276" height="156" frameBorder="0" src={`https://www.youtube.com/embed/${id}`} allow="encrypted-media" allowFullScreen></iframe>
                </div>
                <div className="video">
                    <button className="button" onClick = {(newText) => setText('new text here')}>hi</button>
                    <iframe title="Video title here" width="276" height="156" frameBorder="0" src={`https://www.youtube.com/embed/${id}`} allow="encrypted-media" allowFullScreen></iframe>
                </div>
            </div>
            <div className="col right-col">
                <div className="ingredients-note">
                    <p id="ingredients">{text}</p>
                </div>
            </div>
        </div>
*/