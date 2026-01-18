import { useAuth } from '../context/AuthContext';

export const useGenderedLanguage = () => {
    const { user } = useAuth();
    const gender = user?.gender || 'female'; // Default to female for Mendonça Dreams

    const isMale = gender === 'male';

    const t = (feminine: string, masculine: string) => {
        return isMale ? masculine : feminine;
    };

    /**
     * Translates common gendered terms in Portuguese
     * @param term The key term to translate
     */
    const translate = (term: 'welcome' | 'thanks' | 'client' | 'stylist' | 'she' | 'woman') => {
        switch (term) {
            case 'welcome':
                return t('Bem-vinda', 'Bem-vindo');
            case 'thanks':
                return t('Obrigada', 'Obrigado');
            case 'client':
                return t('cliente', 'cliente'); // "Cliente" is neutral in PT, but can be gendered in context like "a cliente" vs "o cliente"
            case 'stylist':
                return t('consultora', 'consultor');
            case 'she':
                return t('ela', 'ele');
            case 'woman':
                return t('mulher', 'homem');
            default:
                return '';
        }
    };

    return {
        gender,
        isMale,
        t,
        translate
    };
};
