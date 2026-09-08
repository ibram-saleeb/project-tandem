import { describe, it, expect } from 'vitest';
import {
  annualiseAmount,
  deannualiseToMonthly,
  calculateTaxAndLevy,
  calculateHecsHelpRepayment,
  calculatePartnerPosition,
  calculateHousehold
} from './calculator.js';

describe('Calculator — Mathematical & Financial Unit Tests', () => {
  describe('Frequency Conversion & Normalisation', () => {
    it('annualises weekly amounts correctly (x52)', () => {
      expect(annualiseAmount(100, 'weekly')).toBe(5200);
    });

    it('annualises fortnightly amounts correctly (x26)', () => {
      expect(annualiseAmount(250, 'fortnightly')).toBe(6500);
    });

    it('annualises monthly amounts correctly (x12)', () => {
      expect(annualiseAmount(1000, 'monthly')).toBe(12000);
    });

    it('handles negative or invalid frequencies gracefully', () => {
      expect(annualiseAmount('invalid', 'monthly')).toBe(0);
      expect(annualiseAmount(500, 'unknown')).toBe(500);
    });

    it('deannualises to monthly accurately (/12)', () => {
      expect(deannualiseToMonthly(120000)).toBe(10000);
      expect(deannualiseToMonthly(0)).toBe(0);
    });
  });

  describe('ATO Stage 3 Tax & Medicare Levy Math', () => {
    it('returns 0 tax for $0 income', () => {
      const tax = calculateTaxAndLevy(0);
      expect(tax.incomeTax).toBe(0);
      expect(tax.medicareLevy).toBe(0);
      expect(tax.totalTaxAndLevy).toBe(0);
      expect(tax.effectiveTaxRate).toBe(0);
    });

    it('applies 0% tax under Tax-Free Threshold ($18,200)', () => {
      const tax = calculateTaxAndLevy(18200);
      expect(tax.incomeTax).toBe(0);
      expect(tax.medicareLevy).toBe(18200 * 0.02);
    });

    it('calculates Stage 3 Bracket 2 ($18,201 to $45,000 at 16%)', () => {
      const income = 45000;
      const expectedIncomeTax = (45000 - 18200) * 0.16; // $4,288
      const expectedMedicare = 45000 * 0.02; // $900
      const tax = calculateTaxAndLevy(income);

      expect(tax.incomeTax).toBeCloseTo(expectedIncomeTax, 2);
      expect(tax.medicareLevy).toBeCloseTo(expectedMedicare, 2);
      expect(tax.totalTaxAndLevy).toBeCloseTo(expectedIncomeTax + expectedMedicare, 2);
    });

    it('calculates Stage 3 Bracket 3 ($45,001 to $135,000 at 30%)', () => {
      const income = 100000;
      const baseTax = 4288;
      const excessTax = (100000 - 45000) * 0.30;
      const expectedTax = baseTax + excessTax; // $20,788
      const expectedMedicare = 100000 * 0.02; // $2,000

      const tax = calculateTaxAndLevy(income);
      expect(tax.incomeTax).toBeCloseTo(expectedTax, 2);
      expect(tax.medicareLevy).toBeCloseTo(expectedMedicare, 2);
    });

    it('calculates Stage 3 Top Bracket ($190,000+ at 45%)', () => {
      const income = 200000;
      const baseTax = 51638;
      const excessTax = (200000 - 190000) * 0.45;
      const expectedTax = baseTax + excessTax;

      const tax = calculateTaxAndLevy(income);
      expect(tax.incomeTax).toBeCloseTo(expectedTax, 2);
    });
  });

  describe('HECS / HELP Compulsory Repayments', () => {
    it('returns $0 for income below minimum repayment threshold', () => {
      const hecs = calculateHecsHelpRepayment(40000);
      expect(hecs.repaymentAnnual).toBe(0);
      expect(hecs.ratePercent).toBe(0);
    });

    it('applies statutory percentage when over threshold', () => {
      const income = 100000;
      const hecs = calculateHecsHelpRepayment(income);
      expect(hecs.repaymentAnnual).toBeGreaterThan(0);
      expect(hecs.ratePercent).toBeGreaterThan(0);
    });
  });

  describe('Partner & Household Math Safety', () => {
    it('handles $0 partner position without dividing by zero', () => {
      const partner = {
        id: 'p1',
        name: 'Alex',
        salary: 0,
        salaryFrequency: 'annual'
      };

      const result = calculatePartnerPosition(partner);
      expect(result.spendableIncomeAnnual).toBe(0);
      expect(result.spendableIncomeMonthly).toBe(0);
      expect(Number.isFinite(result.spendableIncomeMonthly)).toBe(true);
    });

    it('calculates household net cashflow and deltas accurately', () => {
      const state = {
        partners: [
          { id: 'p1', name: 'Alex', salary: 120000, salaryFrequency: 'annual' },
          { id: 'p2', name: 'Sam', salary: 90000, salaryFrequency: 'annual' }
        ],
        expenses: [
          { id: 'exp_1', amount: 3000, frequency: 'monthly', assignedTo: 'shared' }
        ],
        savingsTargetMonthly: 1000
      };

      const household = calculateHousehold(state);
      expect(household.baseline.combinedUsableMonthly).toBeGreaterThan(0);
      expect(household.baseline.totalExpensesMonthly).toBe(3000);
      expect(household.baseline.netAfterSavingsMonthly).toBe(
        household.baseline.netCashflowMonthly - 1000
      );
    });

    it('correctly reduces taxable income when Salary Sacrifice is present', () => {
      const partnerNoSacrifice = calculatePartnerPosition({
        id: 'p1',
        salary: 100000,
        salarySacrificeAmount: 0
      });

      const partnerWithSacrifice = calculatePartnerPosition({
        id: 'p1',
        salary: 100000,
        salarySacrificeAmount: 500,
        salarySacrificeFrequency: 'monthly' // $6,000 / yr
      });

      expect(partnerWithSacrifice.taxableIncomeAnnual).toBe(94000);
      expect(partnerWithSacrifice.totalTaxAnnual).toBeLessThan(partnerNoSacrifice.totalTaxAnnual);
    });
  });
});
