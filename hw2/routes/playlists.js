const model = require('../models/playlists')
const { requiresAuth } = require('express-openid-connect');
const express = require('express');
const router = new express.Router();

//All endpoints except for getting all public playlists requires auth

//Create new playlist (user does not have to provide songs to create a playlist)
router.post('/', requiresAuth(), async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    //all playlists must have name and public/private indication
    if (!(req.body.name && req.body.isPublic)) {
        return res.status(400).end()
    }

    //no tracks provided, make empty list
    if (!req.body.trackIDs) {
        req.body.trackIDs = []
    }

    const newPlaylist = {
        'name': req.body.name,
        'isPublic': req.body.isPublic,
        'trackIDs': req.body.trackIDs,
        'creatorID': req.oidc.user.sub
    }

    const id = await model.addPlaylist(newPlaylist)
    res.status(201).send(`${req.baseUrl}/${id}`)
})

//Add track to playlist
//Must specify in body as JSON field 'trackID'
//May only add track to playlist user owns
router.patch('/:playlistID/tracks', requiresAuth(), async (req,res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    //trackID is not provided
    if (!req.body.trackID) {
        return res.status(400).end()
    }

    //trackID will be added to trackIDs array barring throwing errors
    try {
        const updatedMatchingPlaylist = await model.addTracktoPlaylist(req.params.playlistID, req.body.trackID, req.oidc.user.sub);
        if (updatedMatchingPlaylist < 1) {
            return res.status(404).end()
        }
    } catch(error) {
        return res.status(404).end()
    }
    res.status(201).send(`${req.baseUrl}/${req.params.playlistID}/tracks`)
})

//Delete track from playlist
//May only delete track from playlist user owns
router.delete('/:playlistID/tracks/:trackID', requiresAuth(), async (req,res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    const targetPlaylist = await model.getPlaylist(req.params.playlistID)

    //if playlist doesn't exist end
    if (!targetPlaylist) {
        return res.status(404).end()
    }

    //if trackID doesn't exist end
    try {
        const targetTrack = await model.removeTrack(req.params.playlistID, req.params.trackID, req.oidc.user.sub)
        if (targetTrack < 1) {
            return res.status(404).end()
        }
    } catch (error) {
        return res.status(404).end()
    }

    res.status(204).send(`${req.baseUrl}/${req.params.playlistID}/tracks`)
})

//Make playlist public/private
router.patch('/:playlistID', requiresAuth(), async (req, res) => {
    try {
        const updatedPlaylist = await model.changeVisibility(req.params.playlistID)
        if (updatedPlaylist < 1) {
            return res.status(404).end()
        }
    } catch (error) {
        return res.status(404).end()
    }
    res.status(201).send(`${req.baseUrl}`)
})

//Get all public playlists
router.get('/', async (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    let publicPlaylists
    
    try {
        publicPlaylists = await model.getPublicPlaylists()
        res.status(200).send(publicPlaylists)
    } catch (error) {
        return res.status(500).end()
    }
})

//Get all playlists created by you
router.get('/myPlaylists', requiresAuth(), async (req, res) => {
    //current auth0 userID
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    console.log(userID)
    let userPlaylists

    try {
        userPlaylists = await model.getUserPlaylists(userID)
        res.status(200).send(userPlaylists)
    } catch (error) {
        return res.status(500).end()
    }
})

module.exports = router;