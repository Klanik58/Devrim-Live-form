export interface Rank {
    key: string;
    level: number;
    cost: number;
}

export const RANKS: Rank[] = [
    { key: 'rank_new_member', level: 1, cost: 0 },
    { key: 'rank_senior_member', level: 5, cost: 500 },
    { key: 'rank_master', level: 15, cost: 2500 },
    { key: 'rank_legend', level: 30, cost: 10000 },
];

export const getRankByKey = (key: string): Rank | undefined => {
    return RANKS.find(r => r.key === key);
}

export const getRankIndex = (key: string): number => {
    return RANKS.findIndex(r => r.key === key);
}

export const getNextRank = (currentRankKey: string): Rank | null => {
    const currentIndex = getRankIndex(currentRankKey);
    if (currentIndex > -1 && currentIndex < RANKS.length - 1) {
        return RANKS[currentIndex + 1];
    }
    return null;
}
