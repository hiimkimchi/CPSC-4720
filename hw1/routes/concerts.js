const concerts = require('../models/concerts')
const express = require('express');
const router = new express.Router();

//desc: list all concerts within time frame (format: YYYY-MM-DDTHH:MM)
router.get('/', (req,res) => {
    //requires ?startTime<Date format>&endTime<Date format>
    if(!req.query.start || !req.query.end) {
        return res.status(400).end()
    }

    const queryStart = new Date(req.query.start)
    const queryEnd = new Date(req.query.end)
    const qualifiedConcerts = []

    for(let i = 0; i < concerts.length; i++) {
        let concertStart = new Date(concerts[i].startTime)
        let concertEnd = new Date(concerts[i].startTime)

        const [hours, minutes] = concerts[i].duration.split(':').map(Number)
        concertEnd.setHours(concertEnd.getHours() + hours)
        concertEnd.setMinutes(concertEnd.getMinutes() + minutes)

        if (queryStart <= concertStart && queryEnd >= concertEnd) {
            qualifiedConcerts.push(concerts[i])
        }
    }

    if(qualifiedConcerts.length === 0) {
        return res.status(400).end()
    } else {
        res.status(200).send(qualifiedConcerts)
    }
})

//desc: change start time/date of a concert
router.patch('/:concertId', (req,res) => {
    const matchingConcert = concerts.find(function(concert) {
        return concert.concertId === parseInt(req.params.concertId)
    })
    if(!matchingConcert) {
        return res.status(404).end()
    }

    const keys = Object.keys(req.body)
    if(keys.length > 1 || keys[0] != "startTime") {
        return res.status(401).end()
    }

    matchingConcert[keys[0]] = req.body[keys[0]]

    console.log("updated concert time successfully")
    res.status(200).send(matchingConcert)
})

module.exports = router;