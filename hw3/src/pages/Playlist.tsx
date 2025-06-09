import { Playlist as PlaylistModel } from './../models/Playlist';
import { Link } from 'react-router-dom'

interface PlaylistSectionProps {
    data: PlaylistModel
}

function PlaylistSection({data}: PlaylistSectionProps) {
    return (
        <tr>
            <td>{data.name}</td>
            <td>{data.isPublic ? 'Public' : 'Private'}</td>
            <td>
                <Link to={`/${data._id}/edit`} state={{data}}>
                    <button>Edit Playlist</button>
                </Link>
            </td>
        </tr>
    );
}

export default PlaylistSection