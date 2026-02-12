import { SimulationResult, SimulationYearOutput } from "@/types/simulation";

export function getMockSimulationResult(): SimulationResult {
    const startAge = 35;
    const endAge = 95;
    const currentYear = new Date().getFullYear();
    const years: SimulationYearOutput[] = [];

    let taxableBalance = 50000;
    let deferredBalance = 150000;
    let rothBalance = 30000;
    let salary = 100000;

    for (let age = startAge; age <= endAge; age++) {
        const year = currentYear + (age - startAge);
        const isRetirement = age >= 65;

        // Growth rates
        const growthRate = 0.07;
        const inflationRate = 0.025;
        const salaryGrowth = 0.03;

        // Grow balances
        taxableBalance *= (1 + growthRate);
        deferredBalance *= (1 + growthRate);
        rothBalance *= (1 + growthRate);

        // Income & Contributions
        let workIncome = 0;
        let socialSecurity = 0;
        let contributions = 0;

        if (!isRetirement) {
            salary *= (1 + salaryGrowth);
            workIncome = salary;
            const contributionAmount = 25000; // Total annual contribution
            contributions = contributionAmount;

            // Split contributions
            taxableBalance += contributionAmount * 0.2;
            deferredBalance += contributionAmount * 0.6;
            rothBalance += contributionAmount * 0.2;
        } else {
            socialSecurity = 30000 * Math.pow(1 + inflationRate, age - 65);
        }

        const totalPortfolio = taxableBalance + deferredBalance + rothBalance;

        years.push({
            year,
            userAge: age,
            workIncome,
            socialSecurity,
            pension: 0,
            rmds: isRetirement && age >= 73 ? deferredBalance * 0.04 : 0,
            interestDividends: taxableBalance * 0.02,
            grossIncome: workIncome + socialSecurity,
            standardDeduction: 14600 * Math.pow(1 + inflationRate, age - startAge),
            taxableIncome: Math.max(0, (workIncome * 0.8) - 14600),
            federalTax: workIncome * 0.15,
            stateTax: workIncome * 0.05,
            ficaTax: workIncome * 0.0765,
            totalTax: workIncome * 0.28,
            essentialExpenses: 60000 * Math.pow(1 + inflationRate, age - startAge),
            healthcare: 8000 * Math.pow(1 + (inflationRate + 0.02), age - startAge),
            discretionary: 40000 * Math.pow(1 + inflationRate, age - startAge),
            oneTimeExpense: 0,
            totalSpend: 108000 * Math.pow(1 + inflationRate, age - startAge),
            netSurplusGap: isRetirement ? -50000 : 20000,
            contributions,
            drawTaxable: isRetirement ? 30000 : 0,
            drawDeferred: isRetirement ? 40000 : 0,
            drawRoth: isRetirement ? 10000 : 0,
            rothConversion: 0,
            conversionTaxCost: 0,
            taxableBalance,
            deferredBalance,
            rothBalance,
            totalPortfolio,
            legacyValue: totalPortfolio,
            realWealth: totalPortfolio / Math.pow(1 + inflationRate, age - startAge),
        });
    }

    return {
        years,
        successProbability: 0.92,
        financialIndependenceAge: 58,
        totalLegacy: years[years.length - 1].totalPortfolio,
        shortfallYears: [],
    };
}
