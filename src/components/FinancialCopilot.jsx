import React, { useState } from 'react';
import { Sparkles, PieChart, Scale, ShieldCheck, Users, TrendingUp } from 'lucide-react';
import { formatMoney } from '../utils/formatters.js';
import { annualiseAmount, deannualiseToMonthly } from '../logic/calculator.js';

export function FinancialCopilot({ data, savingsTargetMonthly, partners, expenses }) {
  const [activeCopilotTab, setActiveCopilotTab] = useState('structure'); // 'structure' | 'tax' | 'runway' | 'equity'

  const current = data?.baseline;
  if (!current) return null;

  const p1 = current.p1 || {};
  const p2 = current.p2 || {};

  const p1Name = partners?.[0]?.name || 'Partner 1';
  const p2Name = partners?.[1]?.name || 'Partner 2';

  const totalExpenses = current.totalExpensesMonthly || 0;
  const totalSuper = current.totalSuperMonthly || 0;

  // 1. Expense Structure Analysis (Fixed vs Discretionary)
  const fixedCategories = ['Housing', 'Debt', 'Insurance', 'Childcare'];
  const fixedExpensesVal = expenses
    .filter(e => fixedCategories.includes(e.category || 'General'))
    .reduce((sum, e) => sum + deannualiseToMonthly(annualiseAmount(e.amount, e.frequency)), 0);
  const discretionaryExpensesVal = Math.max(0, totalExpenses - fixedExpensesVal);
  const fixedRatio = totalExpenses > 0 ? Math.min(100, Math.round((fixedExpensesVal / totalExpenses) * 100)) : 0;
  const discRatio = Math.max(0, 100 - fixedRatio);

  // 2. ATO Tax Bracket Proximity Analysis
  const p1TaxableAnnual = p1.taxableIncomeAnnual || 0;
  const p2TaxableAnnual = p2.taxableIncomeAnnual || 0;

  const getBracketInfo = (salary) => {
    if (salary > 190000) return { rate: '45%', nextThreshold: null, distance: 0 };
    if (salary > 135000) return { rate: '37%', nextThreshold: 190000, distance: 190000 - salary };
    if (salary > 45000) return { rate: '30%', nextThreshold: 135000, distance: 135000 - salary };
    if (salary > 18200) return { rate: '16%', nextThreshold: 45000, distance: 45000 - salary };
    return { rate: '0%', nextThreshold: 18200, distance: 18200 - salary };
  };

  const p1Bracket = getBracketInfo(p1TaxableAnnual);
  const p2Bracket = getBracketInfo(p2TaxableAnnual);

  // 3. Emergency Runway Months
  const monthlySavingsReserves = savingsTargetMonthly || 0;
  const runwayMonths = fixedExpensesVal > 0 ? (monthlySavingsReserves * 6 / fixedExpensesVal).toFixed(1) : '6+';

  // 4. Partner Contribution Equity
  const p1Usable = p1.spendableIncomeMonthly || 0;
  const p2Usable = p2.spendableIncomeMonthly || 0;
  const combinedPartners = (p1Usable + p2Usable) || 1;
  const p1EquityPct = Math.round((p1Usable / combinedPartners) * 100);
  const p2EquityPct = 100 - p1EquityPct;

  // 5. 5-Year Wealth Accumulation Calculation
  const netSurplusMonthly = current.netCashflowMonthly || 0;
  const netSurplus5Yr = Math.max(0, netSurplusMonthly * 12 * 5);
  const superAnnual = totalSuper * 12;
  const super5YrCompound = superAnnual * 5.637; // ~6% net annual compound growth multiplier over 5 years
  const total5YrWealth = netSurplus5Yr + super5YrCompound;

  const tabs = [
    { id: 'structure', label: 'Cashflow Structure', icon: PieChart },
    { id: 'tax', label: 'Tax Efficiency', icon: Scale },
    { id: 'runway', label: 'Runway & Reserves', icon: ShieldCheck },
    { id: 'equity', label: 'Partner Parity', icon: Users },
    { id: 'wealth', label: '5-Yr Wealth', icon: TrendingUp }
  ];

  return (
    <div className="financial-copilot-card">
      <div className="copilot-card-header">
        <div className="copilot-badge-group">
          <span className="copilot-glow-badge">
            <Sparkles size={14} className="text-primary inline-icon" /> Household Intelligence
          </span>
        </div>

        {/* Insight Tabs Header */}
        <div className="copilot-tabs-bar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeCopilotTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`copilot-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveCopilotTab(tab.id)}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Insight Body 1: Cashflow Structure */}
      {activeCopilotTab === 'structure' && (
        <div className="copilot-insight-body">
          <div className="insight-main-metric">
            <span className="insight-label">Expense Commitment Structure</span>
            <span className="insight-highlight">
              <span className="text-warning font-semibold">{fixedRatio}% Fixed Commitments</span> ({formatMoney(fixedExpensesVal)}/mo) · <span className="text-surplus font-semibold">{discRatio}% Flexible</span> ({formatMoney(discretionaryExpensesVal)}/mo)
            </span>
          </div>

          <div className="progress-bar-track copilot-track">
            <div className="progress-bar-fill fill-cat-housing" style={{ width: `${fixedRatio}%` }} title={`Fixed Commitments: ${fixedRatio}%`} />
            <div className="progress-bar-fill fill-cat-personal" style={{ width: `${discRatio}%` }} title={`Flexible Outgoings: ${discRatio}%`} />
          </div>

          <div className="copilot-narrative-card">
            <p className="copilot-narrative">
              {fixedRatio > 70
                ? `${fixedRatio}% of your household expenses are locked into fixed commitments (Housing, Debt, Insurance). Reducing fixed commitments provides significantly greater buffer relief than trimming small lifestyle expenses.`
                : `Your household structure is agile: only ${fixedRatio}% is committed to non-negotiables, allowing you to absorb unexpected life events with confidence.`
              }
            </p>
          </div>
        </div>
      )}

      {/* Insight Body 2: Tax Efficiency */}
      {activeCopilotTab === 'tax' && (
        <div className="copilot-insight-body">
          <div className="copilot-tax-grid">
            <div className="partner-tax-card">
              <div className="tax-partner-name">{p1Name} · Marginal Rate: <strong className="text-primary">{p1Bracket.rate}</strong></div>
              <div className="tax-threshold-text">
                {p1Bracket.nextThreshold
                  ? `$${Math.round(p1Bracket.distance).toLocaleString()} buffer below the next tax bracket ($${p1Bracket.nextThreshold.toLocaleString()}/yr).`
                  : `Currently in top ATO tax bracket (45%).`}
              </div>
            </div>

            <div className="partner-tax-card">
              <div className="tax-partner-name">{p2Name} · Marginal Rate: <strong className="text-primary">{p2Bracket.rate}</strong></div>
              <div className="tax-threshold-text">
                {p2Bracket.nextThreshold
                  ? `$${Math.round(p2Bracket.distance).toLocaleString()} buffer below the next tax bracket ($${p2Bracket.nextThreshold.toLocaleString()}/yr).`
                  : `Currently in top ATO tax bracket (45%).`}
              </div>
            </div>
          </div>

          <div className="copilot-narrative-card">
            <p className="copilot-narrative">
              Together you build <strong>{formatMoney(totalSuper * 12)}/yr</strong> in wealth via employer super (12% SG). Voluntary pre-tax salary sacrifice is taxed at 15% instead of your top marginal rate ({p1Bracket.rate} / {p2Bracket.rate}).
            </p>
          </div>
        </div>
      )}

      {/* Insight Body 3: Runway & Reserves */}
      {activeCopilotTab === 'runway' && (
        <div className="copilot-insight-body">
          <div className="insight-main-metric">
            <span className="insight-label">Estimated Emergency Runway</span>
            <span className="insight-highlight text-surplus">
              <strong>{monthlySavingsReserves > 0 ? `${formatMoney(monthlySavingsReserves)}/mo` : 'Target Not Set'}</strong> {monthlySavingsReserves > 0 ? `(est. ${runwayMonths} months of fixed costs covered)` : '— Set a monthly target below'}
            </span>
          </div>

          <div className="copilot-narrative-card">
            <p className="copilot-narrative">
              Allocating a consistent monthly savings buffer protects your fixed commitments ({formatMoney(fixedExpensesVal)}/mo) against career pivots, parental leave, or income shocks.
            </p>
          </div>
        </div>
      )}

      {/* Insight Body 4: Partner Equity */}
      {activeCopilotTab === 'equity' && (
        <div className="copilot-insight-body">
          <div className="insight-main-metric">
            <span className="insight-label">Post-Tax Spendable Contribution Parity</span>
            <span className="insight-highlight text-primary">
              <strong>{p1Name}: {p1EquityPct}%</strong> ({formatMoney(p1Usable)}/mo) · <strong>{p2Name}: {p2EquityPct}%</strong> ({formatMoney(p2Usable)}/mo)
            </span>
          </div>

          <div className="progress-bar-track copilot-track">
            <div className="progress-bar-fill fill-p1" style={{ width: `${p1EquityPct}%` }} />
            <div className="progress-bar-fill fill-p2" style={{ width: `${p2EquityPct}%` }} />
          </div>

          <div className="copilot-narrative-card">
            <p className="copilot-narrative">
              {p1Name} contributes {p1EquityPct}% and {p2Name} contributes {p2EquityPct}% of your total usable income. Shared household expenses are allocated proportionally to maintain parity.
            </p>
          </div>
        </div>
      )}

      {/* Insight Body 5: 5-Year Wealth & Super Forecast */}
      {activeCopilotTab === 'wealth' && (
        <div className="copilot-insight-body">
          <div className="insight-main-metric">
            <span className="insight-label">5-Year Household Net Worth Trajectory</span>
            <span className="insight-highlight text-mint">
              <strong>{formatMoney(total5YrWealth)} Est. 5-Yr Accumulated Wealth</strong>
            </span>
          </div>

          <div className="progress-bar-track copilot-track">
            <div className="progress-bar-fill fill-retained" style={{ width: `${total5YrWealth > 0 ? Math.round((netSurplus5Yr / total5YrWealth) * 100) : 50}%` }} title="Liquid Savings Surplus" />
            <div className="progress-bar-fill fill-cat-housing" style={{ width: `${total5YrWealth > 0 ? Math.round((super5YrCompound / total5YrWealth) * 100) : 50}%` }} title="Compounded Super Wealth" />
          </div>

          <div className="copilot-narrative-card">
            <p className="copilot-narrative">
              Over 5 years, your baseline position generates <strong>{formatMoney(netSurplus5Yr)}</strong> in liquid cash surplus + <strong>{formatMoney(super5YrCompound)}</strong> in compounded Superannuation (at ~6% p.a. net growth).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
