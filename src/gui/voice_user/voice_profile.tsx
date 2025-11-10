import "./voice_profile.css";
import { address } from "../../wsClient";
import { motion } from "framer-motion";

function VoiceProfile({ id, name }) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ type: "tween" }} className="VoiceProfile" key={id}>
            <img className="VoiceProfileAvatar" src={`${address}/avatars/${id}.webp`} />
            <p className="VoiceProfileName">{name}</p>
        </motion.div>
    );
}

export default VoiceProfile;
