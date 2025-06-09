import { Track as TrackModel } from './../models/Track';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface TrackSectionProps {
    id: string
}

function PlaylistSection({id}: TrackSectionProps) {
    const [trackData, setTrackData] = useState<TrackModel>()

    //parse the string first number = album second number = track
    const [albumId, trackNo] = id.split('-').map(Number)

    useEffect(() => {
        const controller = new AbortController()
        const getData = async () => {
            const response = await fetch(`/api/albums/${albumId}/tracks/`, {
                signal: controller.signal
            })

            const data = await response.json()
            const foundTrack = data.find((track: { trackNumber: number; }) => track.trackNumber === trackNo);

            setTrackData(foundTrack)
        }
        getData()
        return () => {
            controller.abort()
        }
    }, [])
    return (
        <tr>
            <td>{trackData?.name}</td>
            <td>{trackData?.duration}</td>
            <td>{trackData?.primaryArtist}</td>
        </tr>
    );
}

export default PlaylistSection