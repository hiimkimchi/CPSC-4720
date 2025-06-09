import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react'
import TrackList from './TrackList'
import Track from './Track'

const EditPlaylist = () => {
    const location = useLocation();
    const playlist = location.state?.data;


    const [trackData, setTrackData] = useState (playlist?.tracks);
    const [isPublic, setIsPublic] = useState(playlist?.isPublic);

    const handleCheckChange = () => {
        setIsPublic((prev:boolean) => !prev);
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(`/api/playlists/${playlist?._id}/isPublic`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isPublic })
            });
    
            if (!response.ok) {
                throw new Error('Failed to update playlist visibility');
            }
    
            window.location.href = "http://localhost:5173";
        } catch (error) {
            console.error('Error updating playlist visibility:', error);
        }
        //PUT /api/playlists/${playlist?.id}/isPublic
    };


    const moveTrack = async (trackId: string, fromIndex: number, toIndex: number) => {
        try {
            const updatedTrackData = [...trackData];
            const movedTrack = updatedTrackData.splice(fromIndex, 1)[0];
            updatedTrackData.splice(toIndex, 0, movedTrack); 
            setTrackData(updatedTrackData); 

            const response = await fetch(`/api/playlists/${playlist?._id}/tracks`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ trackId: trackId, position: toIndex }),
            });

            if (!response.ok) {
                console.error("Error moving track:", await response.text());
            }
        } catch (error) {
            console.error("Error moving track:", error);
        }
    };

    const removeTrack = async (trackId: string, index: number) => {
        try {
            const updatedTrackData = [...trackData];
            updatedTrackData.splice(index, 1); 
            setTrackData(updatedTrackData); 

            // Send request to backend to remove the track
            const response = await fetch(`/api/playlists/${playlist?._id}/tracks/${trackId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                console.error("Error removing track:", await response.text());
            }
        } catch (error) {
            console.error("Error removing track:", error);
        }
    };


    //TODO: -figure out logic to send to Track.tsx
    return (
        <>
        <form onSubmit={handleSubmit}>
            <h1>Edit playlist: {playlist?.name} </h1>
            <h2>Visibility</h2>
            <div>
                <label htmlFor="true">Public</label>
                <input
                    type="checkbox"
                    id="true"
                    value="true"
                    checked={isPublic}
                    onChange={() => handleCheckChange()}
                />
            </div>
            <h2>Tracks</h2>
            <table>
                <thead>
                    <tr>
                        <th>Track Name</th>
                        <th>Duration</th>
                        <th>Primary Artist</th>
                    </tr>
                </thead>
                <tbody>
                    {trackData.map((trackIdString: string, index: number) => {
                        return (
                            <div key={trackIdString}>
                                <Track id={trackIdString} />
                                <button onClick={() => moveTrack(trackIdString, index, index - 1)} disabled={index === 0}>
                                    ↑
                                </button>
                                <button onClick={() => moveTrack(trackIdString, index, index + 1)} disabled={index === trackData.length - 1}>
                                    ↓
                                </button>
                                <button onClick={() => removeTrack(trackIdString, index)}>Remove Track</button>
                            </div>
                        );
                    })}
                </tbody>
            </table>
            <h2>Album & Track List</h2>
                <TrackList playlist={playlist} />
            <button>Save changes</button>
        </form>
        </>
    )
}

export default EditPlaylist