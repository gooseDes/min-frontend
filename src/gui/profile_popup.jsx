import { useImperativeHandle, forwardRef, useState } from "react";
import "../App.css";
import "./profile_popup.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "react-router-dom";
import { t } from "i18next";
import PulloutButton from "./pullout_button";

const ProfilePopup = forwardRef(({ id = "", src = "/logo512.png", username = "" }, ref) => {
    const [isShown, setIsShown] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    useImperativeHandle(ref, () => ({
        show: () => setIsShown(true),
        hide: () => setIsShown(false),
    }));

    function openChat() {
        searchParams.delete("profile");
        setSearchParams(searchParams);
        window.openChat(username);
        setIsShown(false);
    }

    return (
        <div className={`ProfilePopup${isShown ? " show" : ""}`} id={id}>
            <div className="ProfilePopupHeader">
                <p>{`${t("profile")}: ${username}`}</p>
                <button
                    className="CloseButton"
                    onClick={() => {
                        setIsShown(false);
                        searchParams.delete("profile");
                        setSearchParams(searchParams);
                    }}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>
            </div>
            <div className="ProfilePopupContent">
                <img src={src} alt="logo" className="ProfilePopupAvatar" onError={(e) => (e.currentTarget.src = "/logo512.png")} />
                <p className="ProfilePopupUsername">{username}</p>
                <div className="Filler" />
                <div className="ProfilePopupBottom">{username != localStorage.getItem("username") ? <PulloutButton text={t("send_message")} icon={faMessage} onClick={openChat} /> : <div />}</div>
            </div>
        </div>
    );
});

export default ProfilePopup;
