export function setTokenWithExpiration(key, token) {
    const now = new Date();
    const expirationTime = now.getTime() + 60 * 60 * 1000;
    const item = token + "|" + expirationTime;
    localStorage.setItem(key, item);
}

export function getTokenWithExpiration(key) {
    const item = localStorage.getItem(key);
    if (!item) {
        return null;
    }
    const [token, expirationTime] = item.split("|");
    const now = new Date();
    if (now.getTime() > expirationTime) {
        localStorage.removeItem(key);
        return null;
    }
    return token;
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
