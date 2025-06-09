const tracks = require('../models/tracks')
const albums = require('../models/albums')
const express = require('express');
const router = new express.Router();

//pre : requires an array of id's to compare to
//post: returns a unique 8 digit id
const generateUniqueId = function(collection) {
    let id;
    do {
        id = Math.floor(10000000 + Math.random() * 90000000).toString();
    } while (collection.includes(id));
    return id;
}

//pre : generateUniqueId must be defined above
//post: returns a unique id
const uniqueId = function(tracks) {
    const idArr = albums.map(track => track.albumId)
    return generateUniqueId(idArr)
}

//desc: add a new track to a specific album
router.post('/:albumId/tracks', (req,res) => {
    const matchingAlbum = albums.find(function(album) { 
        return album.albumId === parseInt(req.params.albumId)
    })
    if (!matchingAlbum) {
        console.log("album not found")
        return res.status(400).end()
    }
    if(req.params.albumId (!req.body.trackNo || !req.body.title || !req.body.duration || !req.body.artistId)) {
        console.log("parameters are invalid")
        return res.status(400).end()
    }

    let trackId = uniqueId(tracks)
    const newTrack = {
        trackId: trackId,
        albumId: req.params.albumId,
        trackNo: req.body.trackNo,
        title: req.body.title,
        duration: req.body.duration,
        artistId: req.body.artistId
    }
    tracks.push(newTrack);
    console.log("successfully pushed new track to specified album.")
    return res.status(201).send(`/albums/${newTrack.albumId}${newTrack.trackNo}${encodeURIComponent(newTrack.title)}${newTrack.artistId}`)
})

//desc: get details for all tracks in album
router.get('/:albumId/tracks', (req, res) => {
    const matchingAlbum = albums.find(function(album) { 
        return album.albumId === parseInt(req.params.albumId)
    })
    if (!matchingAlbum) {
        console.log("album not found")
        return res.status(404).end();
    }

    const matchingTracks = []
    for (let i = 0; i < tracks.length; i++) {
        if(tracks[i].albumId === matchingAlbum.albumId) {
            matchingTracks.push(tracks[i])
        }
    }
    return res.status(200).send(matchingTracks)
})

//desc: delete a specific track
router.delete('/tracks/:trackId', (req, res) => {
    const trackId = parseInt(req.params.trackId)
    const trackIndex = tracks.findIndex((track) => track.trackId === trackId)

    if (trackIndex === -1) {
        console.log("track not found")
        return res.status(400).end()
    }
    const deletedTrack = tracks.splice(trackIndex, 1)[0]
    res.status(204).send(deletedTrack)
})

module.exports = router;