import { formatDistanceToNow } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';

const dateLocales = { tr, en: enUS };

export const formatDate = (dateString: string, lang: 'tr' | 'en') => {
    try {
        return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: dateLocales[lang] });
    } catch (error) {
        console.error("Error formatting date:", dateString, error);
        return dateString;
    }
};
