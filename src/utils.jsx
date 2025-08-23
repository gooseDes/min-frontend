import { address } from "./wsClient";

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