import { useLocation } from "react-router-dom"
import DataBox from './DataBox'

function PlantBox () {
    const location = useLocation()
    const plant = location.state?.plant

    return (
        <>
            <h1>{plant.name}</h1>
            <div className="listing">
                <div className="listingLeft">
                    <img id="listingImage" src={plant.picture} alt={plant.species}/>
                    <p>Species:  {plant.species}</p>
                    <p>Stage:  {plant.stage}</p>
                </div>
                <div className="listingRight">
                    <h2>Harvests</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                        <DataBox id={plant.id} />
                        </tbody>
                    </table>
                </div>
            </div>

        </>
    )
}

export default PlantBox