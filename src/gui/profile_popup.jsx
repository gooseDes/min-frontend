import { useImperativeHandle, forwardRef, useState } from "react";
import "../App.css";
import "./profile_popup.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "react-router-dom";
import { t } from "i18next";
import PulloutButton from "./pullout_button";
import { AnimatePresence, motion } from "framer-motion";

const ProfilePopup = forwardRef(({ id = "", src = "./logo512.png", username = "" }, ref) => {
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
        <AnimatePresence>
            {isShown == true && (
                <motion.div initial={{ y: "110%" }} animate={{ y: 0 }} exit={{ y: "-110%" }} className={`ProfilePopup`} id={id}>
                    <div className="ProfilePopupHeader">
                        <p>{`${t("profile")}: ${username}`}</p>
                        <button
                            className="CloseButton"
                            onClick={() => {
                                searchParams.delete("profile");
                                setSearchParams(searchParams);
                                setIsShown(false);
                            }}
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                    <div className="ProfilePopupContent">
                        <img src={src} alt="logo" className="ProfilePopupAvatar" onError={(e) => (e.currentTarget.src = "./logo512.png")} />
                        <p className="ProfilePopupUsername">{username}</p>
                        <div className="Filler" />
                        <div className="ProfilePopupBottom">
                            {username != localStorage.getItem("username") ? <PulloutButton text={t("send_message")} icon={faMessage} onClick={openChat} /> : <div />}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
});

export default ProfilePopup;
