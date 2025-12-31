import { useState } from "react";
import { Link } from "react-router-dom";


const Leading=() => {
    const [name, setName] = useState("")
    return (
        <div>
            <input placeholder="enter you name" type="text" value={name} onChange={(e)=>{setName(e.target.value)}}></input>

            <Link to={`/room/?name=${name}`}>Join to</Link>
        </div>
    )
}

export default Leading;