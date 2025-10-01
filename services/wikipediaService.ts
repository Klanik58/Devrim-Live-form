const WIKIPEDIA_API_URL = (lang: 'tr' | 'en') => `https://${lang}.wikipedia.org/api/rest_v1/page/random/summary`;

export interface WikipediaSummary {
    title: string;
    extract: string;
    content_urls: {
        desktop: {
            page: string;
        }
    };
}

export const getRandomWikipediaArticle = async (lang: 'tr' | 'en'): Promise<WikipediaSummary | null> => {
    try {
        const response = await fetch(WIKIPEDIA_API_URL(lang));
        if (!response.ok) {
            throw new Error(`Wikipedia API request failed with status ${response.status}`);
        }
        const data: WikipediaSummary = await response.json();
        // Ensure extract is not too long
        if (data.extract.length > 800) {
            data.extract = data.extract.substring(0, 800) + '...';
        }
        return data;
    } catch (error) {
        console.error("Failed to fetch from Wikipedia API:", error);
        return null;
    }
};
