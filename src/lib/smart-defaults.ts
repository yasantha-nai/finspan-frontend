// Smart defaults based on age and demographic data
export interface SmartDefaults {
    salary: number;
    taxDeferredSavings: number;
    taxFreeSavings: number;
    taxableSavings: number;
    retirementAge: number;
    contribDeferred: number;
}

export function getSmartDefaults(age: number): SmartDefaults {
    // Age brackets with typical values
    if (age >= 18 && age < 30) {
        return {
            salary: 65000,
            taxDeferredSavings: 25000,
            taxFreeSavings: 10000,
            taxableSavings: 20000,
            retirementAge: 67,
            contribDeferred: 500,
        };
    } else if (age >= 30 && age < 40) {
        return {
            salary: 85000,
            taxDeferredSavings: 150000,
            taxFreeSavings: 40000,
            taxableSavings: 60000,
            retirementAge: 67,
            contribDeferred: 1000,
        };
    } else if (age >= 40 && age < 50) {
        return {
            salary: 110000,
            taxDeferredSavings: 400000,
            taxFreeSavings: 100000,
            taxableSavings: 150000,
            retirementAge: 67,
            contribDeferred: 1500,
        };
    } else if (age >= 50 && age < 60) {
        return {
            salary: 125000,
            taxDeferredSavings: 750000,
            taxFreeSavings: 200000,
            taxableSavings: 300000,
            retirementAge: 67,
            contribDeferred: 2000,
        };
    } else {
        // 60+
        return {
            salary: 130000,
            taxDeferredSavings: 1200000,
            taxFreeSavings: 300000,
            taxableSavings: 500000,
            retirementAge: 67,
            contribDeferred: 2500,
        };
    }
}

export function getAgeBracketLabel(age: number): string {
    if (age < 30) return '18-29';
    if (age < 40) return '30-39';
    if (age < 50) return '40-49';
    if (age < 60) return '50-59';
    return '60+';
}
