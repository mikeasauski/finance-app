import { getBrandsByType } from "./brands";

export interface Bank {
    id: string;
    name: string;
    color: string;
    logoUrl: string;
    textColor: 'white' | 'black';
}

// Adapter to maintain backward compatibility
export const BANKS: Bank[] = getBrandsByType('bank').map(brand => ({
    id: brand.id,
    name: brand.name,
    color: brand.color,
    logoUrl: brand.logoUrl || '',
    textColor: brand.textColor
}));

export const getBankById = (id: string) => BANKS.find(b => b.id === id);
