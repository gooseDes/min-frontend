import './App.css';
import ProfileThing from './gui/profile_thing';
import Message from './gui/message';
import logo from './logo.png'
import { useState, useEffect, useRef } from 'react';
import { closePopup, isUserLogined, openPopup } from './utils';
import { getSocket } from './wsClient';

function ChatPage() {
    const [messages, setMessages] = useState([]);
    var inited = useRef(false);
    var lastSended = useRef('');

    useEffect(() => {
        const socket = getSocket();
        socket.on('message', (data) => {
            if (lastSended.current === data.text) return;
            setMessages((prev) => [...prev, {text: data.text, type: 'left'}]);
        });

        return () => {
            socket.off('message');
        };
    }, []);

    useEffect(() => {
        const initialMessages = [];
        for (let i = 0; i < 100; i++) {
            initialMessages.push({
                text: `Message ${i}! Lorem ipsum, epta, idi nahui`,
                type: Math.random() < 0.5 ? 'left' : 'right'
            });
        }
        setMessages(initialMessages);
    }, []);

    useEffect(() => {
        if (!isUserLogined()) {
            openPopup('account-popup');
        }
    }, []);

    function sendMessage() {
        const value = document.getElementById('message_input').value;
        if (value.trim() === '') return;
        document.getElementById('message_input').value = '';
        setMessages(prev => [
            ...prev,
            {
                text: value,
                type: 'right',
            }
        ]);
        const socket = getSocket();
        socket.emit('msg', { text: value });
        lastSended.current = value;
    }

    useEffect(() => {
        if (!inited.current) return;
        const content_panel = document.getElementById('content_panel');
        const content_panel_children = Array.from(
            content_panel?.children || []
        );

        for (let i = 0; i < content_panel_children.length; i++) {
            content_panel_children[i].style.translate = '0 0';
        }

        content_panel.scrollTo({
            top: content_panel.scrollTop+10000,
            behavior: 'smooth'
        });
    }, [messages]);

    function openChat(username) {
        document.getElementById('right_panel').style.gap = '10px';
        document.getElementById('top_panel').style.borderRadius = '2svh 2svh 2svh 2svh';
        document.getElementById('content_panel').style.borderRadius = '2svh 2svh 2svh 2svh';
        document.getElementById('input_panel').style.borderRadius = '2svh 2svh 2svh 2svh';
        document.getElementById('top_panel_username').textContent = username;
        Array.from(document.getElementById('top_panel_content').children).forEach((el) => {
            el.style.translate = '0 0';
        });
        Array.from(document.getElementById('input_panel').children).forEach((el) => {
            el.style.translate = '0 0';
        });
        const content_panel = document.getElementById('content_panel');
        content_panel.scrollTop = content_panel.scrollHeight;
        const content_panel_children = Array.from(content_panel.children)
        for (let i=0; i<content_panel_children.length; i++) {
            setTimeout(() => {
                content_panel_children[i].style.translate = '0 0';
            }, i > content_panel_children.length-25 ? (25-(i-(content_panel_children.length-25)))*50 : 0)
        }
        inited.current = true;
    }

    return (
        <div>
            <div className="App" id='app'>
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
                        {messages.map(msg => (
                            <Message text={msg.text} type={msg.type} />
                        ))}
                    </div>
                    <div className='InputPanel' id='input_panel'>
                        <input placeholder='Your message here' onKeyDown={(event) => {if (event.key === 'Enter') sendMessage()}} className='MessageInput' id='message_input'/>
                        <button className='SendButton' onClick={sendMessage}><i className="fa-solid fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
            <div className="popup" id="account-popup">
                <div className="popup-header">Account</div>
                <div className="popup-content">
                    <div className="scrollable-y">
                        <p style={{ fontSize: '3svh' }}>Account is required to use MIN. Please <a href='/#signup' style={{ color: '#4f7afbff' }}>create</a> one or <a href='/#signin' style={{ color: '#4f7afbff' }}>login</a> in to an existing one.</p>
                        <button className="popup-close" onClick={() => {closePopup('account-popup')}}><i className="fa-solid fa-xmark"></i></button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatPage;