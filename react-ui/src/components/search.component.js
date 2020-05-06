import React, { Component } from 'react';
import axios from 'axios';

const isDev = process.env.NODE_ENV !== 'production';

/* class Item extends Component {
    constructor(props) {
        super(props);

        this.state = {name: ''};
    }
    // i think i need a child component here

    render() {
        return (
            <input type="text"
                required
                className="form-control"
                value={this.state.name}
                onChange={this.onChangeItem}
                onKeyPress={this.onKeyPressed}
            />
        );
    }

} */

export default class IngredientList extends Component {

    constructor(props) {
        super(props);

        this.onChangeItems = this.onChangeItems.bind(this);
        this.onSubmit = this.onSubmit.bind(this); // got a this.state is undefined without this line
        this.onKeyPressed = this.onKeyPressed.bind(this);

        this.state = {
            items: []
            // items: ''
        }
    }

    onChangeItems(e) {
        // this is really bad because it's splitting anytime the text in the box changes
        let arr = e.target.value.split(',');
        
        // console.log(arr);

        this.setState({
            items: arr
            // items: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();
        
        let arr = this.state.items;
        arr.forEach((item, i) => {arr[i] = item.trim()});
        // trim returns a string lmao :|

        const list = {
            items: arr
        }

        // console.log(list);
        console.log("Searching...");

        // axios.post('http://localhost:5000/search', list)
        
        axios.post(isDev? 'http://localhost:5000/search'
                        : 'http://youtube-recipe-finder.herokuapp.com/search',
                        list)
            .then(res => console.log(res.data))
            .catch(err => console.log(err));

        window.location = '/results';
    }

    onKeyPressed(e) {
        if (e.key === 'Enter') {
            console.log('Key pressed!');
        }
    }

    render() {
        // onKeyPress={this.onKeyPressed}
        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <label>Search items: </label>
                    <input type="text"
                        required
                        className="form-control"
                        value={this.state.items}
                        onChange={this.onChangeItems}
                    />

                    <div id="n-list">

                    </div>

                    <input type="submit" value="Search" />
                </form>
            </div>
        )
    }
}
