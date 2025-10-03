import { BrowserRouter, HashRouter, Routes, Route, useLocation } from "react-router-dom";
import Popup from "./gui/popup.jsx";
import { useRef, useState } from "react";
import ProfilePopup from "./gui/profile_popup.jsx";
import { address, getSocket } from "./wsClient.js";
import ChatPage from "./pages/chat/ChatPage.jsx";
import SettingsPage from "./pages/settings/SettingsPage.jsx";
import SignupPage from "./pages/signup/SingupPage.jsx";
import SigninPage from "./pages/signin/SinginPage.jsx";
import { isElectron } from "./utils.js";
import { AnimatePresence, motion } from "framer-motion";

const Router = isElectron() ? HashRouter : BrowserRouter;

function PageWrapper({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 250, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "100%" }}
            exit={{ opacity: 0, y: -250, height: 0 }}
            transition={{ default: { type: "spring", stiffness: 200, damping: 12, bounce: 0.3, delay: 0.5 }, opacity: { duration: 1, delay: 0.5 }, duration: 0.5 }}
            style={{ width: "100%", height: "100%" }}
        >
            {children}
        </motion.div>
    );
}

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes key={location.pathname} location={location}>
                <Route
                    path="/"
                    element={
                        <PageWrapper>
                            <ChatPage />
                        </PageWrapper>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <PageWrapper>
                            <SignupPage />
                        </PageWrapper>
                    }
                />
                <Route
                    path="/signin"
                    element={
                        <PageWrapper>
                            <SigninPage />
                        </PageWrapper>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <PageWrapper>
                            <SettingsPage />
                        </PageWrapper>
                    }
                />
            </Routes>
        </AnimatePresence>
    );
}

function App() {
    const [errorPopupContent, setErrorPopupContent] = useState(null);
    const [imageOverlaySrc, setImageOverlaySrc] = useState(null);
    const [imageOverlayShown, setImageOverlayShown] = useState(false);
    const [imageOverlayZoom, setImageOverlayZoom] = useState(1);
    const [imageOverlayPos, setImageOverlayPos] = useState({ x: 0, y: 0 });

    window.setErrorPopup = (content) => {
        setErrorPopupContent(content);
    };
    const [profilePopupContent, setProfilePopupContent] = useState({});
    window.openProfilePopup = (username) => {
        setProfilePopupContent({ username: username, id: -1 });
        const socket = getSocket();
        socket.on("userInfo", (data) => {
            setProfilePopupContent({ username: data.user.name, id: data.user.id });
            socket.off("userInfo");
        });
        socket.emit("getUserInfo", { name: username });
        profilePopupRef.current.show();
    };
    window.openImageOverlay = (src) => {
        setImageOverlayPos({ x: 0, y: 0 });
        setImageOverlayZoom(1);
        setImageOverlaySrc(src);
        if (src) setImageOverlayShown(true);
        else setImageOverlayShown(false);
    };

    function handleOverlayWheel(e) {
        const rect = document.querySelector(".ImageOverlay").getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newScale = Math.min(Math.max(imageOverlayZoom + delta, 0.5), 3);

        const scaleRatio = newScale / imageOverlayZoom;

        setImageOverlayPos((prev) => ({
            x: mouseX - (mouseX - prev.x) * scaleRatio,
            y: mouseY - (mouseY - prev.y) * scaleRatio,
        }));

        setImageOverlayZoom(newScale);
    }

    const profilePopupRef = useRef();
    return (
        <Router>
            <div style={{ width: "100%", height: "100%" }}>
                <AnimatedRoutes />
                <Popup title="Error" name="error">
                    {errorPopupContent}
                </Popup>
                <ProfilePopup ref={profilePopupRef} username={profilePopupContent.username} src={`${address}/avatars/${profilePopupContent.id}.webp`} />
                <div className={`ImageOverlay ${imageOverlayShown ? "show" : "hide"}`} onClick={() => setImageOverlayShown(false)} onWheel={handleOverlayWheel}>
                    <div className={`ImageOverlayContent ${imageOverlayShown ? "show" : "hide"}`}>
                        <img
                            className="ImageFromOverlay"
                            src={imageOverlaySrc}
                            alt="img"
                            style={{
                                transform: `translate(${imageOverlayPos.x}px, ${imageOverlayPos.y}px) scale(${imageOverlayZoom})`,
                            }}
                        />
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default App;
