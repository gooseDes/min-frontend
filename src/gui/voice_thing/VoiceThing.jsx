import "./VoiceThing.css";
import { useEffect, useState } from "react";
import { getSocket } from "../../wsClient";

function VoiceThing({ active = false }) {
    const [inited, setInited] = useState(false);

    useEffect(() => {
        if (!active) return;
        console.log("Voice Chat Started!");
        if (inited) return;
        setInited(true);
        const ws = getSocket();

        ws.on("turnUrls", (data) => {
            navigator.mediaDevices
                .getUserMedia({ audio: true })
                .then((stream) => {
                    const pc = new RTCPeerConnection({
                        iceServers: data.urls,
                    });

                    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

                    const remoteAudio = document.getElementById("remoteAudio");

                    pc.ontrack = (event) => {
                        if (remoteAudio.srcObject !== event.streams[0]) {
                            remoteAudio.srcObject = event.streams[0];
                        }
                    };

                    pc.onicecandidate = (event) => {
                        if (event.candidate) {
                            ws.emit("voiceAction", { chat: localStorage.getItem("chatId") || 1, action: "candidate", candidate: event.candidate });
                        }
                    };

                    ws.on("voiceAction", async (data) => {
                        if (typeof data === "string") data = JSON.parse(data);
                        console.log("voiceAction:", data);

                        if (data.action === "offer") {
                            await pc.setRemoteDescription(data.offer);
                            const answer = await pc.createAnswer();
                            await pc.setLocalDescription(answer);
                            ws.emit("voiceAction", { chat: localStorage.getItem("chatId") || 1, action: "answer", answer });
                        } else if (data.action === "answer") {
                            await pc.setRemoteDescription(data.answer);
                        } else if (data.action === "candidate") {
                            try {
                                await pc.addIceCandidate(data.candidate);
                            } catch (err) {
                                console.error("Error adding ICE candidate:", err);
                            }
                        }
                    });

                    ws.emit("joinVoice", { chat: localStorage.getItem("chatId") || 1 });

                    ws.on("joinedVoice", (data) => {
                        console.log("joinedVoice:", data);
                        if (data.role === "offer") {
                            ws.on("userJoined", async (joinedData) => {
                                console.log("userJoined:", joinedData);
                                if (joinedData.user !== ws.id) {
                                    const offer = await pc.createOffer();
                                    await pc.setLocalDescription(offer);
                                    ws.emit("voiceAction", { chat: localStorage.getItem("chatId") || 1, action: "offer", offer });
                                }
                            });
                        }
                    });
                })
                .catch((error) => {
                    console.error("Error getting user media:", error);
                });
        });

        ws.on("error", (data) => {
            console.error(data);
        });

        ws.emit("getTurnUrls", { chat: localStorage.getItem("chatId") || 1 });
    }, [active]);

    return (
        <div className={`VoiceChatThing ${active ? "shown" : ""}`}>
            <div style={{ color: "var(--secondary)" }}>Welcome to voice!</div>
            <audio id="remoteAudio" autoPlay></audio>
        </div>
    );
}

export default VoiceThing;
