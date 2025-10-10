import { useEffect } from "react";
import { getSocket } from "../../wsClient";

function VoicePage() {
    useEffect(() => {
        const ws = getSocket();
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        const remoteAudio = document.getElementById("remoteAudio");

        pc.ontrack = (event) => {
            remoteAudio.srcObject = event.streams[0];
        };

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                ws.emit("voiceAction", { chat: 1, action: "candidate", candidate: event.candidate });
            }
        };

        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        });

        ws.on("voiceAction", async (data) => {
            if (typeof data === "string") data = JSON.parse(data);
            console.log("voiceAction:", data);

            if (data.action === "offer") {
                await pc.setRemoteDescription(data.offer);
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                ws.emit("voiceAction", { chat: 1, action: "answer", answer });
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

        ws.emit("joinVoice", { chat: 1 });

        ws.on("joinedVoice", (data) => {
            if (data.role === "offer") {
                ws.on("userJoined", async (joinedData) => {
                    console.log("userJoined:", joinedData);
                    if (joinedData.user !== ws.id) {
                        const offer = await pc.createOffer();
                        await pc.setLocalDescription(offer);
                        ws.emit("voiceAction", { chat: 1, action: "offer", offer });
                    }
                });
            }
        });
    }, []);

    return (
        <div>
            <div className="App">
                <div style={{ color: "#fff" }}>Welcome to call beta test!</div>
                <audio id="remoteAudio" autoPlay></audio>
            </div>
        </div>
    );
}

export default VoicePage;
