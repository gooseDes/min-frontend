import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ChatPage from './ChatPage';
import SignupPage from './SingupPage';
import SigninPage from './SinginPage';
import Popup from './gui/popup';
import { useState } from 'react';

function App() {
    const [errorPopupContent, setErrorPopupContent] = useState(null);
    window.setErrorPopup = (content) => {
        setErrorPopupContent(content);
    }
    return (
        <div style={{width: '100%', height: '100%'}}>
            <Router>
                <Routes>
                    <Route path="/" element={<ChatPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/signin" element={<SigninPage />} />
                </Routes>
            </Router>
            <Popup title='Error' name='error'>{errorPopupContent}</Popup>
        </div>
    );
}

export default App;