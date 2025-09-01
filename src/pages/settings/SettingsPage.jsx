import { t } from 'i18next';
import '@/App.css';
import './SettingsPage.css';
import ProfileThing from '../../gui/profile_thing';
import { address } from '@/wsClient';
import { subscribeUser } from '../../push';
import { faArrowLeft, faGear, faMessage, faPencil, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';

function SettingsPage() {
    function uploadAvatar() {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";

        fileInput.onchange = () => {
            const file = fileInput.files[0];
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
        };

        fileInput.click();
    }

    function openMenu() {
        const left_panel = document.getElementById('left_panel');
        left_panel.classList.add('show');
        document.getElementById('right_panel').style.filter = 'blur(1px)';
        document.getElementById('menu_button').classList.add('hide');
    }

    useEffect(() => {
        setTimeout(() => {
            const menu_button = document.getElementById('menu_button');
            if (window.matchMedia("(orientation: portrait)").matches) menu_button.click();
        }, 100);
    }, []);

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

    return (
        <div className="App">
            <button className='BackButton' id='menu_button' onClick={openMenu}><FontAwesomeIcon icon={faArrowLeft}/></button>
            <div className="LeftPanel" id='left_panel'>
                <div className="SettingsPanel">
                    <ProfileThing text={t('back')} image={false} onClick={() => { location.href = '/' }}> <FontAwesomeIcon icon={faArrowLeft} /> </ProfileThing>
                    <ProfileThing text={t('profile')} image={false} onClick={() => { openSettingsScreen('ProfileSettings') }}>  <FontAwesomeIcon icon={faUser} /> </ProfileThing>
                    <ProfileThing text={t('messages')} image={false} onClick={() => { openSettingsScreen('MessagesSettings') }}>  <FontAwesomeIcon icon={faMessage} /> </ProfileThing>
                </div>
            </div>
            <div className="RightPanel Settings" id='right_panel'>
                <div className='SettingsScreens'>
                    <div className='SettingsScreen ProfileSettings hide'>
                        <div className='Profile'>
                            <div className='EditDiv' onClick={uploadAvatar}>
                                <img src={`${address}/avatars/${localStorage.getItem('id')}.webp`} onError={ (e) => e.currentTarget.src = '/logo512.png' } className='AvatarSettings' id='avatar_settings' />
                                <FontAwesomeIcon icon={faPencil} id='pencil' />
                            </div>
                            <p style={{ fontWeight: 'bold', fontSize: '28px' }}>{localStorage.getItem('username')}</p>
                        </div>
                    </div>
                    <div className='SettingsScreen MessagesSettings hide'>
                        <div className='thing'>
                            <ProfileThing text={t('subscribe_to_msges')} image={false} animation={false} onClick={subscribeUser}/>
                        </div>
                    </div>
                    <div className='SettingsScreen EmptySettings show'>
                        <FontAwesomeIcon icon={faGear} style={{ color: '#aaa', fontSize: '24vh', filter: 'blur(5px)' }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage;