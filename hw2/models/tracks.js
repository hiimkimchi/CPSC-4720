const { MongoClient, ObjectId } = require('mongodb')
const fetch = require('node-fetch')

let client;

//pre : my(bryan kim) hw1 implementation must be running on port 3000
//post: return an array of albums(JSON)
async function getAllAlbums () {
    //return all albums as array
    const albumsRoute = 'http://localhost:3000/albums'
    const response = await fetch(albumsRoute, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if(!response.ok) {
        throw new Error()
    }

    const albums = await response.json()
    return albums
}

//
//
async function getAllTracks() {
    const allAlbums = await getAllAlbums()
    let tracks = []

    //for every album check if trackID exists within. If exists, return true
    for (let i = 0; i < allAlbums.length; i++) {
        let albumID = allAlbums[i].albumId
        const tracksURL = `http://localhost:3000/albums/${albumID}/tracks`
        const response = await fetch(tracksURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(!response.ok) {
            throw new Error()
        }
    
        albumTracks = await response.json()
        tracks.push(albumTracks)
    }
    return tracks
}

//pre : getAllAlbums() must work as intended
//post: returns true if track exists, false if not
async function trackExists(trackID) {
    //get all albums
    const albums = await getAllAlbums()
    try {

        //for every album check if trackID exists within. If exists, return true
        for (let i = 0; i < albums.length; i++) {
            let albumID = albums[i].albumId
            const tracksURL = `http://localhost:3000/albums/${albumID}/tracks`
            const response = await fetch(tracksURL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if(!response.ok) {
                throw new Error()
            }
        
            const tracks = await response.json()
            for(let j = 0; j < tracks.length; j++) {
                if (tracks[j].trackId === trackID) {
                    return true
                }
            }
        }
        return false
    } catch (error) {
        throw new Error()
    }
}

//pre : tagID(string) must exist
//post: return score of a tag
async function calculateScore(tagID) {
    const collection = await getTagsCollection()

    const tag = await collection.findOne(
        {_id: new ObjectId(tagID)}
    )

    if (!tag) {
        throw new Error()
    }

    const upvoteCount = tag.upvotes.length
    const downvoteCount = tag.downvotes.length

    return upvoteCount - downvoteCount
}

//pre : mongodb must be connected on device (since it is localhost)
//post: returns collection unfiltered
async function getTagsCollection() {
    if(!client) {
      client = new MongoClient('mongodb://localhost:27017')
      await client.connect()
    }
    return client.db('CPSC4720').collection('Tags')
}

//pre : trackExists() works as intended
//post: ObjectId of tag object is returned in string form
async function addTag(trackID, tagName) {
    //check if track exists
    const exists = trackExists(trackID)
    if(!exists) {
        throw new Error()
    }

    const collection = await getTagsCollection()

    //formulate new tag object and insert into collection
    const newTag = {
        'tag': tagName,
        'upvotes': [],
        'downvotes': [],
        'trackID': trackID,
    }

    const response = await collection.insertOne(newTag)
    return response.insertedId.toString()
}

//pre : tagID(string), userID(string), and isUpvote(bool) is provided
//     note: each tagID is unique, so it will account for tag+track combo being unique
//post: returns 1 if successful, 0 if not
async function vote(tagID, userID, isUpvote) {
    const collection = await getTagsCollection()

    let updateVote
    if (isUpvote) {
        //add userID to upvotes
        updateVote = {
            $addToSet: {upvotes: userID},
            $pull: {downvotes: userID}
        }
    } else {
        //add userID to downvotes
        updateVote = {
            $addToSet: {downvotes: userID},
            $pull: {upvotes: userID}
        }
    }

    const result = await collection.updateOne(
        {_id: new ObjectId(tagID)},
        updateVote
    )

    return result.modifiedCount > 0
}

//pre : calculateScore() works as intended
//      tagName(string) is a non-unique field
//post: returns all tracks for a tag that are positive
async function getTracksPositive(tagName) {
    const allTracks = await getAllTracks()
    const collection = await getTagsCollection()
    let positiveTracks = []

    //get _id from trackId and name of tag
    for (let i = 0; i < allTracks.length; i++) {
        const track = allTracks[i]
        const tag = await collection.findOne(
            {trackId: track.trackId},
            {tag: tagName}
        )

        //if tag exists in track
        if(tag) {
            const score = await calculateScore(tag._id);
    
            //add if positive
            if (score > 0) {
                positiveTracks.push(track);
            }
        }
    }
    return positiveTracks
}

module.exports = {
    addTag,
    vote,
    getTracksPositive
}