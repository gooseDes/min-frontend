import './App.css';
import ProfileThing from './profile_thing';

function App() {
    return (
        <div className="App">
            <div className="LeftPanel">
                {[...Array(10)].map((_, i) => (
                    <ProfileThing />
                ))}
            </div>
            <div className="RightPanel"></div>
        </div>
    );
}

export default App;