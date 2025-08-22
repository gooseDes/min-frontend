import './App.css';
import './ChatPage.css';
import ProfileThing from './gui/profile_thing';
import Message from './gui/message';
import logo from './logo.png'
import { useState, useEffect, useRef } from 'react';
import { closePopup, isUserLogined, openPopup, verifyToken } from './utils';
import { getSocket } from './wsClient';
import ProfilePopup from './gui/profile_popup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowRightFromBracket, faBars, faPaperPlane, faPlus } from '@fortawesome/free-solid-svg-icons';
import Popup from './gui/popup';

function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [lastMessages, setLastMessages] = useState([]);
    const [chats, setChats] = useState([]);
    var inited = useRef(false);
    var lastSended = useRef('');
    var dontTouch = useRef(-1);
    var isWaitingForHistory = useRef(false);
    const ProfilePopupRef = useRef();

    useEffect(() => {
        verifyToken(localStorage.getItem('token'));
        const socket = getSocket();
        socket.on('connect', data => {
            console.log('Connected to server');
            isWaitingForHistory.current = true;
        });
        socket.on('message', (data) => {
            if (data.author === localStorage.getItem('username')) return;
            setMessages((prev) => [...prev, { text: data.text, type: 'left', author: data.author }]);
        });
        socket.on('history', data => {
            if (isWaitingForHistory.current) {
                setMessages(data.messages.map(msg => ({
                    text: msg.text,
                    type: msg.author === localStorage.getItem('username') ? 'right' : 'left',
                    author: msg.author === localStorage.getItem('username') ? 'You': msg.author
                })));
                isWaitingForHistory.current = false;
                requestAnimationFrame(() => {
                    const content_panel = document.getElementById('content_panel');
                    content_panel.scrollTop = content_panel.scrollTop + 10000;
                    const content_panel_children = Array.from(content_panel.children)
                    for (let i=0; i<content_panel_children.length; i++) {
                        setTimeout(() => {
                            content_panel_children[i].style.opacity = '1';
                            content_panel_children[i].style.translate = '0 0';
                        }, i > content_panel_children.length-25 ? (25-(i-(content_panel_children.length-25)))*50 : 0)
                    }
                });
            }
        });
        socket.on('chats', data => {
            setChats(() => data.chats);
        });
        socket.on('createChatResult', data => {
            if (data.success) {
                closePopup('create-chat');
                socket.emit('getChats', {});
            } else {
                const createError = document.getElementById('create_chat_error');
                createError.textContent = data.msg;
                createError.classList.remove('fade');
                setTimeout(() => {
                    createError.classList.add('fade');
                }, 1500);
            }
        });

        return () => {
            socket.off('message');
            socket.off('history');
            socket.off('chats');
            socket.off('createChatResult');
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
        function setRealVh() {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }

        window.addEventListener('resize', setRealVh);
        window.addEventListener('load', setRealVh);
        setRealVh();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            if (!isUserLogined()) {
                openPopup('account');
            }
        }, 100);
    }, []);

    function sendMessage() {
        const value = document.getElementById('message_input').value;
        if (value.trim() === '') return;
        document.getElementById('message_input').value = '';
        setMessages(prev => [
            ...prev,
            {
                text: value,
                author: 'You',
                type: 'right',
            }
        ]);
        const socket = getSocket();
        socket.emit('msg', { text: value, chat: localStorage.getItem('chatId') || 1 });
        lastSended.current = value;
    }

    useEffect(() => {
        if (!inited.current) return;
        const content_panel = document.getElementById('content_panel');
        const content_panel_children = Array.from(
            content_panel?.children || []
        );

        if (lastMessages.length !== 0) {
            if (dontTouch.current === -1) {
                dontTouch.current = content_panel_children.length;
            }
            for (let i = dontTouch.current === -1 ? 0 : dontTouch.current; i < content_panel_children.length; i++) {
                content_panel_children[i].style.opacity = '1';
                content_panel_children[i].style.translate = '0 0';
            }
        }

        let behavior = 'smooth';
        if (lastMessages.length === 0) behavior = 'instant';

        content_panel.scrollTo({
            top: content_panel.scrollTop+10000,
            behavior: behavior
        });
        setLastMessages(messages);
    }, [messages, lastMessages]);

    useEffect(() => {
        const socket = getSocket();
        socket.emit('getChats', {});
    }, [])

    function openChat(username) {
        setMessages([]);
        requestAnimationFrame(() => {
            isWaitingForHistory.current = true;
            const socket = getSocket();
            socket.emit('getChatHistory', { chat: localStorage.getItem('chatId') || 1 });
        });
        const left_panel = document.getElementById('left_panel');
        left_panel.style.translate = '';
        left_panel.style.width = '';
        left_panel.style.opacity = '';
        const right_panel = document.getElementById('right_panel');
        right_panel.style.gap = '10px';
        right_panel.style.filter = '';
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
        inited.current = true;
    }

    function openMenu() {
        const left_panel = document.getElementById('left_panel'); 
        left_panel.style.translate = '10px 10px'; 
        left_panel.style.width = 'calc(100vw - 40px)';
        left_panel.style.opacity = '1';
        document.getElementById('right_panel').style.filter = 'blur(1px)';
    }

    function openUserProfile() {
        ProfilePopupRef.current.show();
    }

    function createChat() {
        const input = document.getElementById('create_chat_nickname_input');
        const socket = getSocket();
        socket.emit('createChat', { nickname: input.value.replace('@', '') })
    }

    return (
        <div>
            <div className="App" id='app'>
                <div className="LeftPanel" id='left_panel'>
                    <div className='ChatsPanel' id='chats_panel'>
                        <ProfileThing text='Default Chat' onClick={() => {localStorage.setItem('chatId', 1); openChat('Default Chat');}}/>
                        {chats.map(chat => (
                            <ProfileThing text={chat.name} onClick={() => {localStorage.setItem('chatId', chat.id); openChat(chat.name);}}/>
                        ))}
                        <button className='ChatPlusButton' onClick={() => openPopup('create-chat')}><FontAwesomeIcon icon={faPlus}/></button>
                    </div>
                    <div className='UserPanel' id='user_panel'>
                        <div className='UserPanelContent' id='user_panel_content'>
                            <ProfileThing text={localStorage.getItem('username') || 'Guest'} onClick={openUserProfile} animation={false}/>
                            <button className='LogoutButton' onClick={() => {
                                localStorage.clear();
                                window.location.href = '/';
                            }} ><FontAwesomeIcon icon={faArrowRightFromBracket}/></button>
                        </div>
                    </div>
                </div>
                <div className="RightPanel" id='right_panel'>
                    <div className='TopPanel' id='top_panel'>
                        <div className='TopPanelContent' id='top_panel_content'>
                            <button className='MenuButton' onClick={openMenu}><FontAwesomeIcon icon={faBars}/></button>
                            <div className='TopPanelThing'>
                                <img src={logo} alt='avatar' />
                                <p id='top_panel_username'>username</p>
                            </div>
                        </div>
                    </div>
                    <div className='ContentPanel' id='content_panel'>
                        {messages.map(msg => (
                            <Message text={msg.text} type={msg.type} author={msg.author} />
                        ))}
                    </div>
                    <div className='InputPanel' id='input_panel'>
                        <input placeholder='Your message here' onKeyDown={(event) => {if (event.key === 'Enter') sendMessage()}} className='MessageInput' id='message_input'/>
                        <button className='SendButton' onClick={sendMessage}><FontAwesomeIcon icon={faPaperPlane}/></button>
                    </div>
                </div>
            </div>
            <Popup title='Account' name='account'>
                <div className="scrollable-y">
                    <p style={{ fontSize: '3svh' }}>Account is required to use MIN. Please <a href='/#signup' style={{ color: '#4f7afbff' }}>create</a> one or <a href='/#signin' style={{ color: '#4f7afbff' }}>log in</a> to an existing one.</p>
                </div>
            </Popup>
            <Popup title='Create chat' name='create-chat' scale={0.5}>
                <input placeholder='nickname' className='CreateChatNicknameInput' id='create_chat_nickname_input' onKeyDown={(event) => {if (event.key === 'Enter') createChat()}}/>
                <p id='create_chat_error' style={{ color: 'red',  fontSize: '12px' }}></p>
                <button className='CreateChatConfirmButton'><FontAwesomeIcon icon={faArrowRight} onClick={createChat}/></button>
            </Popup>
            <ProfilePopup ref={ProfilePopupRef} username={localStorage.getItem('username') || 'Guest'}/>
        </div>
    );
}

export default ChatPage;