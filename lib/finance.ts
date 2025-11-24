import { addMonths, setDate, isAfter, startOfDay } from "date-fns";
import { CreditCard } from "@/types";

export function calculateCreditCardDueDate(
    purchaseDate: Date,
    card: CreditCard
): Date {
    const closingDate = setDate(purchaseDate, card.closingDay);
    const isAfterClosing = isAfter(startOfDay(purchaseDate), startOfDay(closingDate));

    // If purchased after closing day, it goes to next month's invoice
    // Usually invoice due date is in the same month as closing or next?
    // Standard: Closing 20th, Due 10th (of next month).
    // If bought on 15th (before closing), due on 10th of next month?
    // Wait, if Closing is 20th Jan, Due is 10th Feb.
    // Purchase 15th Jan -> Bill Jan (Due 10th Feb).
    // Purchase 21st Jan -> Bill Feb (Due 10th Mar).

    // Let's assume Due Day is always in the month FOLLOWING the closing.

    let targetMonthDate = purchaseDate;
    if (isAfterClosing) {
        targetMonthDate = addMonths(purchaseDate, 1);
    }

    // The due date is in the month AFTER the "invoice month" usually?
    // Or is the Due Day relative to the closing?
    // Let's simplify: 
    // If Closing 20, Due 5.
    // Jan 15 -> Closes Jan 20 -> Due Feb 5.
    // Jan 21 -> Closes Feb 20 -> Due Mar 5.

    // So we find the next Closing Date after Purchase Date.
    // Then add 1 month to that month, and set day to Due Day.

    let nextClosingDate = setDate(purchaseDate, card.closingDay);
    if (isAfterClosing) {
        nextClosingDate = addMonths(nextClosingDate, 1);
    }

    // Due date is usually the following month of the closing date
    // But sometimes it's same month if closing is early and due is late?
    // Let's assume standard: Due date is always next month relative to closing.

    // Actually, let's just use a simple logic:
    // Find the relevant Closing Date.
    // The Due Date is X days after Closing, or fixed day in next month.
    // User provided "Data de Vencimento" (Due Day) and "Data de Fechamento" (Closing Day).

    // If Due Day < Closing Day (e.g. Due 5, Closing 25), then Due is next month.
    // If Due Day > Closing Day (e.g. Due 25, Closing 5), then Due is same month? Rare.

    // Let's stick to: Invoice Month is determined by Closing.
    // If Purchase <= Closing, Invoice is Current Month.
    // If Purchase > Closing, Invoice is Next Month.
    // Due Date is set to `dueDay` of (Invoice Month + 1).

    let invoiceMonth = purchaseDate;
    if (isAfterClosing) {
        invoiceMonth = addMonths(purchaseDate, 1);
    }

    // Due date is in the NEXT month relative to the invoice "reference" month?
    // No, usually:
    // Invoice Jan: Closes Jan 20. Due Feb 5.
    // So if we are in "Invoice Jan", due date is Feb 5.

    return setDate(addMonths(invoiceMonth, 1), card.dueDay);
}
