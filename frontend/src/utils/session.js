import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = "sangat-aman-12345";
const EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour

export function setTokenWithExpiration(key, token) {
    const now = new Date();
    const expirationTime = now.getTime() + EXPIRATION_TIME;

    const iv = CryptoJS.lib.WordArray.random(16);
    const encryptedToken = CryptoJS.AES.encrypt(token, ENCRYPTION_KEY, {
        iv,
    }).toString();

    const item = `${encryptedToken}|${expirationTime}|${iv.toString()}`;
    localStorage.setItem(key, item);
}

export function getTokenWithExpiration(key) {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const [encryptedToken, expirationTime, iv] = item.split("|");

    if (parseInt(expirationTime) < Date.now()) {
        localStorage.removeItem(key);
        return null;
    }

    const decryptedToken = CryptoJS.AES.decrypt(
        encryptedToken,
        ENCRYPTION_KEY,
        {
            iv: CryptoJS.enc.Hex.parse(iv),
        }
    ).toString(CryptoJS.enc.Utf8);

    return decryptedToken;
}

export function getTokenExpirationTime(key) {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const [, expirationTime] = item.split("|");
    const remainingSeconds = Math.round((expirationTime - Date.now()) / 1000);
    return remainingSeconds > 0 ? remainingSeconds : null;
}

export function removeToken(key = "token") {
    localStorage.removeItem(key);
}
