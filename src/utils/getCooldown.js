const cooldowns = new Map();
const DEFAULT_COOLDOWN = 20; // Cooldown in seconds

function isOnCooldown(userId) {
    const expiresAt = cooldowns.get(userId);
    const now = Date.now();

    if (expiresAt && now < expiresAt) {
        return Math.ceil((expiresAt - now) / 1000); // Remaining time in seconds
    }

    cooldowns.delete(userId); // Cleanup if expired
    return null;
}

function setCooldown(userId) {
    const expiresAt = Date.now() + DEFAULT_COOLDOWN * 1000; // Convert seconds to ms
    cooldowns.set(userId, expiresAt);
}

module.exports = { isOnCooldown, setCooldown };