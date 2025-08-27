import { t } from 'i18next';
import './App.css';
import './SettingsPage.css';
import ProfileThing from './gui/profile_thing';
import { address } from './wsClient';
import { subscribeUser } from './push';
import { faBars } from '@fortawesome/free-solid-svg-icons';
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
                window.location.href = window.location.href;
            })
            .catch((err) => {
                console.error("Error loading avatar:", err);
            });
        };

        fileInput.click();
    }

    function openMenu() {
        const left_panel = document.getElementById('left_panel');
        left_panel.style.translate = '10px 10px'; 
        left_panel.style.width = 'calc(100vw - 40px)';
        left_panel.style.opacity = '1';
        document.getElementById('right_panel').style.filter = 'blur(1px)';
    }

    useEffect(() => {
        const menu_button = document.getElementById('menu_button')
        if (menu_button.style.opacity)
        menu_button.click();
    }, []);

    return (
        <div className="App">
            <div className="LeftPanel" id='left_panel'>
                <ProfileThing text={t('upload_avatar')} image={false} onClick={uploadAvatar}/>
                <ProfileThing text={t('subscribe_to_msges')} image={false} onClick={subscribeUser}/>
            </div>
            <div className="RightPanel" id='right_panel'>
                <button className='MenuButton' id='menu_button' onClick={openMenu}><FontAwesomeIcon icon={faBars}/></button>
            </div>
        </div>
    )
}

export default SettingsPage;