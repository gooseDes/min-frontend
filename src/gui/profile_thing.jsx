import "./profile_thing.css";
import { motion, useAnimationControls } from "framer-motion";

function ProfileThing({ text = "Default text", src = "./logo512.png", animation = true, image = true, onClick, children }) {
    const controls = useAnimationControls();

    const handleClick = async () => {
        if (onClick) {
            onClick(text);
        }

        await controls.start({
            y: -5,
            transition: {
                type: "tween",
                duration: 0.1,
                ease: "easeOut",
            },
        });

        await controls.start({
            y: 0,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 10,
                mass: 1.2,
            },
        });
    };

    return (
        <motion.div animate={controls} className={`ProfileThingDiv${animation ? " anim" : ""}`} onClick={handleClick}>
            <img src={src} alt="avatar" draggable="false" className={`ProfileThingImage${image ? "" : " noimg"}`} onError={(e) => (e.currentTarget.src = "./logo512.png")} />
            <p className="ProfileThingText">
                {children}
                {text}
            </p>
        </motion.div>
    );
}

export default ProfileThing;
