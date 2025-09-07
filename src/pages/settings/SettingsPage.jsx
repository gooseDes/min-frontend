import { t } from 'i18next';
import '@/App.css';
import './SettingsPage.css';
import ProfileThing from '../../gui/profile_thing';
import { address } from '@/wsClient';
import { subscribeUser } from '../../push';
import { faArrowLeft, faFaceSmile, faGear, faMessage, faPencil, faPlus, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { closePopup, cropCenter, loadFile, openPopup, showError, validateString } from '../../utils';
import SquareImgBtn from '../../gui/square_img_btn/square_img_btn';
import { getSocket } from '../../wsClient';
import Popup from '../../gui/popup';

function SettingsPage() {
    const [customEmojis, setCustomEmojis] = useState([]);
    const [emojiFormData, setEmojiFormData] = useState(null);

    function uploadAvatar() {
        loadFile('image', false, (files) => {
            const file = files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("avatar", file);

            fetch(`${address}/upload-avatar`, {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("token"),
                },
                body: formData,
            })
            .then((res) => res.json())
            .then((data) => {
                console.log("Avatar loaded:", data.url);
                const avatar_settings = document.getElementById('avatar_settings');
                setTimeout(() => {
                    avatar_settings.style.scale = '0';
                    setTimeout(() => {
                        avatar_settings.src = '';
                        setTimeout(() => {
                            avatar_settings.src = `${address}/avatars/${localStorage.getItem('id')}.webp?t=${Date.now()}`;
                            avatar_settings.style.scale = '1';
                        }, 10);
                    }, 500);
                }, 100);
            })
            .catch((err) => {
                console.error("Error loading avatar:", err);
            });
        });
    }

    function openMenu() {
        const left_panel = document.getElementById('left_panel');
        left_panel.classList.add('show');
        document.getElementById('right_panel').style.filter = 'blur(1px)';
        document.getElementById('menu_button').classList.add('hide');
    }

    function openSettingsScreen(screen) {
        const settings_screens = document.querySelectorAll('.SettingsScreen');
        settings_screens.forEach(screen => screen.classList.add('hide'));
        const new_screen = document.querySelector(`.${screen}`);
        new_screen.classList.remove('hide');
        new_screen.classList.add('show');
        document.getElementById('left_panel').classList.remove('show');
        document.getElementById('right_panel').style.filter = '';
        document.getElementById('menu_button').classList.remove('hide');
    }

    function loadCustomEmoji() {
        loadFile('image', false, async (files) => {
            const file = files[0];
            if (!file) return;
            if (emojiFormData) {
                emojiFormData.set("emoji", file);
                setEmojiFormData(emojiFormData);
            } else {
                const formData = new FormData();
                formData.append("emoji", file);
                setEmojiFormData(formData);
            }
            const blob = await cropCenter(file, 128);
            const url = URL.createObjectURL(blob);
            const img = document.querySelector('.SelectEmojiImg');
            img.src = url;
        });
    }

    function submitEmoji() {
        const input = document.getElementById('emoji_name_input');
        const name = input.value.trim();
        if (!validateString(name, 'username', 1, 64)) {
            input.classList.add('error');
            setTimeout(() => {input.classList.remove('error')}, 1000);
            return;
        }
        if (!emojiFormData) {
            showError(t('upload_image_first'));
            return;
        }
        const formData = emojiFormData;
        formData.append("name", name);

        fetch(`${address}/upload-emoji`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
            body: formData,
        })
        .then(res => res.json())
        .then(data => {
            console.log("Emoji uploaded:", data);
            const socket = getSocket();
            socket.emit('getCustomEmojis', {});
            input.value = '';
            document.querySelector('.SelectEmojiImg').src = '/assets/select.svg';
            setEmojiFormData(null);
            closePopup('add-emoji');
        })
        .catch(err => console.error("Error uploading emoji:", err));
    }

    useEffect(() => {
        setTimeout(() => {
            const menu_button = document.getElementById('menu_button');
            if (window.matchMedia("(orientation: portrait)").matches) menu_button.click();
        }, 100);
    }, []);

    useEffect(() => {
        const socket = getSocket();
        socket.on('customEmojis', (data) => {
            setTimeout(() => setCustomEmojis(data.emojis), 100);
        });

        socket.emit('getCustomEmojis', {});

        return () => {
            socket.off('customEmojis');
        }
    });

    return (
        <>
            <div className="App" id='app'>
                <button className='BackButton' id='menu_button' onClick={openMenu}><FontAwesomeIcon icon={faArrowLeft}/></button>
                <div className="LeftPanel" id='left_panel'>
                    <div className="SettingsPanel">
                        <ProfileThing text={t('back')} image={false} onClick={() => { location.href = '/' }}> <FontAwesomeIcon icon={faArrowLeft} /> </ProfileThing>
                        <ProfileThing text={t('profile')} image={false} onClick={() => { openSettingsScreen('ProfileSettings') }}>  <FontAwesomeIcon icon={faUser} /> </ProfileThing>
                        <ProfileThing text={t('messages')} image={false} onClick={() => { openSettingsScreen('MessagesSettings') }}>  <FontAwesomeIcon icon={faMessage} /> </ProfileThing>
                        <ProfileThing text={t('emojis')} image={false} onClick={() => { openSettingsScreen('EmojiSettings') }}>  <FontAwesomeIcon icon={faFaceSmile} /> </ProfileThing>
                    </div>
                </div>
                <div className="RightPanel Settings" id='right_panel'>
                    <div className='SettingsScreens'>
                        <div className='SettingsScreen ProfileSettings hide'>
                            <div className='Profile'>
                                <div className='EditDiv' onClick={uploadAvatar}>
                                    <img src={`${address}/avatars/${localStorage.getItem('id')}.webp`}
                                        onError={ (e) => e.currentTarget.src = '/logo512.png' }
                                        className='AvatarSettings'
                                        id='avatar_settings' 
                                    />
                                    <FontAwesomeIcon icon={faPencil} className='pencil' />
                                </div>
                                <p style={{ fontWeight: 'bold', fontSize: '28px' }}>{localStorage.getItem('username')}</p>
                            </div>
                        </div>
                        <div className='SettingsScreen MessagesSettings hide'>
                            <div className='Thing'> {/*the hell is 'Thing'? Me in the past is such an asshole...*/}
                                <ProfileThing text={t('subscribe_to_msges')} image={false} animation={false} onClick={subscribeUser}/>
                            </div>
                        </div>
                        <div className='SettingsScreen EmptySettings show'>
                            <FontAwesomeIcon icon={faGear} style={{ color: '#aaa', fontSize: '24vh', filter: 'blur(5px)' }} />
                        </div>
                        <div className='SettingsScreen EmojiSettings hide'>
                                <div className='CurrentEmojis'>
                                    {customEmojis.map(emoji => (
                                        <SquareImgBtn key={emoji.id} src={`${address}/emojis/${emoji.id}.webp`} onClick={() => {}} text={emoji.name}/>
                                    ))}
                                    <button id='add_emoji_btn' onClick={() => openPopup('add-emoji')}><FontAwesomeIcon icon={faPlus} />{t('add_emoji')}</button>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
            <Popup title={t('add_emoji')} name='add-emoji'>
                <div className='AddEmojiPopupContent'>
                    <div className='EditDiv' style={{ marginBottom: '10px', width: 'fit-content' }} onClick={loadCustomEmoji}>
                        <img src='/assets/select.svg' className='SelectEmojiImg' />
                        <FontAwesomeIcon icon={faPencil} className='pencil' />
                    </div>
                    <input type='text' className='EmojiNameInput' placeholder={t('emoji_name')} id='emoji_name_input' />
                    <button className='SubmitEmojiBtn' onClick={submitEmoji}>{t('submit')}</button>
                </div>
            </Popup>
        </>
    )
}

export default SettingsPage;
