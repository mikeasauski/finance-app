export const TAX_TABLES_2025 = {
    INSS: [
        { limit: 1518.00, rate: 0.075, deduction: 0 },
        { limit: 2793.88, rate: 0.09, deduction: 22.77 },
        { limit: 4190.83, rate: 0.12, deduction: 106.59 },
        { limit: 8157.41, rate: 0.14, deduction: 190.40 }
    ],
    IRRF: [
        { limit: 2259.20, rate: 0, deduction: 0 },
        { limit: 2826.65, rate: 0.075, deduction: 169.44 },
        { limit: 3751.05, rate: 0.15, deduction: 381.44 },
        { limit: 4664.68, rate: 0.225, deduction: 662.77 },
        { limit: Infinity, rate: 0.275, deduction: 896.00 }
    ],
    MINIMUM_WAGE: 1518.00,
    IOF: {
        CASH: 0.011, // 1.1%
        CARD: 0.0438 // 4.38%
    }
};
