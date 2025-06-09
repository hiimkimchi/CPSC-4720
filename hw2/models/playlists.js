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

//pre : mongodb must be connected on device (since it is localhost)
//post: returns collection unfiltered
async function getPlaylistsCollection() {
    if(!client) {
      client = new MongoClient('mongodb://localhost:27017')
      await client.connect()
    }
    return client.db('CPSC4720').collection('Playlists')
}

//pre : playlistID(string) is provided
//post: returns playlist(JSON) associated with playlistID
async function getPlaylist(playlistID) {
    const collection = await getPlaylistsCollection()
    const playlist = await collection.findOne({ _id: new ObjectId(playlistID) });
    if (!playlist) {
        throw new Error()
    }
    return playlist
}

//pre : none
//post: returns an array of playlists(JSON) that are public
async function getPublicPlaylists() {
    const query = {}
    query['isPublic'] = true
    const collection = await getPlaylistsCollection()
    return await collection.find(query).toArray()
}

//pre : userID(string) is provided
//post: returns an array of playlists(JSON) which userID owns
async function getUserPlaylists(userID) {
    const query = {}
    query['creatorID'] = userID;
    const collection = await getPlaylistsCollection()
    return await collection.find(query).toArray()
}

//pre : playlist is defined in JSON 
//    {'name': string, 'isPublic': boolean, 'trackIDs': array of ObjectIds, 'creatorID': string}
//post: ObjectId of playlist is returned in string form
async function addPlaylist(playlist) {
    const collection = await getPlaylistsCollection()
    const response = await collection.insertOne(playlist)
    return response.insertedId.toString()
}

//pre : playlistID(string) and trackID(string) is provided
//      trackID is assumed to already exist in the tracks model, therefore only id will be added
//post: a trackID is added to the selected playlist
async function addTracktoPlaylist(playlistID, trackID) {
    const collection = await getPlaylistsCollection()

    //check if trackExists in hw1
    const exists = await trackExists(trackID)
    if(!exists) {
        throw new Error()
    }

    //add trackID into trackIDs
    const response = await collection.findOneAndUpdate(
        {_id: new ObjectId(playlistID)},
        {$addToSet: {trackIDs: trackID}}
    )

    //check if playlistID exists
    if(!response.value) {
        throw new Error()
    }

    return response.modifiedCount > 0
}

//pre : trackExists() must work as intended
//post: return 0 if removal unsuccessful, 1 if successful
async function removeTrack(playlistID, trackID, userID) {
    //check if trackExists
    const exists = await trackExists(trackID)
    if (!exists) {
        throw new Error()
    }

    //find and use the playlist
    const collection = await getPlaylistsCollection()
    const userPlaylists = await getUserPlaylists(userID)
    const playlist = userPlaylists.find(p => p._id.toString() === playlistID)
    if(!playlist) {
        throw new Error()
    }

    //remove from playlist
    const removedTrack = await collection.updateOne (
        {_id: new ObjectId(playlistID)},
        {$pull: {trackIDs: trackID}}
    );

    return removedTrack.modifiedCount > 0
}

//pre : playlistID(string) and userID(string) are provided
//post: isPublic will change to !isPublic
async function changeVisibility(playlistID, userID) {
    const collection = await getPlaylistsCollection()
    const userPlaylists = await getUserPlaylists(userID)

    const playlist = userPlaylists.find(p => p._id.toString() === playlistID)
    if(!playlist) {
        throw new Error()
    }

    const newVisibility = !playlist.isPublic

    const updatedPlaylist = await collection.updateOne(
        {_id: new ObjectId(playlistID)},
        {$set: {isPublic: newVisibility}}
    );

    return updatedPlaylist.modifiedCount > 0
}

module.exports = {
    getPlaylist,
    getPublicPlaylists,
    getUserPlaylists,
    addPlaylist,
    changeVisibility,
    removeTrack,
    addTracktoPlaylist
}