import React, { Component } from 'react';

import './About.css';

import egg from '../egg.png';

export default class About extends Component {
    render() {
        return (
            <div>
                <p className="title">About</p>
                <div className="container">
                    <div className="col left-col">
                        <img src={egg} alt="egg." id="egg-img"/>
                    </div>
                    <div className="col right-col" id="detailed-instructions">
                        Add ingredients in <a href="/">Search</a>.<br/>
                        Add channels to search in <a href="/settings">Settings</a>.<br/>
                        See search results in <a href="/recipes">Recipes</a>.<br/><br/>
                        <div id="more-info">
                            Made with React, Node.js, and YouTube API v3<br/>
                            Source code on <a href="https://github.com/maggiey22/bonapp">GitHub</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
