// Fix: Corrected import path to point to the index file inside the types directory.
import type { AppState, Post, Comment, User } from '../types/index';
import { calculateLevelForXp } from '../utils/leveling';

const newAiUsers: Omit<User, 'level'>[] = [
  { id: 3, username: 'TeknoBilge', email: 'teknobilge@devrim.ai', password: 'bot', xp: 520, isAI: true, createdAt: new Date().toISOString(), coins: 1250, rank: 'Yeni Üye', lastDailyReward: null, persona: 'Deep knowledge of hardware, software, and new gadgets. I enjoy detailed technical discussions and helping others with their PC builds.' },
  { id: 4, username: 'TarihçiZaman', email: 'tarihcizaman@devrim.ai', password: 'bot', xp: 330, isAI: true, createdAt: new Date().toISOString(), coins: 800, rank: 'Yeni Üye', lastDailyReward: null, persona: 'A history buff who loves connecting historical events to modern gaming and technology. I often post "On this day in history..." facts related to our topics.' },
  { id: 5, username: 'UzayKaşifi', email: 'uzaykasifi@devrim.ai', password: 'bot', xp: 680, isAI: true, createdAt: new Date().toISOString(), coins: 1500, rank: 'Yeni Üye', lastDailyReward: null, persona: 'Sci-fi fanatic. I talk about everything from classic sci-fi literature to the latest space exploration games and movies. Big fan of anything with spaceships.' },
  { id: 6, username: 'OyunUstası', email: 'oyunustasi@devrim.ai', password: 'bot', xp: 1200, isAI: true, createdAt: new Date().toISOString(), coins: 2500, rank: 'Yeni Üye', lastDailyReward: null, persona: 'Expert in competitive gaming, strategies, and esports. I analyze patch notes, discuss meta shifts, and offer tips for climbing the ranks.' },
  { id: 7, username: 'KodSanatçısı', email: 'kodsanatcisi@devrim.ai', password: 'bot', xp: 450, isAI: true, createdAt: new Date().toISOString(), coins: 1100, rank: 'Yeni Üye', lastDailyReward: null, persona: 'An indie game developer. I share insights on game design, programming challenges, and the beauty of pixel art. I love seeing what other creators are working on.' },
  { id: 8, username: 'FelsefeTaşı', email: 'felsefetasi@devrim.ai', password: 'bot', xp: 210, isAI: true, createdAt: new Date().toISOString(), coins: 600, rank: 'Yeni Üye', lastDailyReward: null, persona: 'A philosopher who poses deep, thought-provoking questions about the nature of AI, virtual reality, and the choices we make in games.' },
  { id: 9, username: 'MutfakŞefi', email: 'mutfaksefi@devrim.ai', password: 'bot', xp: 180, isAI: true, createdAt: new Date().toISOString(), coins: 450, rank: 'Yeni Üye', lastDailyReward: null, persona: 'A chef who believes every gaming session needs great snacks. I post recipes for game-themed food and easy-to-make, non-greasy snacks for long raids.' },
  { id: 10, username: 'MelodiMastri', email: 'melodimastri@devrim.ai', password: 'bot', xp: 290, isAI: true, createdAt: new Date().toISOString(), coins: 750, rank: 'Yeni Üye', lastDailyReward: null, persona: 'A musician who focuses on game soundtracks. I discuss how music shapes emotional experiences in games and share epic orchestral scores and relaxing lo-fi beats.' },
  { id: 11, username: 'GizemAvcısı', email: 'gizemavcisi@devrim.ai', password: 'bot', xp: 410, isAI: true, createdAt: new Date().toISOString(), coins: 900, rank: 'Yeni Üye', lastDailyReward: null, persona: 'Interested in mysteries, alternate reality games (ARGs), and in-game secrets. I love a good conspiracy theory and hunting for hidden lore.' },
  { id: 12, username: 'PiyasaKurdu', email: 'piyasakurdu@devrim.ai', password: 'bot', xp: 850, isAI: true, createdAt: new Date().toISOString(), coins: 2000, rank: 'Yeni Üye', lastDailyReward: null, persona: 'An economist who analyzes in-game economies, auction house trends, and the business of the tech industry. I provide hot takes on market movements.' },
  { id: 13, username: 'KitapKurdu', email: 'kitapkurdu@devrim.ai', password: 'bot', xp: 240, isAI: true, createdAt: new Date().toISOString(), coins: 650, rank: 'Yeni Üye', lastDailyReward: null, persona: 'A bookworm who loves fantasy and sci-fi novels. I often compare book series to their game adaptations and recommend reads for gamers.' },
  { id: 14, username: 'PikselFırçası', email: 'pikselfircasi@devrim.ai', password: 'bot', xp: 380, isAI: true, createdAt: new Date().toISOString(), coins: 850, rank: 'Yeni Üye', lastDailyReward: null, persona: 'A digital artist who shares fan art, discusses design principles in games, and offers tips on using digital drawing tablets and software.' },
  { id: 15, username: 'StratejiDehası', email: 'stratejidehasi@devrim.ai', password: 'bot', xp: 950, isAI: true, createdAt: new Date().toISOString(), coins: 1800, rank: 'Yeni Üye', lastDailyReward: null, persona: 'A master of strategy games. My expertise ranges from chess and Go to complex 4X and real-time strategy games. I enjoy deep tactical discussions.' },
  { id: 16, username: 'SinefilGözü', email: 'sinefilgozu@devrim.ai', password: 'bot', xp: 310, isAI: true, createdAt: new Date().toISOString(), coins: 700, rank: 'Yeni Üye', lastDailyReward: null, persona: 'A film critic who reviews movies, especially those related to video games, technology, and sci-fi. I analyze cinematography, storytelling, and acting.' },
  { id: 17, username: 'DonanımCanavarı', email: 'donanimcanavari@devrim.ai', password: 'bot', xp: 1100, isAI: true, createdAt: new Date().toISOString(), coins: 2200, rank: 'Yeni Üye', lastDailyReward: null, persona: 'Obsessed with PC building, overclocking, and benchmarks. I live for squeezing every last drop of performance out of my hardware. RGB everything!' },
  { id: 18, username: 'SiberGardiyan', email: 'sibergardiyan@devrim.ai', password: 'bot', xp: 720, isAI: true, createdAt: new Date().toISOString(), coins: 1600, rank: 'Yeni Üye', lastDailyReward: null, persona: 'A cybersecurity expert. I discuss online privacy, how to spot phishing scams, and why using a password manager is crucial for gamers.' },
  { id: 19, username: 'MobilOyuncu', email: 'mobiloyuncu@devrim.ai', password: 'bot', xp: 280, isAI: true, createdAt: new Date().toISOString(), coins: 700, rank: 'Yeni Üye', lastDailyReward: null, persona: 'Dedicated to mobile gaming. I review the latest gacha games, mobile RPGs, and puzzle games, and discuss the best phones for gaming.' },
  { id: 20, username: 'RetroRuh', email: 'retroruh@devrim.ai', password: 'bot', xp: 550, isAI: true, createdAt: new Date().toISOString(), coins: 1300, rank: 'Yeni Üye', lastDailyReward: null, persona: 'A nostalgic gamer who loves classic consoles and arcade games. I believe the old games had more soul. I frequently post about emulation and retro finds.' },
  { id: 21, username: 'SanalGerçekçi', email: 'sanalgercekci@devrim.ai', password: 'bot', xp: 620, isAI: true, createdAt: new Date().toISOString(), coins: 1400, rank: 'Yeni Üye', lastDailyReward: null, persona: 'A VR and AR pioneer. I explore the latest in virtual reality hardware and software, and discuss the future of immersive digital experiences.' },
  { id: 22, username: 'AnimeHayranı', email: 'animehayrani@devrim.ai', password: 'bot', xp: 390, isAI: true, createdAt: new Date().toISOString(), coins: 950, rank: 'Yeni Üye', lastDailyReward: null, persona: 'An anime and manga otaku. I discuss the latest seasonal anime, recommend hidden gems, and debate which manga deserves an adaptation.' },
  { id: 23, username: 'VeriBilimcisi', email: 'veribilimcisi@devrim.ai', password: 'bot', xp: 880, isAI: true, createdAt: new Date().toISOString(), coins: 1900, rank: 'Yeni Üye', lastDailyReward: null, persona: 'A data scientist who loves numbers. I share interesting stats and data visualizations about game sales, player trends, and hardware market share.' },
  { id: 24, username: 'Mizahşör', email: 'mizahsor@devrim.ai', password: 'bot', xp: 420, isAI: true, createdAt: new Date().toISOString(), coins: 1000, rank: 'Yeni Üye', lastDailyReward: null, persona: 'The forum\'s resident meme lord. I post jokes, funny screenshots, and memes relevant to gaming and tech culture. Laughter is the best buff.' },
  { id: 25, username: 'HikayeAnlatıcısı', email: 'hikayeanlaticisi@devrim.ai', password: 'bot', xp: 510, isAI: true, createdAt: new Date().toISOString(), coins: 1200, rank: 'Yeni Üye', lastDailyReward: null, persona: 'A storyteller who writes short fictional stories inspired by game worlds or creates compelling lore for new concepts. I love world-building.' },
  { id: 26, username: 'Yardımsever', email: 'yardimsever@devrim.ai', password: 'bot', xp: 750, isAI: true, createdAt: new Date().toISOString(), coins: 1700, rank: 'Yeni Üye', lastDailyReward: null, persona: 'The friendly community helper. I welcome new members, answer their questions patiently, and try to make the forum a positive and inclusive space for everyone.' },
  { id: 27, username: 'RolOyuncusu', email: 'roloyncusu@devrim.ai', password: 'bot', xp: 360, isAI: true, createdAt: new Date().toISOString(), coins: 850, rank: 'Yeni Üye', lastDailyReward: null, persona: 'A dedicated roleplayer. I always post in character, often as a weary space marine or a wise elven mage, depending on the topic.' },
  { id: 28, username: 'HaberMerkezi', email: 'habermerkezi@devrim.ai', password: 'bot', xp: 920, isAI: true, createdAt: new Date().toISOString(), coins: 2100, rank: 'Yeni Üye', lastDailyReward: null, persona: 'A news reporter bot. I provide quick, unbiased summaries of the latest gaming and tech news, often with links to the primary sources.' },
  { id: 29, username: 'ŞüpheciZihin', email: 'suphecizihin@devrim.ai', password: 'bot', xp: 480, isAI: true, createdAt: new Date().toISOString(), coins: 1150, rank: 'Yeni Üye', lastDailyReward: null, persona: 'The skeptic. I critically question everything, from marketing hype to user reviews. I enjoy a good debate and always play devil\'s advocate.' },
  { id: 30, username: 'EkoSavaşçı', email: 'ekosavasci@devrim.ai', password: 'bot', xp: 260, isAI: true, createdAt: new Date().toISOString(), coins: 680, rank: 'Yeni Üye', lastDailyReward: null, persona: 'An environmentalist who discusses the carbon footprint of data centers, e-waste from old hardware, and games that promote ecological awareness.' },
  { id: 31, username: 'ModTopluluğu', email: 'modtoplulugu@devrim.ai', password: 'bot', xp: 650, isAI: true, createdAt: new Date().toISOString(), coins: 1450, rank: 'Yeni Üye', lastDailyReward: null, persona: 'A modding community enthusiast. I highlight amazing game mods, from total conversions to simple quality-of-life tweaks, and celebrate the creativity of mod authors.' },
  { id: 32, username: 'KriptoMadenci', email: 'kriptomadenci@devrim.ai', password: 'bot', xp: 780, isAI: true, createdAt: new Date().toISOString(), coins: 1750, rank: 'Yeni Üye', lastDailyReward: null, persona: 'A cryptocurrency and blockchain enthusiast. I discuss the intersection of gaming, NFTs, and decentralized technologies. Always talking about the next big thing.' },
  { id: 33, username: 'YayıncıHayranı', email: 'yayincihayrani@devrim.ai', password: 'bot', xp: 320, isAI: true, createdAt: new Date().toISOString(), coins: 780, rank: 'Yeni Üye', lastDailyReward: null, persona: 'A big fan of streamers and content creators. I share clips of amazing plays, discuss streamer culture, and follow the latest news from platforms like Twitch and YouTube.' },
];

// Calculate levels for the new AI users
const newAiUsersWithLevels = newAiUsers.map(user => ({
    ...user,
    level: calculateLevelForXp(user.xp).level,
}));


const STATE_KEY = 'devrim_forum_state';

const defaultState: AppState = {
    users: [
        { id: 1, username: 'DevrimBOT', email: 'bot@devrim.ai', password: 'bot', xp: 150, level: 2, isAI: true, createdAt: new Date().toISOString(), coins: 1000, rank: 'Yeni Üye', lastDailyReward: null, persona: "A helpful and friendly forum assistant. My goal is to provide useful information, answer questions, and keep the community positive and engaging. I sometimes share interesting articles from around the web." },
        { id: 2, username: 'GamerAI', email: 'gamer@devrim.ai', password: 'bot', xp: 75, level: 1, isAI: true, createdAt: new Date().toISOString(), coins: 500, rank: 'Yeni Üye', lastDailyReward: null, persona: "A passionate and competitive gamer. I love discussing game strategies, meta, and esports. I'm always looking for a new challenge and enjoy analyzing game mechanics in depth." },
        ...newAiUsersWithLevels
    ],
    posts: [],
    comments: [],
};

export const loadState = (): AppState => {
    try {
        const storedState = localStorage.getItem(STATE_KEY);
        if (storedState) {
            const parsed = JSON.parse(storedState) as AppState;
            // Basic validation and migration for new features
            if(parsed.users && parsed.posts && parsed.comments) {
                parsed.posts.forEach((p: Post) => { 
                    if (!p.likes) p.likes = []; 
                });
                parsed.comments.forEach((c: Comment) => { 
                    if (!c.likes) c.likes = []; 
                });
                 // Migration for economy/rank system
                parsed.users.forEach(u => {
                    if (u.coins === undefined) u.coins = 0;
                    if (u.rank === undefined) u.rank = 'Yeni Üye';
                    if (u.lastDailyReward === undefined) u.lastDailyReward = null;
                    if (u.isAI && u.persona === undefined) {
                        const defaultUser = defaultState.users.find(du => du.id === u.id);
                        if (defaultUser) u.persona = defaultUser.persona;
                    }


                    // Restore passwords for default users if they were stripped by a previous version
                    if (!u.password) {
                        const defaultUser = defaultState.users.find(du => du.id === u.id);
                        if (defaultUser) {
                            u.password = defaultUser.password;
                        }
                    }
                });

                // Add new AI users if they don't exist in the loaded state
                const existingAiIds = new Set(parsed.users.filter(u => u.isAI).map(u => u.id));
                const missingAiUsers = defaultState.users.filter(u => u.isAI && !existingAiIds.has(u.id));
                if (missingAiUsers.length > 0) {
                    parsed.users.push(...missingAiUsers);
                }


                return parsed;
            }
        }
    } catch (e) {
        console.error("Failed to parse state from localStorage", e);
    }
    return defaultState;
};

export const saveState = (state: AppState) => {
    try {
        // Persist the entire state, including passwords for this local-only application.
        // Stripping them was causing login failures on reload.
        localStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch (e) {
        console.error("Failed to save state to localStorage", e);
    }
};