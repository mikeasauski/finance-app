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
        logoUrl: 'https://www.google.com/s2/favicons?domain=nubank.com.br&sz=128'
    },
    {
        id: 'itau',
        name: 'Itaú',
        type: 'bank',
        color: '#EC7000',
        textColor: 'white',
        logoUrl: 'https://www.google.com/s2/favicons?domain=itau.com.br&sz=128'
    },
    {
        id: 'bradesco',
        name: 'Bradesco',
        type: 'bank',
        color: '#CC092F',
        textColor: 'white',
        logoUrl: 'https://www.google.com/s2/favicons?domain=bradesco.com.br&sz=128'
    },
    {
        id: 'santander',
        name: 'Santander',
        type: 'bank',
        color: '#EC0000',
        textColor: 'white',
        logoUrl: 'https://www.google.com/s2/favicons?domain=santander.com.br&sz=128'
    },
    {
        id: 'bb',
        name: 'Banco do Brasil',
        type: 'bank',
        color: '#FBFD00',
        textColor: 'black',
        logoUrl: 'https://www.google.com/s2/favicons?domain=bb.com.br&sz=128'
    },
    {
        id: 'inter',
        name: 'Inter',
        type: 'bank',
        color: '#FF7A00',
        textColor: 'white',
        logoUrl: 'https://www.google.com/s2/favicons?domain=bancointer.com.br&sz=128'
    },
    {
        id: 'c6',
        name: 'C6 Bank',
        type: 'bank',
        color: '#242424',
        textColor: 'white',
        logoUrl: 'https://www.google.com/s2/favicons?domain=c6bank.com.br&sz=128'
    },
    {
        id: 'btg',
        name: 'BTG Pactual',
        type: 'bank',
        color: '#00204D',
        textColor: 'white',
        logoUrl: 'https://www.google.com/s2/favicons?domain=btgpactual.com&sz=128'
    },
    {
        id: 'xp',
        name: 'XP Investimentos',
        type: 'bank',
        color: '#000000',
        textColor: 'white',
        logoUrl: 'https://www.google.com/s2/favicons?domain=xpi.com.br&sz=128'
    },

    // --- UTILITIES ---
    {
        id: 'enel',
        name: 'Enel',
        type: 'utility',
        color: '#00A551',
        textColor: 'white',
        logoUrl: 'https://www.google.com/s2/favicons?domain=enel.com.br&sz=128',
        icon: Zap
    },
    {
        id: 'sabesp',
        name: 'Sabesp',
        type: 'utility',
        color: '#0085CA',
        textColor: 'white',
        logoUrl: 'https://www.google.com/s2/favicons?domain=sabesp.com.br&sz=128',
        icon: Droplets
    },
    {
        id: 'cpfl',
        name: 'CPFL',
        type: 'utility',
        color: '#0054A6',
        textColor: 'white',
        logoUrl: 'https://www.google.com/s2/favicons?domain=cpfl.com.br&sz=128',
        icon: Zap
    },
    {
        id: 'tim',
        name: 'TIM',
        type: 'utility',
        color: '#003692',
        textColor: 'white',
        logoUrl: 'https://www.google.com/s2/favicons?domain=tim.com.br&sz=128',
        icon: Smartphone
    },
    {
        id: 'vivo',
        name: 'Vivo',
        type: 'utility',
        color: '#660099',
        textColor: 'white',
        logoUrl: 'https://www.google.com/s2/favicons?domain=vivo.com.br&sz=128',
        icon: Smartphone
    },
    {
        id: 'claro',
        name: 'Claro',
        type: 'utility',
        color: '#EF282C',
        textColor: 'white',
        logoUrl: 'https://www.google.com/s2/favicons?domain=claro.com.br&sz=128',
        icon: Smartphone
    },
    {
        id: 'net',
        name: 'NET',
        type: 'utility',
        color: '#00AEEF',
        textColor: 'white',
        logoUrl: 'https://www.google.com/s2/favicons?domain=net.com.br&sz=128',
        icon: Wifi
    },

    // --- STREAMERS & SUBSCRIPTIONS ---
    {
        id: 'netflix',
        name: 'Netflix',
        type: 'streamer',
        color: '#E50914',
        textColor: 'white',
        logoUrl: 'https://www.google.com/s2/favicons?domain=netflix.com&sz=128',
        icon: Tv
    },
    {
        id: 'spotify',
        name: 'Spotify',
        type: 'streamer',
        color: '#1DB954',
        textColor: 'black',
        logoUrl: 'https://www.google.com/s2/favicons?domain=spotify.com&sz=128',
        icon: Music
    },
    {
        id: 'amazon',
        name: 'Amazon Prime',
        type: 'streamer',
        color: '#00A8E1',
        textColor: 'white',
        logoUrl: 'https://www.google.com/s2/favicons?domain=amazon.com&sz=128',
        icon: ShoppingBag
    },
    {
        id: 'disney',
        name: 'Disney+',
        type: 'streamer',
        color: '#113CCF',
        textColor: 'white',
        logoUrl: 'https://www.google.com/s2/favicons?domain=disneyplus.com&sz=128',
        icon: Tv
    },
    {
        id: 'hbo',
        name: 'HBO Max',
        type: 'streamer',
        color: '#5D2E86',
        textColor: 'white',
        logoUrl: 'https://www.google.com/s2/favicons?domain=hbomax.com&sz=128',
        icon: Tv
    },
    {
        id: 'globoplay',
        name: 'Globoplay',
        type: 'streamer',
        color: '#FF3815',
        textColor: 'white',
        logoUrl: 'https://www.google.com/s2/favicons?domain=globoplay.globo.com&sz=128',
        icon: Tv
    },
    {
        id: 'youtube',
        name: 'YouTube Premium',
        type: 'streamer',
        color: '#FF0000',
        textColor: 'white',
        logoUrl: 'https://www.google.com/s2/favicons?domain=youtube.com&sz=128',
        icon: Tv
    }
];

export const getBrandById = (id: string) => BRANDS.find(b => b.id === id);
export const getBrandsByType = (type: BrandType) => BRANDS.filter(b => b.type === type);
