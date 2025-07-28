export function getToken() {
    return localStorage.getItem('token');
}

export function isUserLogined() {
    return localStorage.getItem('token') != null;
}

export function openPopup(popupId) {
    const app = document.getElementById('app');
    app.style.filter = 'blur(2px)';
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.classList.remove('popup-hide');
        popup.style.display = 'flex';
        popup.classList.add('popup-show');
    }
}

export function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        const app = document.getElementById('app');
        app.style.filter = 'blur(0)';
        popup.classList.remove('popup-show');
        popup.classList.add('popup-hide');
        setTimeout(() => {
            popup.style.display = 'none';
        }, 300);
    }
}

export function showError(text) {
    if (!document.getElementById('error-popup')) {
        const popup = document.createElement('div');
        popup.classList.add('popup');
        popup.id = 'error-popup';
        document.body.appendChild(popup);
        const header = document.createElement('div');
        header.classList.add('popup-header');
        header.style.color = 'red';
        header.textContent = 'Error';
        popup.appendChild(header);
        const content = document.createElement('div');
        content.classList.add('popup-content');
        popup.appendChild(content);
        const error = document.createElement('p');
        error.id = 'popup-error-p';
        error.textContent = text;
        content.appendChild(error);
        const close = document.createElement('button');
        close.classList.add('popup-close');
        close.onclick = () => {closePopup('error-popup')};
        content.appendChild(close);
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fa-solid');
        closeIcon.classList.add('fa-xmark');
        close.appendChild(closeIcon);
    } else  {
        document.getElementById('popup-error-p').textContent = text;
    }
    openPopup('error-popup');
}