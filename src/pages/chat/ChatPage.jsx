import "@/App.css";
import "./ChatPage.css";
import ProfileThing from "../../gui/profile_thing";
import Message from "@/gui/message/message";
import logo from "@/logo.png";
import { useState, useEffect, useRef } from "react";
import { closePopup, isUserLogined, loadFile, openPopup, showError, validateString, verifyToken } from "@/utils";
import { address, getSocket } from "@/wsClient.js";
import ProfilePopup from "../../gui/profile_popup";
import { faArrowRight, faArrowRightFromBracket, faBars, faGear, faMessage, faPaperclip, faPaperPlane, faPhone, faPlus, faReply, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Popup from "../../gui/popup";
import { useLocation, useSearchParams } from "react-router-dom";
import { Trans } from "react-i18next";
import { t } from "i18next";
import Dropdown from "../../gui/dropdown/dropdown";
import { goTo, isElectron, openDropdown } from "../../utils";
import { motion } from "framer-motion";
import TransitionButton from "../../gui/transition_btn/transition_btn";
import Icon from "../../gui/icon";
import VoiceThing from "../../gui/voice_thing/VoiceThing";

function ChatPage() {
    const [messages, setMessages] = useState([]);
    const messagesRef = useRef(messages);
    const [lastMessages, setLastMessages] = useState([]);
    const [chats, setChats] = useState([]);
    const [lines, setLines] = useState(1);
    const [customEmojis, setCustomEmojis] = useState([]);
    const [isInVoiceChat, setIsInVoiceChat] = useState(false);

    var inited = useRef(false);
    var lastSended = useRef("");
    var animateFrom = useRef(-1);
    var isWaitingForHistory = useRef(false);
    var isWaitingForAdditionalHistory = useRef(false);
    const ProfilePopupRef = useRef();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const messageCount = useRef(-1);
    const messagePrefix = useRef("");
    const selectedMessage = useRef(null);

    window.openChat = (username) => {
        searchParams.set("chat", username);
        searchParams.delete("profile");
        setSearchParams(searchParams);
    };

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    useEffect(() => {
        verifyToken(localStorage.getItem("token"));
        const socket = getSocket();

        localStorage.removeItem("chatId");

        // Binding things to socket commands
        socket.on("connect", (data) => {
            console.log("Connected to server");
        });

        socket.on("message", (data) => {
            if (data.author === localStorage.getItem("username")) data.author = "You";
            if (data.chat === (localStorage.getItem("chatId") || 1))
                setMessages((prev) => [
                    ...prev,
                    {
                        id: data.id,
                        text: data.text,
                        type: data.author == "You" ? "right" : "left",
                        author: data.author,
                        author_id: data.author_id,
                        sent_at: data.sent_at,
                        seen: data.seen,
                        shown: true,
                        anim_delay: false,
                    },
                ]);
            messageCount.current += 1;
            if (isElectron() && data.author !== "You") {
                window.api.notify(data.author, data.text, `${address}/avatars/${data.author_id}.webp`);
            }
        });

        socket.on("history", (data) => {
            if (isWaitingForHistory.current) {
                setMessages(
                    data.messages
                        .slice()
                        .reverse()
                        .map((msg) => ({
                            id: msg.id,
                            text: msg.text,
                            type: msg.author === localStorage.getItem("username") ? "right" : "left",
                            author: msg.author === localStorage.getItem("username") ? "You" : msg.author,
                            author_id: msg.author_id,
                            sent_at: msg.sent_at,
                            seen: msg.seen,
                            shown: false,
                            anim_delay: true,
                        })),
                );
                messageCount.current = data.messages.length;
                animateFrom.current = data.messages.length;
                isWaitingForHistory.current = false;
                setTimeout(() => {
                    const content_panel = document.getElementById("content_panel");
                    content_panel.scrollTop = content_panel.scrollTop;
                    const content_panel_children = Array.from(content_panel.children);
                    for (let i = 0; i < content_panel_children.length; i++) {
                        content_panel.scrollTop += content_panel_children[i].getBoundingClientRect().height * 1000;
                    }
                    messagesRef.current.reverse().forEach((_, i) => {
                        setMessages((prev) => {
                            const copy = [...prev].reverse();
                            if (copy[i]) copy[i].shown = true;
                            return copy.reverse();
                        });
                    });
                }, 100);
                socket.emit("seenAll", {
                    chat: localStorage.getItem("chatId") || 1,
                });
            } else if (isWaitingForAdditionalHistory.current) {
                setMessages((prev) => [
                    ...data.messages.map((msg) => ({
                        id: msg.id,
                        text: msg.text,
                        type: msg.author === localStorage.getItem("username") ? "right" : "left",
                        author: msg.author === localStorage.getItem("username") ? "You" : msg.author,
                        author_id: msg.author_id,
                        sent_at: msg.sent_at,
                        seen: msg.seen,
                        shown: true,
                        anim_delay: false,
                    })),
                    ...prev,
                ]);
                messageCount.current += data.messages.length;
                isWaitingForHistory.current = false;
            }
        });

        socket.on("chats", (data) => {
            setChats(() => data.chats);
        });

        socket.on("createChatResult", (data) => {
            if (data.success) {
                closePopup("create-chat");
                console.log("gettings chats");
                socket.emit("getChats", {});
            } else {
                const createError = document.getElementById("create_chat_error");
                createError.textContent = data.msg;
                createError.classList.remove("fade");
                setTimeout(() => {
                    createError.classList.add("fade");
                }, 1500);
            }
        });

        socket.on("customEmojis", (data) => {
            setCustomEmojis(data.emojis);
        });

        socket.on("seenAll", (data) => {
            for (let i = 0; i < messages.length; i++) {
                messages[i].seen = data.chat == (localStorage.getItem("chatId") || 1) ? true : msg.seen;
            }
        });

        socket.on("deleteMessage", (data) => {
            setMessages((prev) => {
                const copy = [...prev];
                const i = copy.findIndex((msg) => msg.id === data.message);
                if (i !== -1) {
                    copy.splice(i, 1);
                }
                return copy;
            });

            requestAnimationFrame(() => {
                Array.from(document.getElementById("content_panel").children).forEach((msg) => {
                    msg.classList.add("show");
                });
            });
        });

        socket.on("error", (data) => {
            console.error(`Error: ${data}`);
            showError(data.msg);
        });

        setInterval(() => {
            if (localStorage.getItem("justLoggedIn")) {
                window.location.reload(true);
                localStorage.removeItem("justLoggedIn");
            }
        }, 1000);

        return () => {
            socket.off("message");
            socket.off("history");
            socket.off("chats");
            socket.off("createChatResult");
            socket.off("seenAll");
            socket.off("deleteMessage");
            socket.off("error");
        };
    }, []);

    useEffect(() => {
        const initialMessages = [];
        for (let i = 0; i < 100; i++) {
            initialMessages.push({
                id: i,
                text: `Message ${i}! Lorem ipsum, epta, idi nahui`,
                type: Math.random() < 0.5 ? "left" : "right",
            });
        }
        setMessages(initialMessages);
        function setRealVh() {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty("--vh", `${vh}px`);
        }

        window.addEventListener("resize", setRealVh);
        window.addEventListener("load", setRealVh);
        setRealVh();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            if (!isUserLogined()) {
                setTimeout(() => openPopup("account"), 500);
                localStorage.clear();
            }
        }, 100);

        // Watching for changes
        const content_panel = document.getElementById("content_panel");
        const observer = new ResizeObserver((entries) => {
            setTimeout(() => {
                content_panel.scrollTop += 1000000;
            }, 100);
        });
        observer.observe(content_panel);
    }, []);

    useEffect(() => {
        if (!inited.current) return;
        const content_panel = document.getElementById("content_panel");
        const content_panel_children = Array.from(content_panel?.children || []);

        let scrollBy = 0;

        if (lastMessages.length !== 0) {
            for (let i = animateFrom.current; i < content_panel_children.length; i++) {
                scrollBy += content_panel_children[i].getBoundingClientRect().height * 1000;
                requestAnimationFrame(() => {
                    content_panel_children[i].classList.add("slow");
                    content_panel_children[i].classList.add("show");
                });
            }
        }

        let behavior = "smooth";
        if (lastMessages.length === 0) behavior = "instant";

        content_panel.scrollTo({
            top: content_panel.scrollTop + scrollBy,
            behavior: behavior,
        });
        setLastMessages(messages);
    }, [messages]);

    useEffect(() => {
        const socket = getSocket();
        console.log("getting chats");
        socket.emit("getChats", {});
    }, []);

    useEffect(() => {
        const profile = searchParams.get("profile");
        if (profile) {
            window.openProfilePopup(profile);
            searchParams.delete("profile");
            setSearchParams(searchParams);
        }
        const chat = searchParams.get("chat");
        if (chat) {
            const socket = getSocket();

            function open(id, username) {
                localStorage.setItem("chatId", id);
                openChat(username);
                searchParams.delete("chat");
                setSearchParams(searchParams);
            }

            socket.on("getChatWithResult", (data) => {
                if (data.chatId == -1) {
                    socket.on("createChatResult", (data) => {
                        if (success) {
                            open(data.chatId, chat);
                        }
                        socket.off("createChatResult");
                    });
                } else {
                    socket.off("getChatWithResult");
                    open(data.chatId, chat);
                }
            });
            socket.emit("getChatWith", { name: chat });
        }
    }, [location, searchParams]);

    useEffect(() => {
        const handlePaste = (event) => {
            const items = event.clipboardData.items;
            for (const item of items) {
                if (item.type.startsWith("image/")) {
                    const pastedFile = item.getAsFile();
                    uploadAttachments([pastedFile]);
                }
            }
        };

        const input = document.getElementById("message_input");
        input.addEventListener("paste", handlePaste);
        return () => input.removeEventListener("paste", handlePaste);
    }, []);

    function sendMessage() {
        const input = document.getElementById("message_input");
        let value = input.value;
        if (value.trim() === "") return;
        const splitted = value.split(":");
        for (let i = 0; i < splitted.length - 1; i++) {
            if (validateString(splitted[i], "username", 1, 64) && customEmojis.find((emoji) => emoji.name === splitted[i])) {
                splitted[i] = `![${splitted[i]}](${address}/emojis/${customEmojis.find((emoji) => emoji.name === splitted[i]).id}.webp)`;
            }
        }
        console.log(splitted);
        value = splitted.join(":");
        input.value = "";
        setLines(1);
        const socket = getSocket();
        socket.emit("msg", {
            text: messagePrefix.current + value,
            chat: localStorage.getItem("chatId") || 1,
        });
        lastSended.current = value;
        messagePrefix.current = "";
    }

    function openChat(username) {
        setMessages([]);
        requestAnimationFrame(() => {
            isWaitingForHistory.current = true;
            requestAnimationFrame(() => {
                const socket = getSocket();
                socket.emit("getChatHistory", {
                    chat: localStorage.getItem("chatId") || 1,
                });
            });
        });
        document.getElementById("left_panel").classList.remove("show");
        const right_panel = document.getElementById("right_panel");
        right_panel.style.gap = "10px";
        right_panel.style.filter = "";
        document.getElementById("top_panel").classList.add("shown");
        document.getElementById("content_panel").classList.add("shown");
        document.getElementById("input_panel").classList.add("shown");
        document.getElementById("top_panel_username").textContent = username;
        document.getElementById("call_button").classList.add("shown");
        const socket = getSocket();
        socket.on("userInfo", (data) => {
            document.getElementById("top_panel_avatar").src = `${address}/avatars/${data.user?.id}.webp`;
            socket.off("userInfo");
        });
        socket.emit("getUserInfo", { name: username });
        Array.from(document.getElementById("top_panel_content").children).forEach((el) => {
            el.style.translate = "0 0";
        });
        Array.from(document.getElementById("input_panel").children).forEach((el) => {
            el.style.translate = "0 0";
        });
        document.querySelectorAll(".MessageWhenEmpty").forEach((el) => {
            el.classList.add("fade-down");
        });
        inited.current = true;
    }

    function openMenu() {
        document.getElementById("left_panel").classList.add("show");
        document.getElementById("right_panel").style.filter = "blur(1px)";
    }

    function openUserProfile() {
        ProfilePopupRef.current.show();
    }

    function createChat() {
        const input = document.getElementById("create_chat_nickname_input");
        const socket = getSocket();
        socket.emit("createChat", { nickname: input.value.replace("@", "") });
    }

    function uploadAttachments(files) {
        fetch(`${address}/attach`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: (() => {
                const formData = new FormData();
                files.forEach((file) => {
                    formData.append("attachments", file);
                });
                return formData;
            })(),
        })
            .then((responce) => responce.json())
            .then((data) => {
                if (data.success) {
                    const input = document.getElementById("message_input");
                    input.value += " " + data.urls.map((att) => `![attachment](${address}${att})`).join(" ");
                    input.focus();
                } else {
                    showError(data.msg);
                }
            });
    }

    function attachImages() {
        try {
            loadFile("image", true, (files) => {
                uploadAttachments(files);
            });
        } catch (e) {
            showError(e.message);
        }
    }

    function loadMoreMessages() {
        const socket = getSocket();
        isWaitingForAdditionalHistory.current = true;
        socket.emit("getChatHistory", {
            chat: localStorage.getItem("chatId"),
            currentMessages: messageCount.current,
        });
    }

    const handleInput = (e) => {
        const value = e.target.value;
        const count = value.split("\n").length;
        setLines(count);
    };

    const handleKeyDownForInput = (e) => {
        const input = document.getElementById("message_input");
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

    useEffect(() => {
        setTimeout(() => {
            const socket = getSocket();
            console.log("getting chats");
            socket.emit("getChats", {});
            socket.emit("getCustomEmojis", {});
        }, 10000);
    });

    return (
        <div>
            <div className="App" id="app">
                <div className="LeftPanel" id="left_panel">
                    <div className="ChatsHeader">
                        <p className="ChatsTitle">{t("chats")}</p>
                        <button className="ChatPlusButton" onClick={() => openPopup("create-chat")}>
                            <Icon icon={faPlus} />
                        </button>
                    </div>
                    <div className="ChatsPanel" id="chats_panel">
                        <ProfileThing
                            text={t("default_chat")}
                            onClick={() => {
                                localStorage.setItem("chatId", 1);
                                openChat("Default Chat");
                            }}
                        />
                        {chats.map((chat) => {
                            const other = chat.participants.find((el) => el.id != localStorage.getItem("id"));
                            return (
                                <ProfileThing
                                    text={chat.name}
                                    onClick={() => {
                                        localStorage.setItem("chatId", chat.id);
                                        openChat(chat.name);
                                    }}
                                    src={`${address}/avatars/${other?.id}.webp`}
                                    key={chat.id}
                                />
                            );
                        })}
                    </div>
                    <div className="UserPanel" id="user_panel">
                        <div className="UserPanelContent" id="user_panel_content">
                            <ProfileThing
                                text={localStorage.getItem("username") || t("guest")}
                                onClick={openUserProfile}
                                animation={false}
                                src={`${address}/avatars/${localStorage.getItem("id")}.webp`}
                            />
                            <TransitionButton
                                onClick={() => {
                                    goTo("settings");
                                }}
                            >
                                <Icon icon={faGear} />
                            </TransitionButton>
                            <button
                                className="UserControlButton logout"
                                onClick={() => {
                                    localStorage.clear();
                                    goTo("/");
                                }}
                            >
                                <Icon icon={faArrowRightFromBracket} />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="RightPanel" id="right_panel">
                    <Icon icon={faMessage} className="MessageWhenEmpty" />
                    <VoiceThing active={isInVoiceChat} />
                    <div className="TopPanel" id="top_panel">
                        <div className="TopPanelContent" id="top_panel_content">
                            <button className="MenuButton" onClick={openMenu}>
                                <Icon icon={faBars} />
                            </button>
                            <div className="TopPanelThing">
                                <img id="top_panel_avatar" src={logo} alt="avatar" onError={(e) => (e.currentTarget.src = "./logo512.png")} />
                                <p id="top_panel_username">username</p>
                            </div>
                            <div className="CallButton" id="call_button" onClick={() => setIsInVoiceChat(true)}>
                                <Icon icon={faPhone} />
                            </div>
                        </div>
                    </div>
                    <div className="ContentPanel" id="content_panel">
                        <div className="LoadMoreMessagesDiv">
                            {messageCount.current >= 99 && (
                                <motion.button
                                    className="LoadMoreMessagesButton"
                                    onClick={loadMoreMessages}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ type: "tween" }}
                                >
                                    {t("load_more_messages")}
                                </motion.button>
                            )}
                        </div>
                        {messages.map((msg, i) => {
                            const prevMsg = messages[i - 1];
                            const nextMsg = messages[i + 1];

                            const isFirst = !prevMsg || prevMsg.author_id !== msg.author_id;
                            const isLast = !nextMsg || nextMsg.author_id !== msg.author_id;

                            return (
                                <Message
                                    id={msg.id}
                                    key={msg.id}
                                    text={msg.text}
                                    type={msg.type}
                                    author={msg.author}
                                    sent_at={msg.sent_at}
                                    seen={msg.seen}
                                    shown={msg.shown}
                                    anim_delay={msg.anim_delay}
                                    src={`${address}/avatars/${msg.author_id}.webp`}
                                    connected={!isLast}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        selectedMessage.current = msg;
                                        openDropdown("msg", e.currentTarget);
                                    }}
                                    messages={messages}
                                />
                            );
                        })}
                        <div style={{ opacity: 0, height: "100px" }} />
                    </div>
                    <div className={`InputPanel ${lines > 1 ? "expanded" : ""}`} id="input_panel">
                        <button className="InputButton AttachButton" onClick={attachImages}>
                            <Icon icon={faPaperclip} />
                        </button>
                        <textarea
                            placeholder={t("message_placeholder")}
                            onKeyDown={handleKeyDownForInput}
                            className={`MessageInput ${lines > 1 ? "expanded" : ""}`}
                            id="message_input"
                            onInput={handleInput}
                        />
                        <button className="InputButton SendButton" onClick={sendMessage}>
                            <Icon icon={faPaperPlane} />
                        </button>
                    </div>
                </div>
            </div>
            <Popup title={t("account")} name="account" disableCloseButton={true}>
                <div className="scrollable-y">
                    <p style={{ fontSize: "3svh" }}>
                        <Trans i18nKey={"account_required"}>
                            <a onClick={() => goTo("signup")} style={{ color: "#4f7afbff", textDecoration: "underline", cursor: "pointer" }}>
                                create
                            </a>
                            <a onClick={() => goTo("signin")} style={{ color: "#4f7afbff", textDecoration: "underline", cursor: "pointer" }}>
                                log in
                            </a>
                        </Trans>
                    </p>
                </div>
            </Popup>
            <Popup title={t("chat_creation")} name="create-chat" scale={0.5}>
                <input
                    placeholder={t("username_placeholder")}
                    className="CreateChatNicknameInput"
                    id="create_chat_nickname_input"
                    onKeyDown={(event) => {
                        if (event.key === "Enter") createChat();
                    }}
                />
                <p id="create_chat_error" style={{ color: "red", fontSize: "12px" }} className="fade">
                    I Love Femboys :3
                </p>
                <button className="CreateChatConfirmButton">
                    <Icon icon={faArrowRight} onClick={createChat} />
                </button>
            </Popup>
            <ProfilePopup ref={ProfilePopupRef} src={`${address}/avatars/${localStorage.getItem("id")}.webp`} username={localStorage.getItem("username") || t("guest")} />
            <Dropdown name="msg">
                <div className="noanim">{t("message_actions")}</div>
                <div
                    onClick={() => {
                        messagePrefix.current = `/reply ${selectedMessage.current.id}\n`;
                        selectedMessage.current = null;
                    }}
                >
                    <Icon icon={faReply} />
                    <p>{t("reply")}</p>
                </div>
                <div
                    onClick={() => {
                        const socket = getSocket();
                        socket.emit("deleteMessage", { message: selectedMessage.current.id });
                        selectedMessage.current = null;
                    }}
                >
                    <Icon icon={faTrashCan} />
                    <p>{t("delete")}</p>
                </div>
            </Dropdown>
        </div>
    );
}

export default ChatPage;
