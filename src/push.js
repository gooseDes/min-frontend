import { address } from "./wsClient";

export async function subscribeUser() {
    if ("serviceWorker" in navigator && "PushManager" in window) {
        try {
            const reg = await navigator.serviceWorker.getRegistration("/sw.js");

            const subscription = await reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    import.meta.env.VITE_VAPID_PUBLIC
                ),
            });

            console.log("Got subscription:", subscription);

            await fetch(`${address}/subscribe`, {
                method: "POST",
                body: JSON.stringify({
                    subscription: subscription,
                    token: localStorage.getItem('token')
                }),
                headers: { "Content-Type": "application/json" },
            });

            console.log("Subscription sent to server ✅");
        } catch (err) {
            console.error("Push subscription error:", err);
        }
    } else {
        console.warn("Push messaging is not supported in this browser :(");
    }
}

export function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = atob(base64);
    return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}