import { Playlist as PlaylistModel } from './../models/Playlist'
import { Track as TrackModel } from './../models/Track'
import { Album as AlbumModel } from './../models/Album'
import Track from './Track'
import { useState, useEffect } from 'react'

interface PlaylistProps {
    playlist: PlaylistModel
}

function TrackList({playlist}: PlaylistProps) {
    const [playlistState, setPlaylistState] = useState(playlist)
    const [allAlbums, setAllAlbums] = useState<AlbumModel[]>([])
    const [albumTracks, setAlbumTracks] = useState<{[albumId: string]:TrackModel[]}>({})

    useEffect(() => {
        const controller = new AbortController()
        const getData = async () => {
            const response = await fetch('/api/albums', {
                signal: controller.signal
            })

            const data = await response.json()
            setAllAlbums(data)

            const tracksData: { [albumId: string]: TrackModel[] } = {};

            await Promise.all(data.map(async (album: AlbumModel) => {
                const trackResponse = await fetch(`/api/albums/${album.id}/tracks`, {
                    signal: controller.signal
                });
                const tracks = await trackResponse.json();
                tracksData[album.id] = tracks;
            }));

            setAlbumTracks(tracksData)
        }
        getData()
        return () => {
            controller.abort()
        }
    }, [playlistState])

    const addTrackToPlaylist = async (trackId: string) => {
        try {
            await fetch(`/api/playlists/${playlist._id}/tracks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ trackId })
            });

            setPlaylistState((prevPlaylist) => ({
                ...prevPlaylist,
                tracks: [...prevPlaylist.tracks, trackId]
            }));

        } catch (error) {
            console.error("Error adding track to playlist:", error);
        }
    };

    return (
        <table>
            <tbody>
                <tr>
                    {allAlbums.map(
                        (albumModel) => 
                        <>
                            <h3>{albumModel.name}</h3>
                            <p>Release Year: {albumModel.yearReleased}</p>
                            <p>Genre: {albumModel.genre}</p>
                            <h3>Tracks:</h3>
                            {albumTracks[albumModel.id] && albumTracks[albumModel.id].length > 0 ? (
                                albumTracks[albumModel.id].map((track, trackIndex) => {
                                    const formattedId = `${albumModel.id}-${trackIndex}`;
                                    const isInPlaylist = playlist.tracks.includes(formattedId);
                                    console.log(formattedId)
                                    return (
                                        <tr key={formattedId}>
                                            <td>
                                                <Track id={formattedId} />
                                                {isInPlaylist ? (
                                                    <div>✅</div>
                                                ) : (
                                                    <button onClick={() => addTrackToPlaylist(formattedId)}>
                                                        Add to Playlist
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td>Loading tracks...</td>
                                </tr>
                            )}
                        </>
                    )}
                </tr>
            </tbody>
        </table>
    )
}

export default TrackList