import { useEffect, useState } from 'react';
import Playlist from './Playlist';
import { Playlist as PlaylistModel } from '../models/Playlist';
import { Link } from 'react-router-dom'

function PlaylistList(){
    const [playlistData, setPlaylistData] = useState<PlaylistModel[]> ()

    useEffect(() => {
        const controller = new AbortController()
        const getData = async () => {
            const response = await fetch('/api/playlists', {
                signal: controller.signal
            })

            const data = await response.json()
            setPlaylistData(data)
        }
        getData()
        return () => {
            controller.abort()
        }
    }, [])

    if (!playlistData) {
        return (
            <>
            <h1>No User Playlists!</h1>
            <Link to='/new'>
                <button>New Playlist</button>
            </Link>
            </>
        )
    }

    {/* if empty, return no playlists found!*/}
    return (
        <>
        <h1>Pandify Playlists</h1>
        <table>
            <thead>
                <tr>
                    <th>Playlist Name</th>
                    <th>Visibility</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
                {playlistData.map(
                    (playlistModel) => <Playlist data={playlistModel} />
                )}
            </tbody>
        </table>
        <Link to='/new'>
            <button>New Playlist</button>
        </Link>
        </>
    )
}

export default PlaylistList