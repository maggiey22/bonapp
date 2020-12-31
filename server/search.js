require('dotenv').config();

const router = require('express').Router();
const fetch = require('node-fetch');
const until = require('async/until');

// https://dev.to/isalevine/three-ways-to-retrieve-json-from-the-web-using-node-js-3c88
// use second answer's procedure 
// https://stackoverflow.com/questions/18953499/youtube-api-to-fetch-all-videos-on-a-channel/27872244#27872244
const API_KEY = process.env.TOKEN;

const SAMPLE_CHANNEL_IDS = [
    'UC84Zkx_92divh3h4sKXeDew', //seodam (125)
    // 'UCKetFmtqdh-kn915crdf72A' //Nino's Home (~25)
];

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
        // filteredVideos = filteredVideos.filter(video => video.desc.indexOf(item) != -1);
        filteredVideos = filteredVideos.filter(video => video.desc.indexOf(item.name) != -1);
    });
    return filteredVideos;
}

// TEST USING
// https://developers.google.com/calendar/v3/pagination
// https://www.youtube.com/watch?v=OomY1d4AWzs&list=UU84Zkx_92divh3h4sKXeDew seodam (125 videos) = 3 tries (max 50 results e/ time)

// using page token - https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=50&playlistId=UU84Zkx_92divh3h4sKXeDew&key={APIKEY}&pageToken=CGQQAA


/* all video id's for channels
  => get full descriptions
     => filter id, description pairs that don't contain all keywords

CHANNEL IDs
https://www.youtube.com/channel/UCpprBWvibvmOlI8yJOEAAjA
                                 ^ channel ID
                                UUpprBWvibvmOlI8yJOEAAjA == all uploads playlist id
OR
https://www.youtube.com/user/cookingwithdog
                             ^ username
https://www.googleapis.com/youtube/v3/channels?key={API_KEY}&forUsername=cookingwithdog&part=id

Binging with babish
      https://www.youtube.com/channel/UCJHA_jMfCvEnv-3kRjTCQXw
https://www.youtube.com/playlist?list=UUJHA_jMfCvEnv-3kRjTCQXw

Doo Piano
      https://www.youtube.com/channel/UCNoN7dpdAlglcQWUn2pFjDA
https://www.youtube.com/playlist?list=UUNoN7dpdAlglcQWUn2pFjDA
*/

router.route('/test').get((req, res) => {
    console.log("hello world!");
    res.json({
        name: "Fido",
        age: 3,
        breed: "labrador"
    });
})

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
})

router.route('/').post((req, res) => {
    // items: array
    const items = req.body.items;
    
    console.log(`in search.js, received items: ${JSON.parse(JSON.stringify(items))}`);
    
    // faux res.json(req.body.channels);
    const channels = req.body.channels;
    // const channels = SAMPLE_CHANNEL_IDS;
    
    // an array with elements that look like the below example
    let allVideos = [];

    let channelsProcessed = 0; // https://stackoverflow.com/questions/18983138/callback-after-all-asynchronous-foreach-callbacks-are-completed

    channels.forEach(c => {
    
        // c = SAMPLE_CHANNEL_IDS[0];

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
                    // .then(fetchRes => {
                    //     let json = fetchRes.json();
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
                        next(); // YES IT FIXED EVERYTHING
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
    })
    
});

module.exports = router;