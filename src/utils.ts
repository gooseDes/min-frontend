import { t } from "i18next";
import { address } from "./wsClient.js";
import Pica from "pica";
import i18n from "./i18n.js";

declare global {
    interface Window {
        setErrorPopup: (text: string) => void;
        process?: any;
    }
}

export function getToken() {
    return localStorage.getItem("token");
}

export function isUserLogined() {
    return localStorage.getItem("token") != null;
}

export function openPopup(popupName: string) {
    const app = document.getElementById("app");
    if (app) app.style.filter = "blur(2px)";
    const popup = document.getElementById(`${popupName}-popup`);
    if (popup) {
        popup.classList.remove("PopupHide");
        popup.style.display = "flex";
        popup.classList.add("PopupShow");
    }
}

export function closePopup(popupName: string) {
    const popup = document.getElementById(`${popupName}-popup`);
    if (popup) {
        const app = document.getElementById("app");
        if (app) app.style.filter = "blur(0)";
        popup.classList.remove("PopupShow");
        popup.classList.add("PopupHide");
        setTimeout(() => {
            popup.style.display = "none";
        }, 300);
    }
}

export function openDropdown(name: string, caller: HTMLElement) {
    const app = document.getElementById("app");
    if (app) app.style.filter = "blur(5px)";
    const dropdown = document.getElementById(`${name}-dropdown`);
    if (!dropdown) return;
    const rect = caller.getBoundingClientRect();
    dropdown.style.left = `${rect.right - rect.width / 2}px`;
    dropdown.style.bottom = `${window.innerHeight - (rect.top - rect.height / 2)}px`;
    dropdown.classList.add("open");
    function close() {
        closeDropdown(name);
        document.removeEventListener("click", close);
    }
    document.addEventListener("click", close);
}

export function toggleDropdown(name: string, caller: HTMLElement) {
    const dropdown = document.getElementById(`${name}-dropdown`);
    if (!dropdown) return;
    const rect = caller.getBoundingClientRect();
    dropdown.style.left = `${rect.right - rect.width / 2}px`;
    dropdown.style.bottom = `${window.innerHeight - (rect.top - rect.height / 2)}px`;
    dropdown.classList.toggle("open");
}

export function closeDropdown(name: string) {
    const dropdown = document.getElementById(`${name}-dropdown`);
    if (!dropdown) return;
    dropdown.classList.remove("open");
    const app = document.getElementById("app");
    if (app) app.style.filter = "";
}

export function showError(text: string) {
    window.setErrorPopup(text);
    openPopup("error");
}

export function verifyToken(token: string) {
    fetch(`${address}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token }),
    }).then((response) => {
        if (response.ok) {
            return true;
        } else {
            try {
                openPopup("account-popup");
            } catch (e) {}
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            localStorage.removeItem("username");
            return false;
        }
    });
}

export function loadFile(type: string = "image", multiple: boolean = false, callback: (files: File[]) => void) {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = `${type}/*`;
    fileInput.multiple = multiple;

    fileInput.onchange = () => {
        const files = fileInput.files;
        if (!files || files.length === 0) return;
        if (multiple) {
            callback(Array.from(files));
            return;
        }
        if (!files || files.length === 0) return;
        const file = files[0];
        if (!file) return;
        callback([file]);
    };

    fileInput.click();
}

export const USERNAME_ALLOWED_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-";
export const EMAIL_ALLOWED_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@._-";
export const PASSWORD_ALLOWED_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-={}[]|;:"<>,.?/~`';

// Function for validating symbols in strings
export function validateString(str: string, type: string = "username", minLength: number = 3, maxLength: number = 32) {
    let allowedChars = "";
    if (type === "username") allowedChars = USERNAME_ALLOWED_CHARS;
    else if (type === "email") allowedChars = EMAIL_ALLOWED_CHARS;
    else if (type === "password") allowedChars = PASSWORD_ALLOWED_CHARS;
    else throw new Error("Invalid type");

    if (str.length < minLength || str.length > maxLength) return false;
    for (let char of str) {
        if (!allowedChars.includes(char)) return false;
    }
    return true;
}

export async function cropCenter(file: any, targetSize: number = 128) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = async () => {
            try {
                const size = Math.min(img.width, img.height);
                const startX = (img.width - size) / 2;
                const startY = (img.height - size) / 2;

                const cropCanvas = document.createElement("canvas");
                cropCanvas.width = size;
                cropCanvas.height = size;
                const ctx = cropCanvas.getContext("2d");
                if (!ctx) return;
                ctx.drawImage(img, startX, startY, size, size, 0, 0, size, size);

                const pica = Pica();
                const finalCanvas = document.createElement("canvas");
                finalCanvas.width = targetSize;
                finalCanvas.height = targetSize;

                if (!pica) return;
                await pica.resize(cropCanvas, finalCanvas);
                finalCanvas.toBlob((blob) => resolve(blob), "image/webp", 0.9);
            } catch (err) {
                reject(err);
            }
        };
        img.onerror = reject;
    });
}

// Function for converting unix timestamp to human readable format e.g. 2025:09:31
export function formatTime(unixTimestamp: number, advanced: boolean = false) {
    const dateObject = new Date(unixTimestamp * 1000);

    const now = new Date(Date.now());

    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObject.getDate().toString().padStart(2, "0");
    const hours = dateObject.getHours().toString().padStart(2, "0");
    const minutes = dateObject.getMinutes().toString().padStart(2, "0");
    const seconds = dateObject.getSeconds().toString().padStart(2, "0");

    let formatted = null;

    if (now.getFullYear() == dateObject.getFullYear() && now.getMonth() == dateObject.getMonth() && Math.abs(now.getDate() - dateObject.getDate()) <= 1 && !advanced) {
        const today = now.getDate() == dateObject.getDate();
        formatted = `${today ? t("today") : `${now.getDate() >= dateObject.getDate() ? t("yesterday") : t("tommorow")}`} ${hours}:${minutes}${advanced ? `:${seconds}` : ""}`;
    } else {
        formatted = `${year}-${month}-${day} ${hours}:${minutes}${advanced ? `:${seconds}` : ""}`;
    }
    return formatted;
}

// Function that changes language of site
export function changeLang(lang: string) {
    if (lang == "") {
        localStorage.removeItem("lang");
        i18n.changeLanguage("");
        document.cookie = "lang=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } else localStorage.setItem("lang", lang);
    location.href = location.href;
}

// Check if site runs from electron or browser
export function isElectron() {
    return typeof navigator === "object" && typeof navigator.userAgent === "string" && navigator.userAgent.indexOf("Electron") >= 0;
}

// Function for locating between pages
export function goTo(path: string) {
    const loc = location.href;
    if (isElectron()) {
        const locWithoutLastPart = loc.substring(0, loc.lastIndexOf("#"));
        location.href = locWithoutLastPart + "#" + path;
    } else {
        const locWithoutLastPart = loc.substring(0, loc.lastIndexOf("/"));
        location.href = locWithoutLastPart + "/" + (path.startsWith("/") ? path.substring(1) : path);
    }
}
