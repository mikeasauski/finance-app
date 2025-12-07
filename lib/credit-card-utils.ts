import { CreditCard } from "@/types";

export function getBestBuyDate(card: CreditCard): Date {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Best buy date is typically the day after the closing day
    let bestDay = card.closingDay + 1;
    let bestMonth = currentMonth;
    let bestYear = currentYear;

    // If closing day is today or passed, the best buy date is next month's closing day + 1
    // Actually, if today > closingDay, the invoice is already closed, so TODAY is a good day (next invoice)
    // If today <= closingDay, the invoice is open, so buying now goes to THIS invoice (bad). 
    // Best day is closingDay + 1.

    if (today.getDate() <= card.closingDay) {
        // Invoice is open. Best day is closingDay + 1 of THIS month.
        // If closingDay is e.g. 31, we need to handle overflow
    } else {
        // Invoice is closed. Today is already a "best day" (next invoice).
        return today;
    }

    const date = new Date(bestYear, bestMonth, bestDay);
    // Handle month overflow automatically by Date constructor
    return date;
}

export function isInvoiceOpen(card: CreditCard): boolean {
    const today = new Date();
    return today.getDate() <= card.closingDay;
}
