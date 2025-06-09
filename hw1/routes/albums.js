const albums = require('../models/albums')
const tracks = require('../models/tracks')
const tracksLogic = require('./tracks')
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
const uniqueId = function(albums) {
    const idArr = albums.map(album => album.albumId)
    return parseInt(generateUniqueId(idArr))
}

//desc: add new album
router.post('/', (req, res) => {
    if(!req.body.name || !req.body.releaseYear || !req.body.genre || 
        !(typeof(req.body.name) === String) || !(typeof(req.body.releaseYear) === Number) ||
        !(typeof(req.body.genre) === String)) {
        console.log("parameters are invalid")
        return res.status(400).end();
    }

    let albumId = uniqueId(albums)
    const newAlbum = {
        albumId: albumId,
        name: req.body.name,
        releaseYear: req.body.releaseYear,
        genre: req.body.genre
    }
    albums.push(newAlbum)
    console.log(newAlbum)
    res.status(201).send(newAlbum) //`/albums/${encodeURIComponent(newAlbum.name)}${newAlbum.releaseYear}${encodeURIComponent(newAlbum.genre)}`
})

//desc: lists all albums
router.get('/', (req, res) => {
    res.status(200).send(albums)
})

//desc: get details of an album
router.get('/:albumId', (req, res) => {
    const matchingAlbum = albums.find(function(album) { 
        return album.albumId === parseInt(req.params.albumId)
    })
    if (!matchingAlbum) {
        console.log("album not found")
        return res.status(404).end()
    }
    console.log("album found")
    res.status(200).send(matchingAlbum)
})

//desc: delete specific album and all tracks within it
router.delete ('/:albumId', (req,res) => {
    const albumId = parseInt(req.params.albumId)
    const albumIndex = albums.findIndex((album) => album.albumId === albumId)

    if(albumIndex === -1) {
        console.log("album not found")
        return res.status(400).end()
    }

    const deletedAlbum = albums.splice(albumIndex, 1)[0]

    const deletedTracks = []
    for(let i = 0; i < tracks.length; i++) {
        if(tracks[i].albumId === albumId) {
            let deletedAlbum = tracks.splice(i, 1)[0]
            deletedTracks.push(deletedAlbum);
        }
    }
    console.log("album and associated tracks deleted")
    res.status(204).send({deletedAlbum: deletedAlbum, deletedTracks: deletedTracks})
})

router.use('/', tracksLogic)


module.exports = router;