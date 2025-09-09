import { address } from "./wsClient";
import Pica from "pica";

export function getToken() {
    return localStorage.getItem('token');
}

export function isUserLogined() {
    return localStorage.getItem('token') != null;
}

export function openPopup(popupName) {
    const app = document.getElementById('app');
    app.style.filter = 'blur(2px)';
    const popup = document.getElementById(`${popupName}-popup`);
    if (popup) {
        popup.classList.remove('PopupHide');
        popup.style.display = 'flex';
        popup.classList.add('PopupShow');
    }
}

export function closePopup(popupName) {
    const popup = document.getElementById(`${popupName}-popup`);
    if (popup) {
        const app = document.getElementById('app');
        app.style.filter = 'blur(0)';
        popup.classList.remove('PopupShow');
        popup.classList.add('PopupHide');
        setTimeout(() => {
            popup.style.display = 'none';
        }, 300);
    }
}

export function showError(text) {
    window.setErrorPopup(
        text
    );
    openPopup('error');
}

export function verifyToken(token) {
    fetch(`${address}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token })
    }).then(response => {
        if (response.ok) {
            return true;
        } else {
            try {
                openPopup('account-popup');
            } catch (e) {}
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            localStorage.removeItem('username');
            return false;
        }
    });
}

export function loadFile(type='image', multiple=false, callback) {
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
        const file = fileInput.files[0];
        if (!file) return;
        callback([file]);
    };

    fileInput.click();
}

export const USERNAME_ALLOWED_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
export const EMAIL_ALLOWED_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@._-';
export const PASSWORD_ALLOWED_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-={}[]|;:"<>,.?/~`';

// Function for validating symbols in strings
export function validateString(str, type="username", minLength=3, maxLength=32) {
    let allowedChars = '';
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

export async function cropCenter(file, targetSize = 128) {
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
                ctx.drawImage(img, startX, startY, size, size, 0, 0, size, size);

                const pica = Pica();
                const finalCanvas = document.createElement("canvas");
                finalCanvas.width = targetSize;
                finalCanvas.height = targetSize;

                await pica.resize(cropCanvas, finalCanvas);
                finalCanvas.toBlob(blob => resolve(blob), "image/webp", 0.9);
            } catch (err) {
                reject(err);
            }
        };
        img.onerror = reject;
    });
}