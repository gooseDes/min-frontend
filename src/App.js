import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ChatPage from './ChatPage';
import SignupPage from './SingupPage';
import SigninPage from './SinginPage';

function App() {
    return (
    <Router>
        <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
        </Routes>
    </Router>
    );
}

export default App;