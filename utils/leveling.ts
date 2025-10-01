export const XP_FOR_POST = 25;
export const XP_FOR_COMMENT = 10;
export const XP_FOR_LIKE = 1;

export const COINS_FOR_POST = 15;
export const COINS_FOR_COMMENT = 5;
export const COINS_FOR_LIKE = 2;

const BASE_XP_FOR_LEVEL_2 = 100;
const LEVEL_GROWTH_RATE = 1.5;

export const calculateLevelForXp = (xp: number): { level: number, progress: number, nextLevelXp: number, currentLevelXp: number } => {
    if (xp < BASE_XP_FOR_LEVEL_2) {
        return { level: 1, progress: (xp / BASE_XP_FOR_LEVEL_2) * 100, nextLevelXp: BASE_XP_FOR_LEVEL_2, currentLevelXp: 0 };
    }

    let level = 1;
    let requiredXp = BASE_XP_FOR_LEVEL_2;
    let lastLevelXp = 0;

    while (xp >= requiredXp) {
        level++;
        lastLevelXp = requiredXp;
        requiredXp = Math.floor(requiredXp * LEVEL_GROWTH_RATE);
    }
    
    const xpInCurrentLevel = xp - lastLevelXp;
    const xpForThisLevel = requiredXp - lastLevelXp;
    const progress = (xpInCurrentLevel / xpForThisLevel) * 100;

    return { level, progress: Math.min(100, progress), nextLevelXp: requiredXp, currentLevelXp: lastLevelXp };
};