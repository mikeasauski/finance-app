import { LucideIcon, Zap, Droplets, Wifi, Smartphone, Tv, Music, ShoppingBag } from "lucide-react";

export type BrandType = 'bank' | 'utility' | 'streamer' | 'other';

export interface Brand {
    id: string;
    name: string;
    type: BrandType;
    color: string;
    textColor: 'white' | 'black';
    logoUrl?: string; // URL for external logo
    icon?: any; // Lucide icon fallback
}

export const BRANDS: Brand[] = [
    // --- BANKS ---
    {
        id: 'nubank',
        name: 'Nubank',
        type: 'bank',
        color: '#820AD1',
        textColor: 'white',
        logoUrl: 'https://logo.clearbit.com/nubank.com.br'
    },
    {
        id: 'itau',
        name: 'Itaú',
        type: 'bank',
        color: '#EC7000',
        textColor: 'white',
        logoUrl: 'https://logo.clearbit.com/itau.com.br'
    },
    {
        id: 'bradesco',
        name: 'Bradesco',
        type: 'bank',
        color: '#CC092F',
        textColor: 'white',
        logoUrl: 'https://logo.clearbit.com/bradesco.com.br'
    },
    {
        id: 'santander',
        name: 'Santander',
        type: 'bank',
        color: '#EC0000',
        textColor: 'white',
        logoUrl: 'https://logo.clearbit.com/santander.com.br'
    },
    {
        id: 'bb',
        name: 'Banco do Brasil',
        type: 'bank',
        color: '#FBFD00',
        textColor: 'black',
        logoUrl: 'https://logo.clearbit.com/bb.com.br'
    },
    {
        id: 'inter',
        name: 'Inter',
        type: 'bank',
        color: '#FF7A00',
        textColor: 'white',
        logoUrl: 'https://logo.clearbit.com/bancointer.com.br'
    },
    {
        id: 'c6',
        name: 'C6 Bank',
        type: 'bank',
        color: '#242424',
        textColor: 'white',
        logoUrl: 'https://logo.clearbit.com/c6bank.com.br'
    },
    {
        id: 'btg',
        name: 'BTG Pactual',
        type: 'bank',
        color: '#00204D',
        textColor: 'white',
        logoUrl: 'https://logo.clearbit.com/btgpactual.com'
    },
    {
        id: 'xp',
        name: 'XP Investimentos',
        type: 'bank',
        color: '#000000',
        textColor: 'white',
        logoUrl: 'https://logo.clearbit.com/xpi.com.br'
    },

    // --- UTILITIES ---
    {
        id: 'enel',
        name: 'Enel',
        type: 'utility',
        color: '#00A551',
        textColor: 'white',
        logoUrl: 'https://logo.clearbit.com/enel.com.br',
        icon: Zap
    },
    {
        id: 'sabesp',
        name: 'Sabesp',
        type: 'utility',
        color: '#0085CA',
        textColor: 'white',
        logoUrl: 'https://logo.clearbit.com/sabesp.com.br',
        icon: Droplets
    },
    {
        id: 'cpfl',
        name: 'CPFL',
        type: 'utility',
        color: '#0054A6',
        textColor: 'white',
        logoUrl: 'https://logo.clearbit.com/cpfl.com.br',
        icon: Zap
    },
    {
        id: 'tim',
        name: 'TIM',
        type: 'utility',
        color: '#003692',
        textColor: 'white',
        logoUrl: 'https://logo.clearbit.com/tim.com.br',
        icon: Smartphone
    },
    {
        id: 'vivo',
        name: 'Vivo',
        type: 'utility',
        color: '#660099',
        textColor: 'white',
        logoUrl: 'https://logo.clearbit.com/vivo.com.br',
        icon: Smartphone
    },
    {
        id: 'claro',
        name: 'Claro',
        type: 'utility',
        color: '#EF282C',
        textColor: 'white',
        logoUrl: 'https://logo.clearbit.com/claro.com.br',
        icon: Smartphone
    },
    {
        id: 'net',
        name: 'NET',
        type: 'utility',
        color: '#00AEEF',
        textColor: 'white',
        logoUrl: 'https://logo.clearbit.com/net.com.br',
        icon: Wifi
    },

    // --- STREAMERS & SUBSCRIPTIONS ---
    {
        id: 'netflix',
        name: 'Netflix',
        type: 'streamer',
        color: '#E50914',
        textColor: 'white',
        logoUrl: 'https://logo.clearbit.com/netflix.com',
        icon: Tv
    },
    {
        id: 'spotify',
        name: 'Spotify',
        type: 'streamer',
        color: '#1DB954',
        textColor: 'black',
        logoUrl: 'https://logo.clearbit.com/spotify.com',
        icon: Music
    },
    {
        id: 'amazon',
        name: 'Amazon Prime',
        type: 'streamer',
        color: '#00A8E1',
        textColor: 'white',
        logoUrl: 'https://logo.clearbit.com/amazon.com',
        icon: ShoppingBag
    },
    {
        id: 'disney',
        name: 'Disney+',
        type: 'streamer',
        color: '#113CCF',
        textColor: 'white',
        logoUrl: 'https://logo.clearbit.com/disneyplus.com',
        icon: Tv
    },
    {
        id: 'hbo',
        name: 'HBO Max',
        type: 'streamer',
        color: '#5D2E86',
        textColor: 'white',
        logoUrl: 'https://logo.clearbit.com/hbomax.com',
        icon: Tv
    },
    {
        id: 'globoplay',
        name: 'Globoplay',
        type: 'streamer',
        color: '#FF3815',
        textColor: 'white',
        logoUrl: 'https://logo.clearbit.com/globoplay.globo.com',
        icon: Tv
    },
    {
        id: 'youtube',
        name: 'YouTube Premium',
        type: 'streamer',
        color: '#FF0000',
        textColor: 'white',
        logoUrl: 'https://logo.clearbit.com/youtube.com',
        icon: Tv
    }
];

export const getBrandById = (id: string) => BRANDS.find(b => b.id === id);
export const getBrandsByType = (type: BrandType) => BRANDS.filter(b => b.type === type);
