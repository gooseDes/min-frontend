import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './i18n';
import { urlBase64ToUint8Array } from './push';

const root = ReactDOM.createRoot(document.getElementById('root'));
if ("serviceWorker" in navigator && "PushManager" in window) {
    try {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            for (let reg of registrations) {
                reg.unregister().then(success => {
                console.log("SW removed:", success);
                });
            }
        });
        const reg = await navigator.serviceWorker.register("/sw.js", { type: 'module' });
        console.log("Service Worker registered");

        const subscription = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(
                import.meta.env.VITE_VAPID_PUBLIC
            ),
        });
    } catch (err) {
        console.log("Service is not registered:", err);
    }
}
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);