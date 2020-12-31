require('dotenv').config();

const router = require('express').Router();
const fetch = require('node-fetch');
const until = require('async/until');

const API_KEY = process.env.TOKEN;

// String -> String
// Stuff channelID into query string for "Uploads" playlist for given channel
function getQueryString(channelID, pageToken) {
    console.log("in gqs...");
    // assume they don't have a special channel ID like apple's
    const playlistID = channelID.substring(0, 1) + 'U' + channelID.substring(2);

    let queryString = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=50&playlistId=${playlistID}&key=${API_KEY}`;
    
    if (pageToken !== '') {
        queryString += `&pageToken=${pageToken}`;
    }

    return queryString;
}

// YouTube content details array -> [{id, desc}, ...] pairs
// Get pairs of video IDs and their description from given items JSON array
function getConciseData(items) {
    console.log("in gcd...");
    let pairs = [];
    items.forEach(i => {
        pairs.push({
            id: i.contentDetails.videoId, 
            desc: i.snippet.description
        });
    });
    return pairs;
}

// Array -> Array
// Neaten up channel data to produce array of video data only
// channelData : [{npt: _, results: [{vid}, {vid}] }, {npt: _, results: [{vid}, {vid}] }]
function collapseAndNeaten(channelData) {
    let videosOnly = [];
    channelData.forEach(pg => {
        videosOnly = videosOnly.concat(pg.results); // I keep forgetting that concat returns a new array :|
    });
    return videosOnly;
}

// Array -> Array
// Filter the array to remove videos that don't have all the items requested
function search(videos, items) {
    let filteredVideos = videos;
    items.forEach(item => {
        filteredVideos = filteredVideos.filter(video => video.desc.toLowerCase().indexOf(item.name.toLowerCase()) != -1);
    });
    return filteredVideos;
}

router.route('/test').get((req, res) => {
    console.log("hello world!");
    res.json({
        name: "Fido",
        age: 3,
        breed: "labrador"
    });
});

// dummy route for testing
router.route('/dummydata').post((req, res) => {
    console.log("testing post");
    res.json([
        {
            id: "_7kPuVRBJtQ",
            desc: "FIRST VID:\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Cras nulla velit, placerat quis urna eget, euismod tempus sem. Integer nec nulla dapibus, gravida mi in, iaculis augue. Integer tristique laoreet laoreet. Donec porta velit nulla, nec tincidunt quam pellentesque ut. Morbi posuere auctor iaculis. Cras tempus eget leo non ultricies. In hac habitasse platea dictumst. Nulla tempor tortor pulvinar elit blandit vehicula ac at nisi. Cras porta quis ligula rutrum consectetur. Duis nec urna est. Aliquam lectus dolor, facilisis sit amet ante at, varius viverra lacus. Ut in maximus ipsum. Fusce pellentesque, dolor quis finibus accumsan, magna arcu suscipit mauris, non consequat neque dui nec nisl. Quisque vitae quam mi. In ut tristique massa. Donec sit amet mollis eros."
        },
        {
            id: "-VIH-BX7PfE",
            desc: "SECOND VID:\nMorbi tempor aliquet tellus, at ultricies ex ultricies sit amet. Quisque aliquam mollis lectus ut posuere. Suspendisse eu ornare urna. Sed tempor libero sit amet odio convallis, at dignissim lacus ullamcorper. Praesent eros turpis, ornare vitae feugiat in, porta non tellus. Pellentesque tristique, ex eu accumsan pharetra, arcu arcu viverra libero, ut posuere elit massa eget ex. Integer gravida interdum augue, ut tempor enim suscipit a. Quisque convallis ante quis pretium aliquam. Quisque scelerisque viverra iaculis. Ut quis facilisis arcu."
        }
    ]);
});

router.route('/').post((req, res) => {
    // items: array
    const items = req.body.items;
    const channels = req.body.channels;

    console.log(`in search.js, received items: ${JSON.parse(JSON.stringify(items))}`);

    // an array with elements that look like the below example
    let allVideos = [];

    let channelsProcessed = 0; // https://stackoverflow.com/questions/18983138/callback-after-all-asynchronous-foreach-callbacks-are-completed

    channels.forEach(c => {

        let url = getQueryString(c, '');
        const settings = { method: "GET" };

        // array of page results
        let answers = [];

        let finished = false;
        let counter = 0;
        until (
            function test(cb) {
                cb(null, finished);
            },
            function iter(next) {
                console.log("on page" + counter);
                counter++;
                fetch(url, settings)
                    .then(fetchRes => fetchRes.json())
                    .then((json) => {
                        console.log("processing json response...line 109");
                        const answer = {
                            nextPageToken:
                                json.hasOwnProperty('nextPageToken')? json.nextPageToken : '',
                            results: 
                                json.hasOwnProperty('items') ? getConciseData(json.items) : []
                        }
                        console.log("processing json response...line 115");

                        // answers.push(answer);
                        answers = answers.concat(answer);

                        if (answer.nextPageToken === '') {
                            console.log("processing json response...line 120");
                            finished = true;
                            // next(null); // adding this fixed some things
                            // res.json(answers);
                            // allVideos.push(answers);
                            // res.json(allVideos);
                            // callback(null, answer);
                        } else {
                            console.log("processing json response...line 126");
                            url = getQueryString(c, answer.nextPageToken);
                            console.log("processing json response...line 135");
                        }
                        next(); // <- fixed things!
                    });
            },
            function done(err) {
                if (err) {
                    console.log("Error :(");
                    res.status(500).json(err);
                } else {
                    // allVideos.push(answers);
                    console.log("Success!");
                    // res.json(answers); // res.status(200).json(answers);
                    answers = collapseAndNeaten(answers);
                    // res.json(search(answers, items));
                    allVideos = allVideos.concat(search(answers, items));

                    if (++channelsProcessed === channels.length) {
                        res.json(allVideos);
                        console.log(allVideos);
                    }
                }
            }
        );
    });
});

module.exports = router;