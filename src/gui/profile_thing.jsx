import "./profile_thing.css";
import { motion, useAnimationControls } from "framer-motion";
import React from "react";

function ProfileThingBase({ text = "Default text", src = "./logo512.png", animation = true, image = true, onClick, children, ...props }) {
    const controls = useAnimationControls();

    const handleClick = async (e) => {
        if (onClick) {
            onClick(text, e);
        }

        await controls.start({
            y: -5,
            transition: { type: "tween", duration: 0.1, ease: "easeOut" },
        });

        await controls.start({
            y: 0,
            transition: { type: "spring", stiffness: 200, damping: 10, mass: 1.2 },
        });
    };

    return (
        <motion.div initial={{ x: -250, opacity: 0 }} animate={(controls, { x: 0, opacity: 1 })} className={`ProfileThingDiv${animation ? " anim" : ""}`} onClick={handleClick} {...props}>
            <img src={src} alt="avatar" draggable="false" className={`ProfileThingImage${image ? "" : " noimg"}`} onError={(e) => (e.currentTarget.src = "./logo512.png")} />
            <p className="ProfileThingText">
                {children}
                {text}
            </p>
        </motion.div>
    );
}

export const ProfileThing = React.memo(ProfileThingBase, (prev, next) => {
    return prev.text === next.text && prev.src === next.src && prev.animation === next.animation && prev.image === next.image && prev.style === next.style;
});

export default ProfileThing;
