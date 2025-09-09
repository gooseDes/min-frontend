import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Popup from './gui/popup.jsx';
import { useRef, useState } from 'react';
import ProfilePopup from './gui/profile_popup.jsx';
import { address, getSocket } from './wsClient.jsx';
import ChatPage from './pages/chat/ChatPage.jsx';
import SettingsPage from './pages/settings/SettingsPage.jsx';
import SignupPage from './pages/signup/SingupPage.jsx';
import SigninPage from './pages/signin/SinginPage.jsx';

function App() {
    const [errorPopupContent, setErrorPopupContent] = useState(null);
    const [imageOverlaySrc, setImageOverlaySrc] = useState(null);
    const [imageOverlayShown, setImageOverlayShown] = useState(false);
    const [imageOverlayZoom, setImageOverlayZoom] = useState(1);
    const [imageOverlayPos, setImageOverlayPos] = useState({ x: 0, y: 0 });

    window.setErrorPopup = (content) => {
        setErrorPopupContent(content);
    }
    const [profilePopupContent, setProfilePopupContent] = useState({});
    window.openProfilePopup = (username) => {
        setProfilePopupContent({ 'username': username, 'id': -1 });
        const socket = getSocket();
        socket.on('userInfo', data => {
            setProfilePopupContent({ 'username': data.user.name, 'id': data.user.id });
            socket.off('userInfo');
        });
        socket.emit('getUserInfo', { 'name': username })
        profilePopupRef.current.show();
    }
    window.openImageOverlay = (src) => {
        setImageOverlayPos({ x: 0, y: 0 });
        setImageOverlayZoom(1)
        setImageOverlaySrc(src);
        if (src) setImageOverlayShown(true);
        else setImageOverlayShown(false);
    }

    function handleOverlayWheel(e) {
        const rect = document.querySelector('.ImageOverlay').getBoundingClientRect();
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
        <div style={{width: '100%', height: '100%'}}>
            <Router>
                <Routes>
                    <Route path="/" element={<ChatPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/signin" element={<SigninPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Routes>
            </Router>
            <Router>
                <Popup title='Error' name='error'>{errorPopupContent}</Popup>
                <ProfilePopup ref={profilePopupRef} username={profilePopupContent.username} src={`${address}/avatars/${profilePopupContent.id}.webp`}/>
                <div className={`ImageOverlay ${imageOverlayShown ? 'show' : 'hide'}`} onClick={() => setImageOverlayShown(false)} onWheel={handleOverlayWheel}>
                    <div className={`ImageOverlayContent ${imageOverlayShown ? 'show' : 'hide'}`}>
                        <img className='ImageFromOverlay' src={imageOverlaySrc} alt='img' style={{ transform: `translate(${imageOverlayPos.x}px, ${imageOverlayPos.y}px) scale(${imageOverlayZoom})` }}/>
                    </div>
                </div>
            </Router>
        </div>
    );
}

export default App;