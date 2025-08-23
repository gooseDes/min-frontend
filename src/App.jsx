import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatPage from './ChatPage.jsx';
import SignupPage from './SingupPage.jsx';
import SigninPage from './SinginPage.jsx';
import Popup from './gui/popup.jsx';
import { useRef, useState } from 'react';
import ProfilePopup from './gui/profile_popup.jsx';

function App() {
    const [errorPopupContent, setErrorPopupContent] = useState(null);
    window.setErrorPopup = (content) => {
        setErrorPopupContent(content);
    }
    const [profilePopupContent, setProfilePopupContent] = useState({});
    window.openProfilePopup = (username) => {
        setProfilePopupContent({ 'username': username });
        profilePopupRef.current.show();
    }
    const profilePopupRef = useRef();
    return (
        <div style={{width: '100%', height: '100%'}}>
            <Router>
                <Routes>
                    <Route path="/" element={<ChatPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/signin" element={<SigninPage />} />
                </Routes>
            </Router>
            <Router>
                <Popup title='Error' name='error'>{errorPopupContent}</Popup>
                <ProfilePopup ref={profilePopupRef} username={profilePopupContent.username}/>
            </Router>
        </div>
    );
}

export default App;