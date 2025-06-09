import { useState, useEffect } from "react"

interface DataModule {
    Date: string
    Amount: string
}

interface DataBoxProps {
    id: number
}

function DataBox({id} : DataBoxProps) {
    const [dataList, setDataList] = useState<DataModule[]>([])

    useEffect(() => {
        const fetchData = async() => {
            const response = await(await fetch(`https://cpsc4910sq24.s3.amazonaws.com/data/plants/${id}/harvests.json`)).json()
            setDataList(response)
        }
        fetchData();
    }, [id]);


    return (
        <>
            {dataList.map((data) => (
                
                    <tr>
                        <td>{data.Date}</td>
                        <td>{data.Amount}</td>
                    </tr>
                
            ))}
        </>
    )
}

export default DataBox