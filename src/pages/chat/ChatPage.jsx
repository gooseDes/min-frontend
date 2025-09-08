import '@/App.css';
import './ChatPage.css';
import ProfileThing from '../../gui/profile_thing';
import Message from '../../gui/message';
import logo from '@/logo.png'
import { useState, useEffect, useRef } from 'react';
import { closePopup, isUserLogined, loadFile, openPopup, showError, validateString, verifyToken } from '../../utils';
import { address, getSocket } from '../../wsClient';
import ProfilePopup from '../../gui/profile_popup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faArrowRightFromBracket, faBars, faGear, faMessage, faPaperclip, faPaperPlane, faPlus, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Popup from '../../gui/popup';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { t } from 'i18next';

function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [lastMessages, setLastMessages] = useState([]);
    const [chats, setChats] = useState([]);
    const [lines, setLines] = useState(1);
    const [customEmojis, setCustomEmojis] = useState([]);

    var inited = useRef(false);
    var lastSended = useRef('');
    var animateFrom = useRef(-1);
    var isWaitingForHistory = useRef(false);
    const ProfilePopupRef = useRef();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    window.openChat = username => {
        searchParams.set('chat', username); 
        searchParams.delete('profile');
        setSearchParams(searchParams);
    }

    useEffect(() => {
        verifyToken(localStorage.getItem('token'));
        const socket = getSocket();
        socket.on('connect', data => {
            console.log('Connected to server');
        });
        socket.on('message', (data) => {
            if (data.author === localStorage.getItem('username')) data.author = 'You';
            setMessages((prev) => [...prev, { id: data.id, text: data.text, type: data.author == 'You' ? 'right' : 'left', author: data.author, author_id: data.author_id }]);
        });
        socket.on('history', data => {
            if (isWaitingForHistory.current) {
                setMessages(data.messages.map(msg => ({
                    id: msg.id,
                    text: msg.text,
                    type: msg.author === localStorage.getItem('username') ? 'right' : 'left',
                    author: msg.author === localStorage.getItem('username') ? 'You': msg.author,
                    author_id: msg.author_id
                })));
                animateFrom.current = data.messages.length;
                isWaitingForHistory.current = false;
                requestAnimationFrame(() => {
                    const content_panel = document.getElementById('content_panel');
                    content_panel.scrollTop = content_panel.scrollTop;
                    const content_panel_children = Array.from(content_panel.children)
                    for (let i=0; i<content_panel_children.length; i++) {
                        content_panel.scrollTop += content_panel_children[i].getBoundingClientRect().height*1000;
                    }
                    const reversed = content_panel_children.reverse()
                    for (let i=0; i<content_panel_children.length; i++) {
                        setTimeout(() => {
                            reversed[i].classList.add('show');
                        }, i<25 ? i*50 : 1000);
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
        socket.on('customEmojis', (data) => {
            setCustomEmojis(data.emojis);
        });
        socket.on('error', data => {
            console.error(`Error: ${data}`)
            showError(data.msg);
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
                localStorage.clear();
            }
        }, 100);
        // Watching for changes
        const content_panel = document.getElementById('content_panel');
        const observer = new ResizeObserver((entries) => {
            setTimeout(() => {
                content_panel.scrollTop += 1000000;
            }, 100);
        });
        observer.observe(content_panel);
    }, []);

    useEffect(() => {
        if (!inited.current) return;
        const content_panel = document.getElementById('content_panel');
        const content_panel_children = Array.from(
            content_panel?.children || []
        );

        let scrollBy = 0;

        if (lastMessages.length !== 0) {
            for (let i = animateFrom.current; i < content_panel_children.length; i++) {
                scrollBy += content_panel_children[i].getBoundingClientRect().height*1000;
                requestAnimationFrame(() => {
                    content_panel_children[i].classList.add('slow');
                    content_panel_children[i].classList.add('show');
                });
            }
        }

        let behavior = 'smooth';
        if (lastMessages.length === 0) behavior = 'instant';

        content_panel.scrollTo({
            top: content_panel.scrollTop+scrollBy,
            behavior: behavior
        });
        setLastMessages(messages);
    }, [messages, lastMessages]);

    useEffect(() => {
        const socket = getSocket();
        socket.emit('getChats', {});
    }, [])

    useEffect(() => {
        const profile = searchParams.get('profile');
        if (profile) {
            window.openProfilePopup(profile);
        }
        const chat = searchParams.get('chat');
        if (chat) {
            const socket = getSocket();

            function open(id, username) {
                localStorage.setItem('chatId', id);
                openChat(username);
                searchParams.delete('chat');
                setSearchParams(searchParams);
            }

            socket.on('getChatWithResult', data => {
                if (data.chatId == -1) {
                    socket.on('createChatResult', data => {
                        if (success) {
                            open(data.chatId, chat)
                        }
                        socket.off('createChatResult');
                    });
                } else {
                    socket.off('getChatWithResult');
                    open(data.chatId, chat)
                }
            });
            socket.emit('getChatWith', { name: chat })
        }
    }, [location, searchParams]);

    function sendMessage() {
        const input = document.getElementById('message_input');
        let value = input.value;
        if (value.trim() === '') return;
        const splitted = value.split(":");
        for (let i=0; i<splitted.length-1; i++) {
            if (validateString(splitted[i], 'username', 1, 64) && customEmojis.find(emoji => emoji.name === splitted[i])) {
                splitted[i] = `![${splitted[i]}](${address}/emojis/${customEmojis.find(emoji => emoji.name === splitted[i]).id}.webp)`;
            }
        }
        console.log(splitted);
        value = splitted.join(":");
        input.value = '';
        setLines(1);
        const socket = getSocket();
        socket.emit('msg', { text: value, chat: localStorage.getItem('chatId') || 1 });
        lastSended.current = value;
    }

    function openChat(username) {
        setMessages([]);
        requestAnimationFrame(() => {
            isWaitingForHistory.current = true;
            requestAnimationFrame(() => {
                const socket = getSocket();
                socket.emit('getChatHistory', { chat: localStorage.getItem('chatId') || 1 });
            });
        });
        document.getElementById('left_panel').classList.remove('show');
        const right_panel = document.getElementById('right_panel');
        right_panel.style.gap = '10px';
        right_panel.style.filter = '';
        document.getElementById('top_panel').style.borderRadius = '2svh 2svh 2svh 2svh';
        document.getElementById('content_panel').style.borderRadius = '2svh 2svh 2svh 2svh';
        document.getElementById('input_panel').style.borderRadius = '2svh 2svh 2svh 2svh';
        document.getElementById('top_panel_username').textContent = username;
        const socket = getSocket();
        socket.on('userInfo', data => {
            document.getElementById('top_panel_avatar').src = `${address}/avatars/${data.user?.id}.webp`;
        });
        socket.emit('getUserInfo', { name: username });
        Array.from(document.getElementById('top_panel_content').children).forEach((el) => {
            el.style.translate = '0 0';
        });
        Array.from(document.getElementById('input_panel').children).forEach((el) => {
            el.style.translate = '0 0';
        });
        document.querySelectorAll('.MessageWhenEmpty').forEach((el) => {
            el.classList.add('fade-down');
        });
        inited.current = true;
    }

    function openMenu() {
        document.getElementById('left_panel').classList.add('show'); 
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

    function attachImages() {
        try {
            loadFile('image', true, (files) => {
                fetch(`${address}/attach`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                    body: (() => {
                        const formData = new FormData();
                        files.forEach((file) => {
                            formData.append('attachments', file);
                        });
                        return formData;
                    })()
                }).then(responce => responce.json()).then(data => {
                    if (data.success) {
                        const input = document.getElementById('message_input');
                        input.value += ' ' + data.urls.map(att => `![attachment](${address}${att})`).join(' ');
                        input.focus();
                    } else {
                        showError(data.msg);
                    }
                })
            });
        } catch (e) {
            showError(e.message);
        }
    }

    const handleInput = (e) => {
        const value = e.target.value;
        const count = value.split("\n").length;
        setLines(count);
    };

    const handleKeyDownForInput = (e) => {
        const input = document.getElementById('message_input');
        if (e.key === "Enter") {
            if (e.shiftKey) {
                input.value += "\n";
                setLines(lines + 1);
            } else {
                sendMessage();
            }
            e.preventDefault();
        }
    };

    setTimeout(() => {
        const socket = getSocket();
        socket.emit('getChats', {});
        socket.emit('getCustomEmojis', {});
    }, 10000);

    return (
        <div>
            <div className="App" id='app'>
                <div className="LeftPanel" id='left_panel'>
                    <div className='ChatsHeader'>
                        <p className='ChatsTitle'><Trans>chats</Trans></p>
                        <button className='ChatPlusButton' onClick={() => openPopup('create-chat')}><FontAwesomeIcon icon={faPlus}/></button>
                    </div>
                    <div className='ChatsPanel' id='chats_panel'>
                        <ProfileThing text={<Trans>default_chat</Trans>} onClick={() => {localStorage.setItem('chatId', 1); openChat('Default Chat');}}/>
                        {chats.map(chat => (
                            <ProfileThing text={chat.name} onClick={() => { localStorage.setItem('chatId', chat.id); openChat(chat.name); }} src={`${address}/avatars/${chat.participants.find(el => el.id != localStorage.getItem('id'))?.id}.webp`} key={chat.id}/>
                        ))}
                    </div>
                    <div className='UserPanel' id='user_panel'>
                        <div className='UserPanelContent' id='user_panel_content'>
                            <ProfileThing text={localStorage.getItem('username') || <Trans>guest</Trans>} onClick={openUserProfile} animation={false} src={`${address}/avatars/${localStorage.getItem('id')}.webp`}/>
                            <button className='UserControlButton settings' onClick={() => {window.location.href='/settings'}}><FontAwesomeIcon icon={faGear}/></button>
                            <button className='UserControlButton logout' onClick={() => {
                                localStorage.clear();
                                window.location.href = '/';
                            }} ><FontAwesomeIcon icon={faArrowRightFromBracket}/></button>
                        </div>
                    </div>
                </div>
                <div className="RightPanel" id='right_panel'>
                    <FontAwesomeIcon icon={faMessage} className='MessageWhenEmpty'/>
                    <div className='TopPanel' id='top_panel'>
                        <div className='TopPanelContent' id='top_panel_content'>
                            <button className='MenuButton' onClick={openMenu}><FontAwesomeIcon icon={faBars}/></button>
                            <div className='TopPanelThing'>
                                <img id='top_panel_avatar' src={logo} alt='avatar' onError={(e) => e.currentTarget.src='/logo512.png'}/>
                                <p id='top_panel_username'>username</p>
                            </div>
                        </div>
                    </div>
                    <div className='ContentPanel' id='content_panel'>
                        {messages.map((msg, i) => {
                            const prevMsg = messages[i - 1];
                            const nextMsg = messages[i + 1];

                            const isFirst = !prevMsg || prevMsg.author_id !== msg.author_id;
                            const isLast = !nextMsg || nextMsg.author_id !== msg.author_id;

                            return (
                                <Message
                                    key={msg.id}
                                    text={msg.text}
                                    type={msg.type}
                                    author={msg.author}
                                    src={`${address}/avatars/${msg.author_id}.webp`}
                                    connected={!isLast}
                                />
                            );
                        })}
                    </div>
                    <div className={`InputPanel ${lines > 1 ? 'expanded': ''}`} id='input_panel'>
                        <button className='InputButton AttachButton' onClick={attachImages}><FontAwesomeIcon icon={faPaperclip}/></button>
                        <textarea placeholder={t('message_placeholder')} onKeyDown={handleKeyDownForInput} className={`MessageInput ${lines > 1 ? 'expanded': ''}`} id='message_input' onInput={handleInput}/>
                        <button className='InputButton SendButton' onClick={sendMessage}><FontAwesomeIcon icon={faPaperPlane}/></button>
                    </div>
                </div>
            </div>
            <Popup title={<Trans>account</Trans>} name='account' disableCloseButton={true}>
                <div className="scrollable-y">
                    <p style={{ fontSize: '3svh' }}><Trans i18nKey={'account_required'}><a href='/signup' style={{ color: '#4f7afbff' }}>create</a><a href='/signin' style={{ color: '#4f7afbff' }}>log in</a></Trans></p>
                </div>
            </Popup>
            <Popup title={<Trans>chat_creation</Trans>} name='create-chat' scale={0.5}>
                <input placeholder={t('username_placeholder')} className='CreateChatNicknameInput' id='create_chat_nickname_input' onKeyDown={(event) => {if (event.key === 'Enter') createChat()}}/>
                <p id='create_chat_error' style={{ color: 'red',  fontSize: '12px' }} className='fade'>I Love Femboys :3</p>
                <button className='CreateChatConfirmButton'><FontAwesomeIcon icon={faArrowRight} onClick={createChat}/></button>
            </Popup>
            <ProfilePopup ref={ProfilePopupRef} src={`${address}/avatars/${localStorage.getItem('id')}.webp`} username={localStorage.getItem('username') || <Trans>guest</Trans>}/>
        </div>
    );
}

export default ChatPage;