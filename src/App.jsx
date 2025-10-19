import { BrowserRouter, HashRouter, Routes, Route, useLocation } from "react-router-dom";
import Popup from "./gui/popup.jsx";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import ProfilePopup from "./gui/profile_popup.jsx";
import { address, getSocket } from "./wsClient.js";
import { isElectron } from "./utils.js";
import { AnimatePresence, motion } from "framer-motion";
import VoicePage from "./pages/voice/VoicePage.jsx";

const ChatPage = lazy(() => import("./pages/chat/ChatPage.jsx"));
const SignupPage = lazy(() => import("./pages/signup/SignupPage.jsx"));
const SigninPage = lazy(() => import("./pages/signin/SigninPage.jsx"));
const SettingsPage = lazy(() => import("./pages/settings/SettingsPage.jsx"));

const Router = isElectron() ? HashRouter : BrowserRouter;

function PageWrapper({ children }) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ opacity: { duration: 0.5, delay: 0.3 } }} style={{ width: "100%", height: "100%" }}>
            {children}
        </motion.div>
    );
}

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Suspense
                fallback={
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: "tween", ease: "easeInOut" }}
                        style={{ color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", height: "100%", fontSize: "24px" }}
                    >
                        Loading...
                    </motion.div>
                }
            >
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
                    <Route
                        path="/voice"
                        element={
                            <PageWrapper>
                                <VoicePage />
                            </PageWrapper>
                        }
                    />
                </Routes>
            </Suspense>
        </AnimatePresence>
    );
}

function App() {
    const [errorPopupContent, setErrorPopupContent] = useState(null);
    const [imageOverlaySrc, setImageOverlaySrc] = useState(null);
    const [imageOverlayShown, setImageOverlayShown] = useState(false);
    const [imageOverlayZoom, setImageOverlayZoom] = useState(1);
    const [imageOverlayPos, setImageOverlayPos] = useState({ x: 0, y: 0 });
    const [profilePopupContent, setProfilePopupContent] = useState({});
    const profilePopupRef = useRef();

    useEffect(() => {
        window.setErrorPopup = (content) => {
            setErrorPopupContent(content);
        };
        window.openProfilePopup = (username) => {
            setProfilePopupContent({ username: username, id: -1 });
            profilePopupRef.current.show();
            const socket = getSocket();
            socket.on("userInfo", (data) => {
                setProfilePopupContent({ username: data.user.name, id: data.user.id });
                socket.off("userInfo");
            });
            socket.emit("getUserInfo", { name: username });
        };
        window.openImageOverlay = (src) => {
            setImageOverlayPos({ x: 0, y: 0 });
            setImageOverlayZoom(1);
            setImageOverlaySrc(src);
            if (src) setImageOverlayShown(true);
            else setImageOverlayShown(false);
        };
    }, []);

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
