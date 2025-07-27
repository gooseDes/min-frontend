import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatPage from './ChatPage';
import SignupPage from './SingupPage';

function App() {
    return (
    <Router>
        <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/signup" element={<SignupPage />} />
        </Routes>
    </Router>
    );
}

export default App;