const router = require('express').Router();

router.route('/').post((req, res) => {
    // const items = req.body.items;
    res.json(req.body.items);
    // console.log("Searching for recipes with " + items);
});

module.exports = router;