import { t } from 'i18next';
import './App.css';
import ProfileThing from './gui/profile_thing';
import { address } from './wsClient';
import { subscribeUser } from './push';

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
                console.error("Eror loading avatar:", err);
            });
        };

        fileInput.click();
    }

    return (
        <div className="App">
            <div className="LeftPanel" id='left_panel'>
                <ProfileThing text={t('upload_avatar')} image={false} onClick={uploadAvatar}/>
                <ProfileThing text={t('subscribe_to_msges')} image={false} onClick={subscribeUser}/>
            </div>
            <div className="RightPanel" id='right_panel'></div>
        </div>
    )
}

export default SettingsPage;