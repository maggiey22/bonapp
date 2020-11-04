import React, { useState } from 'react';

import './Recipes.css';
//const [text, setText] = useState('Select a video to see ingredients.');

function Recipes(props) {
    const [text, setText] = useState('Select a video to see ingredients.');
    const id = '_7kPuVRBJtQ';
    
    return (
        // this.props.ids.map((id) => (
            
        // ));
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
*/