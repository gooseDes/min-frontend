import "./transition_btn.css";
import { motion, useAnimationControls } from "framer-motion";

type TransitionButtonProps = {
    onClick?: () => void;
    children?: React.ReactNode;
};

function TransitionButton({ children, onClick }: TransitionButtonProps) {
    const controls = useAnimationControls();

    async function handleClick() {
        controls.start({
            position: "fixed",
            x: window.innerWidth / 2,
            y: -window.innerHeight / 2,
            backgroundColor: "#000",
            scale: 100,
            opacity: 0,
            fontSize: 20,
            color: "#aaa",
            transition: { type: "tween", ease: "easeOut", duration: 0.5 },
        });
        if (onClick) setTimeout(() => onClick(), 300);
    }

    return (
        <motion.button animate={controls} className="TransitionButton" onClick={handleClick}>
            {children}
        </motion.button>
    );
}

export default TransitionButton;
