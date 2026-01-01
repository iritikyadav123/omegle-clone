import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Room from "./Room";


const Leading=() => {
    const [name, setName] = useState("");
    const [joined, setJoined] = useState(false);
    const [localAudioTrack, setLocalAudioTrack] = useState<MediaStreamTrack | null>(null);
    const [loaclVideoTrack, setLocalVideoTrack] = useState<MediaStreamTrack | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const getCam = async() => {
        const stream = await window.navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })

        const audioTrack = stream.getAudioTracks()[0]
        const videoTrack = stream.getVideoTracks()[0]
        setLocalAudioTrack(audioTrack);
        setLocalVideoTrack(videoTrack)
        if(!videoRef.current) {
            return;
        }

        videoRef.current.srcObject = new MediaStream([videoTrack])
        videoRef.current.play();
    }

    useEffect(() => {
        if(videoRef && videoRef.current) {
            getCam();
        }
    }, [videoRef])
    

    if (!joined) {
        return (
        <div>
            <video autoPlay ref={videoRef}></video>
            <input  type="text" value={name} onChange={(e)=>{setName(e.target.value)}}></input>

            <button onClick={()=> {
                setJoined(true)
            }}>click to join</button>
        </div>
    )
    }
     return <Room name={name} localAudioTrack={localAudioTrack} localVideoTrack={loaclVideoTrack} />
}   

export default Leading;