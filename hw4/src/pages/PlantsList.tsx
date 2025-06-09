import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface PlantsModel {
    id: number
    name: string
    species: string
    cultivar?: string
    stage: string
    location: string
    picture?: string
}

function PlantsList() {
    const [plantsList, setPlantsList] = useState<PlantsModel[]>([])

    useEffect(() => {
        const fetchPlants = async() => {
            try {
                const response = await (await fetch("https://cpsc4910sq24.s3.amazonaws.com/data/plants.json")).json()

                //assuming the provided types are the only types that will be in the dataset
                response.forEach((plant: PlantsModel) => {
                    if (plant.species === "Arugula") {
                        plant.picture = "https://cpsc4910sq24.s3.amazonaws.com/images/arugula.jpg"
                    } else if (plant.species === "Bell pepper") {
                        plant.picture = "https://cpsc4910sq24.s3.amazonaws.com/images/bell-pepper.jpg"
                    } else if (plant.species === "Strawberry") {
                        plant.picture = "https://cpsc4910sq24.s3.amazonaws.com/images/strawberry.jpg"
                    } else {
                        if (plant.cultivar === "Green leaf") {
                            plant.picture = "https://cpsc4910sq24.s3.amazonaws.com/images/green-leaf-lettuce.jpg"
                        } else {
                            plant.picture = "https://cpsc4910sq24.s3.amazonaws.com/images/butter-lettuce.jpg"
                        }
                    }
                    console.log(plant.picture)
                })
                setPlantsList(response)
            } catch (error) {
                console.log("error reading json")
            }
        }
        fetchPlants();
    }, []);

    const groupByLocation = plantsList.reduce((location, plant) => {
        if (!location[plant.location]) location[plant.location] = [];
        location[plant.location].push(plant);
        return location;
    }, {} as Record<string, PlantsModel[]>);

    return (
        <>
            <h1>Plant Palace</h1>
            <div>
                {Object.entries(groupByLocation).map(([location, plantsList]) => (
                    <details key={location} open>
                        <summary> { location } </summary>
                        <div className="section">
                            {plantsList.map((plant) => (
                                <div className="plantBox" key={plant.id}>
                                    <img id="homeImage" src={plant.picture} alt={plant.species}/>

                                    <div className="homeDetail">
                                        <Link className="link" to={`/${plant.id}`} state={{ plant }}> { plant.name }</Link>
                                        <p>Species: {plant.species}</p>
                                        {plant.cultivar && <p>Cultivar: {plant.cultivar}</p>}
                                        <p>Stage: {plant.stage}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </details>
                ))}
            </div>
        </>
    )
}

export default PlantsList