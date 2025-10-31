import React from "react";
import "./transition_btn.css";
import { motion, useAnimationControls } from "framer-motion";

type TransitionButtonProps = {
    onClick?: () => void;
    children?: React.ReactNode;
};

function TransitionButtonBase({ children, onClick }: TransitionButtonProps) {
    const controls = useAnimationControls();

    async function handleClick() {
        const app = document.getElementById("root");
        if (app) {
            app.style.transition = "opacity 0.3s ease-out";
            app.style.opacity = "0";
        }

        await controls.start({
            y: -250,
            scale: 5,
            transition: { type: "tween", duration: 0.2, ease: "easeOut" },
        });

        if (onClick) setTimeout(() => onClick(), 200);

        await controls.start({
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 200, damping: 10, mass: 1.2 },
        });
    }

    return (
        <motion.button animate={controls} className="TransitionButton" onClick={handleClick}>
            {children}
        </motion.button>
    );
}

const TransitionButton = React.memo(TransitionButtonBase);

export default TransitionButton;
