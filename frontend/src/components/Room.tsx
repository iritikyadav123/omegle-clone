import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { io, type Socket } from "socket.io-client";

const URL = "http://localhost:3000";
const Room = ({
    name,
    localAudioTrack,
    localVideoTrack,
}: {
    name: string;
    localAudioTrack: MediaStreamTrack | null;
    localVideoTrack: MediaStreamTrack | null;
}) => {
    const [serchParams, setSearchParams] = useSearchParams();
    const [lobby, setLobby] = useState(true);
    const [socket, setSocket] = useState<null | Socket>(null);
    const [sendingPc, setSendingPc] = useState<null | RTCPeerConnection>(null);
    const [seceivingPc, setReceivingPc] = useState<null | RTCPeerConnection>(null);
    const [remoteVideoTrack, setRemoteVideoTrack] = useState<MediaStreamTrack | null>(null);
    const [remoteAudioTrack, setRemoteAudioTrack] = useState<MediaStreamTrack | null>(null);
    const [remoteMediaStream, setRemoteMediaStream] = useState<MediaStream | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null)
    const localVideoRef = useRef<HTMLVideoElement>(null);


    useEffect(() => {
        const socket = io(URL);
        socket.on("send-offer", async ({ roomId }) => {
            setLobby(false);

            const pc = new RTCPeerConnection();
            setSendingPc(pc);
            if (localVideoTrack) {
                // pc.addStream(new MediaStream([localVideoTrack]))
                pc.addTrack(localVideoTrack)
               
            }
            if(localAudioTrack) {
                pc.addTrack(localAudioTrack)
            }



            pc.onicecandidate = async (e) => {
                if (e.candidate) {
                    socket.emit("add-ice-candidate", {
                        candidate: e.candidate,
                        type : "receiver",
                        roomId
                    })
                }
            }
            pc.onnegotiationneeded = async () => {
                const sdp = await pc.createOffer();
                // @ts-ignore
                pc.setLocalDescription(sdp)
                socket.emit("offer", {
                    sdp,
                    roomId,
                });
            }

        });
        socket.on("offer", async ({ roomId, sdp: remoteSdp }) => {
            setLobby(false);
            const pc = new RTCPeerConnection();
            pc.setRemoteDescription(remoteSdp);
            const sdp = await pc.createAnswer();
            pc.setLocalDescription(sdp)
            const stream = new MediaStream();
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = stream
            }
            setRemoteMediaStream(stream);
            setReceivingPc(pc);
            window.pcr = pc;


            pc.onicecandidate = async (e) => {
                if(!e.candidate) {
                    return;
                }
                if (e.candidate) {
                    socket.emit("add-ice-candidate", {
                        candidate: e.candidate,
                        type: "receiver",
                        roomId
                    })
                }
            }

            // pc.ontrack = (e) => {
            //     const { track, type } = e
            //     if (type == "audio") {
            //         // setRemoteAudioTrack(track);
            //         // @ts-ignore
            //         remoteVideoRef.current?.srcObject.addTrack(track)
            //     } else {
            //         // setRemoteVideoTrack(track);
            //         // @ts-ignore
            //         remoteVideoRef.current?.srcObject.addTrack(track)
            //     }
            //     // @ts-ignore
            //     remoteVideoRef.current.play()
            // };
            socket.emit("answer", {
                roomId,
                sdp: sdp,
            });

            setTimeout(() => {
                const track1 = pc.getTransceivers()[0].receiver.track;
                const track2 = pc.getTransceivers()[1].receiver.track;

                if(track1.kind === 'video') {
                    setRemoteAudioTrack(track2);
                    setRemoteVideoTrack(track1)
                }else {
                    setRemoteAudioTrack(track1);
                    setRemoteVideoTrack(track2);
                }

                //@ts-ignore
                remoteVideoRef.current?.srcObject.addTrack(track1);
                //@ts-ignore
                remoteVideoRef.current?.srcObject.addTrack(track2);
                //@ts-ignore
                remoteVideoRef.current.play();
             },5000)
        });

        socket.on("answer", ({ roomId, sdp: remoteSdp }) => {
            setLobby(false);
            setSendingPc(pc => {
                pc?.setRemoteDescription(remoteSdp)
                return pc
            })
        });
        socket.on("lobby", () => {
            setLobby(true);
        }); 

        socket.on("add-ice-candidate", ({candidate, type}) => {
            if(type == 'sender') {
                setReceivingPc(pc => {
                    if(!pc) {
                        console.log("receiveing pc not found")
                    }else {
                        console.log(pc.ontrack)
                    }
                    pc?.addIceCandidate(candidate)
                    return pc;
                })
            }else {
                setSendingPc(pc => {
                    pc?.addIceCandidate(candidate)
                    return pc
                })
            }
        })


        setSocket(socket);
    }, [name]);

    useEffect(() => {
        if (localVideoRef.current) {
            if (localVideoTrack) {
                localVideoRef.current.srcObject = new MediaStream([localVideoTrack]);
                localVideoRef.current.play();
            }

        }
    }, [localVideoRef])

    return (
        <div>
            hi {name}
            <video autoPlay width={400} height={400} ref={localVideoRef}/>
            {lobby ? "waiting to connect you to someone" : null}
            <video autoPlay width={400} height={400} ref={remoteVideoRef} />
        </div>
    );
};

export default Room;
