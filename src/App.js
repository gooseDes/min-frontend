import './App.css';
import ProfileThing from './gui/profile_thing';
import Message from './gui/message';
import logo from './logo.png'

function openChat(username) {
    document.getElementById('right_panel').style.gap = '10px';
    document.getElementById('top_panel').style.borderRadius = '2svh 2svh 2svh 2svh';
    document.getElementById('content_panel').style.borderRadius = '2svh 2svh 2svh 2svh';
    document.getElementById('top_panel_username').textContent = username;
    Array.from(document.getElementById('top_panel_content').children).forEach((el) => {
        el.style.translate = '0 0';
    });
    const content_panel = document.getElementById('content_panel');
    content_panel.scrollTop = content_panel.scrollHeight;
    const content_panel_children = Array.from(content_panel.children)
    for (let i=0; i<content_panel_children.length; i++) {
        setTimeout(() => {
            content_panel_children[i].style.translate = '0 0';
        }, i > content_panel_children.length-25 ? (25-(i-(content_panel_children.length-25)))*50 : 0)
    };
}

function App() {
    return (
        <div className="App">
            <div className="LeftPanel">
                {[...Array(10)].map((_, i) => (
                    <ProfileThing text={`Olexey Totskiy ${i}`} onClick={openChat}/>
                ))}
            </div>
            <div className="RightPanel" id='right_panel'>
                <div className='TopPanel' id='top_panel'>
                    <div className='TopPanelContent' id='top_panel_content'>
                        <div className='TopPanelThing'>
                            <img src={logo} alt='avatar' />
                            <p id='top_panel_username'>username</p>
                        </div>
                    </div>
                </div>
                <div className='ContentPanel' id='content_panel'>
                    {[...Array(100)].map((_, i) => (
                        <Message text={`Message ${i}! Lorem ipsum, epta, idi nahui`} type={`${Math.round(Math.random())===0 ? 'left':'right'}`} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;