const router = require('express').Router();
const { Campground } = require('../../models');
const fetch = require('node-fetch');

const withAuth = require('../../utils/auth');

require('dotenv').config();

// retrieve all campgrounds from national park api
router.get('/', (req, res) => {
        fetch('https://developer.nps.gov/api/v1/campgrounds?&api_key=' + process.env.DB_APIKEY, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }).then(res => {
            return res.json();
        }).then(data => res.json(data))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// retrieve by statecode
router.get('/:stateCode', (req, res) => {
    const stateCode = req.params.stateCode;
    fetch('https://developer.nps.gov/api/v1/campgrounds?stateCode=' + stateCode + '&api_key=' + process.env.DB_APIKEY, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    }).then(res => {
        return res.json();
    }).then(data => {
        if (data.total === '0') {
            res.status(404).json({ message: 'No national park campgrounds in state!' });
            return;
        }
        res.json(data.data);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// create reviews
router.post('/', withAuth, (req, res) => {
    Campground.create({
        campground_name: req.body.campground_name,
        location: req.body.location,
        user_id: req.session.user_id
    })
    .then(data => res.json(data))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


module.exports = router;