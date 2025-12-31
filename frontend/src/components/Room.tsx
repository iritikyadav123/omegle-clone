import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";


const Room=() => {
    const[serchParams, setSearchParams] = useSearchParams();
    const name = serchParams.get('name');

    useEffect(() => {

    }, [name])
    return (
        <div>
            hi {name}
        </div>
    )
}

export default Room;