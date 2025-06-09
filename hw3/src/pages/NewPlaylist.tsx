import { useState } from 'react'

const NewPlaylist = () => {
    const [playlistData, setPlaylistData] = useState({name: '', isPublic: false})

    const handleChange = (event: { target: { name: string; value: any; }; }) => {
        const { name, value } = event.target;
        setPlaylistData(prevPlaylistData => ({
          ...prevPlaylistData,
          [name]: value,
        }));
    };

    const handleCheckChange = (event: { target: { name: string; checked: boolean; }; }) => {
        const { name, checked } = event.target;
        setPlaylistData(prevPlaylistData => ({
            ...prevPlaylistData,
            [name]: checked,
        }));
    };

    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        try {
            const response = await fetch('/api/playlists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: playlistData.name,
                    isPublic: playlistData.isPublic
                })
            })
            console.log('Playlist data submitted:', playlistData);
            window.location.href = "http://localhost:5173";
        } catch (error) {
            console.error('Error submitting playlist:', error);
        }

    };

    return (
        <>
        <form onSubmit={handleSubmit}>
            <h1>New Playlist:</h1>
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={playlistData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="isPublic">Public?:</label>
                <input
                    type="checkbox"
                    id="isPublic"
                    name="isPublic"
                    checked={playlistData.isPublic}
                    onChange={handleCheckChange}
                />
            </div>
            <button type="submit">Submit New Playlist</button>
        </form>
        </>
    )
}

export default NewPlaylist