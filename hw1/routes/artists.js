const artists = require('../models/artists')
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

//pre : generateUniqueId must be defined in above
//post: returns a unique id
const uniqueId = function(artists) {
    const idArr = artists.map(artist => artist.albumId)
    return generateUniqueId(idArr)
}

//desc: add new artist
router.post('/', (req,res) => {
    if(!req.body.name || !req.body.bio || !req.body.links ||
        !(typeof(req.body.name) === String) || !(typeof(req.body.bio) === String) ||
        !(typeof(req.body.links) === Object)) {
        console.log("parameters are invalid")
        return res.status(400).end()
    }
    const artistId = uniqueId(artists)
    const newArtist = {
        artistId: artistId,
        name: req.body.name,
        bio: req.body.bio,
        links: req.body.links
    }
    artists.push(newArtist)
    res.status(201).send(`/artists/${encodeURIComponent(newArtist.name)}`)
})

//desc: list all artists
router.get('/', (req, res) => {
    res.status(201).send(artists)
})

//desc: update artists fields
router.patch('/:artistId', (req,res) => { 
    const matchingArtist = artists.find(function(artist) { 
        return artist.artistId === parseInt(req.params.artistId)
    })
    if(!matchingArtist) {
        console.log("artist not found")
        return res.status(404).end()
    }

    const keys = Object.keys(req.body)
    for (let i = 0; i < keys.length; i++) {
        if (keys[i] in matchingArtist) {
            matchingArtist[keys[i]] = req.body[keys[i]]
        }
    }
    console.log("updated artist successfully")
    res.status(200).send(matchingArtist)
})

module.exports = router;