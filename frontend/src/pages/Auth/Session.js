import appConfig from "../../config/appConfig";
import CryptoJS from "crypto-js";

export function setTokenWithExpiration(key, token) {
    const now = new Date();
    const expirationTime = now.getTime() + appConfig.expirationTime;

    const keyStr = "sangat-aman-12345";
    const iv = CryptoJS.lib.WordArray.random(16);
    const encryptedToken = CryptoJS.AES.encrypt(token, keyStr, {
        iv: iv,
    }).toString();

    const item = encryptedToken + "|" + expirationTime + "|" + iv.toString();
    localStorage.setItem(key, item);
}

export function getTokenWithExpiration(key) {
    const item = localStorage.getItem(key);

    if (!item) {
        return null;
    }

    const parts = item.split("|");
    const encryptedToken = parts[0];
    const expirationTime = parts[1];
    const iv = parts[2];

    const keyStr = "sangat-aman-12345";
    const decryptedToken = CryptoJS.AES.decrypt(encryptedToken, keyStr, {
        iv: CryptoJS.enc.Hex.parse(iv),
    }).toString(CryptoJS.enc.Utf8);

    if (parseInt(expirationTime) < new Date().getTime()) {
        localStorage.removeItem(key);
        return null;
    }

    return decryptedToken;
}

export function getTokenExpirationTime(key) {
    const item = localStorage.getItem(key);
    if (!item) {
        return null;
    }
    const [_, expirationTime] = item.split("|");
    const now = new Date();
    const remainingSeconds = Math.round(
        (expirationTime - now.getTime()) / 1000
    );
    return remainingSeconds > 0 ? remainingSeconds : null;
}
