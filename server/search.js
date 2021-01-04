require('dotenv').config();
require('url');

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

const DUMMY_CHANNELS = [
    {
        valid: true,
        channelName: "Binging with Babish",
        channelID: "abc123"
    },
    {
        valid: true,
        channelName: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        channelID: "123abc"
    },
]
router.route('/dummychanneldata').post((req, res) => {
    console.log(req.body.url);
    if (req.body.giveValid) {
        res.json(DUMMY_CHANNELS[0]);
    } else {
        res.json({
            valid: false,
            reason: 'Unknown path in YouTube URL.'
        });
    }
});

router.route('/validate_channel').post((req, res) => {
    const url = req.body.url;

    try {
        const urlObj = new URL(url);
        const settings = { method: "GET" };
        // https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&forUsername=${username}&key=${API_KEY}
        // https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${id}&key=${API_KEY}
        const pathParts = urlObj.pathname.split('/');
        console.log(url);
        console.log(pathParts);
        let queryParam = '';
        // let queryURL = '';
        if (urlObj.hostname === 'www.youtube.com') {
            // PARTY SHIRT because https://www.youtube.com/user/undefined => PARTY SHIRT's channel. Clever marketing...
            if (urlObj.pathname.startsWith('/channel')) {
                queryParam = `&id=${pathParts[2]}`;
            /*
            workaround not working.
            } else if (urlObj.pathname.startsWith('/c')) { //https://stackoverflow.com/questions/37267324/how-to-get-youtube-channel-details-using-youtube-data-api-if-channel-has-custom/37947865#37947865
                // queryParam = `%2Cid&q=${pathParts[2]}&type=channel`;
                console.log(pathParts[2]);
                queryURL = `https://www.googleapis.com/youtube/v3/search?part=id%2Csnippet&q=${pathParts[2]}&type=channel&key=${API_KEY}`;
            */
            } else if (urlObj.pathname.startsWith('/user')) {
                queryParam = `&forUsername=${pathParts[2]}`;
            } else {
                throw new Error('Unknown path in YouTube URL.');
            }
        } else {
            throw new Error('Not a YouTube channel.');
        }
        // if (queryParam && queryParam !== '') {
            // queryURL = (queryURL === '') ? `https://youtube.googleapis.com/youtube/v3/channels?part=snippet${queryParam}&key=${API_KEY}` : queryURL;
            const queryURL = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet${queryParam}&key=${API_KEY}`;
            console.log(queryURL);
            console.log(queryParam);
            fetch(queryURL, settings)
            .then(fetchRes => fetchRes.json())
            .then((json) => {
                // res.json(json);
                if (json.hasOwnProperty('items') && json.pageInfo.totalResults > 0) {
                    res.json(({
                        valid: true,
                        channelName: json.items[0].snippet.title,
                        channelID: json.items[0].id
                    }));
                } else {
                    throw new Error('Cannot identify YouTube channel.');
                }
            });
            // .err((err) => console.log(err));
        // }
    } catch (err) {
        console.log(err.message);
        res.json({
            valid: false,
            reason: err.message
        });
    }
});

router.route('/').post((req, res) => {
    // items: array
    const items = req.body.items;
    const channels = req.body.channels;

    console.log(`in search.js, received items: ${JSON.parse(JSON.stringify(items))}`);

    // an array with elements that look like the below example
    let allVideos = [];

    let channelsProcessed = 0; // https://stackoverflow.com/questions/18983138/callback-after-all-asynchronous-foreach-callbacks-are-completed

    channels.forEach(channel => {
        c = channel.channelID;
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