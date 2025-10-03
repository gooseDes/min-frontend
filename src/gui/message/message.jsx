import { useSearchParams } from "react-router-dom";
import "./message.css";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatTime } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faReply } from "@fortawesome/free-solid-svg-icons";
import { t } from "i18next";
import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";

function Message({
    id = -1,
    text = "message",
    author = "author",
    type = "left",
    src = "./logo512.png",
    connected = false,
    sent_at = null,
    seen = false,
    shown = false,
    messages = [],
    anim_delay = true,
    onContextMenu,
}) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isShown, setIsShown] = useState(shown);
    const controls = useAnimationControls();

    function calculateDelay() {
        if (!anim_delay) return 0;
        const index_from_end = messages.length - messages.indexOf(messages.find((msg) => msg.id === id));
        const delay = index_from_end < 25 ? index_from_end * 0.05 : 0;
        return delay;
    }

    useEffect(() => {
        setIsShown(shown);
        if (shown) {
            controls.start({
                opacity: 1,
                translateX: 0,
                transition: { delay: calculateDelay() },
            });
        }
    }, [shown]);

    function openAuthorProfile() {
        searchParams.set("profile", author == "You" ? localStorage.getItem("username") : author);
        setSearchParams(searchParams);
    }

    function handleImageClick(src) {
        window.openImageOverlay(src);
    }

    function formatReplyText(msg) {
        try {
            return `${msg.author}: ${msg.text}`;
        } catch {
            return t("old_message");
        }
    }

    function convertText(text) {
        if (text[0] != "/") return text.replaceAll("\n", "  \n");
        else {
            return text.slice(text.indexOf("\n"));
        }
    }

    const handleClick = async () => {
        await controls.start({
            y: -10,
            transition: {
                type: "tween",
                duration: 0.1,
                ease: "easeOut",
            },
        });

        await controls.start({
            y: 0,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 10,
                mass: 1.2,
            },
        });
    };

    return (
        <motion.div className={`MessageDiv ${type}`} initial={{ translateX: type === "left" ? "-35vh" : "35vh" }} animate={controls}>
            <img className={`MessageAvatar${connected ? " connected" : ""}`} src={src} onError={(e) => (e.currentTarget.src = "./logo512.png")} draggable="false" onClick={openAuthorProfile} />
            <div className={`TextDiv ${type}`} onContextMenu={onContextMenu} onClick={handleClick}>
                <div className="Author" onClick={openAuthorProfile}>
                    {author}
                </div>
                {text[0] == "/" ? (
                    <div className="MessageReply">
                        <p>
                            <FontAwesomeIcon icon={faReply} />
                            {formatReplyText(messages.find((msg) => msg.id == parseInt(text.split(" ")[1])))}
                        </p>
                    </div>
                ) : (
                    <div />
                )}
                <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        img: ({ node, ...props }) => (
                            <img
                                {...props}
                                style={{ cursor: "pointer", maxWidth: "100%" }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleImageClick(props.src);
                                }}
                            />
                        ),
                    }}
                >
                    {convertText(text)}
                </Markdown>
                <div className="MessageAdditionsDiv">
                    <p className="DateText">{formatTime(sent_at)}</p>
                    {seen && type == "right" ? <FontAwesomeIcon icon={faCheck} /> : <p />}
                </div>
            </div>
        </motion.div>
    );
}

export default Message;
