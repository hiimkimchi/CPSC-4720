const model = require('../models/tracks')
const { requiresAuth } = require('express-openid-connect');
const express = require('express');
const router = new express.Router();

//All endpoints except get require auth

//Add a tag to a track
router.post('/:trackID', requiresAuth(), async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    //if tag is not found in the req body, status 400
    if (!req.body.tag) {
        return res.status(400).end()
    }

    let updatedTrack
    try {
        updatedTrack = await model.addTag(req.params.trackID, req.body.tag)
    } catch (error) {
        return res.status(404).end()
    }
    res.status(201).send(`${req.baseUrl}/${updatedTrack}`)
})

//Upvote or downvote a tag on a track
//Must specify in JSON field 'isUpvote'
router.patch('/:trackID/tags/:tagID', requiresAuth(), async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    //if no specification of up or down is given, 400
    if (!req.body.isUpvote) {
        return res.status(400).end()
    }

    //vote for up/down
    const votedTrack = await model.vote(req.params.tagID, req.oidc.user.sub, req.body.isUpvote)
    if (!votedTrack) {
        return res.status(404).end()
    }
    res.status(201).send()
})

//Get tracks with postive number of votes
//Must specify in query field 'tag'
//NOTE: this is not the _id, but the name of the tag
router.get('/tags', async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    if (!req.query.tag) {
        return res.status(400).end()
    }

    const tracks = await model.getTracksPositive(req.query.tag)
    res.status(200).send(tracks)
})

module.exports = router;