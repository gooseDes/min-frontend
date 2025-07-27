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