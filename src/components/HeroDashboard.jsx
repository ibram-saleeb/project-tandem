import React, { useState } from 'react';
import { formatMoney } from '../utils/formatters.js';
import { FinancialCopilot } from './FinancialCopilot.jsx';

export function HeroDashboard({ data, scenarioMode, savingsTargetMonthly, _onSavingsChange }) {
  const [isMonthClosed, setIsMonthClosed] = useState(false);
  const { baseline, scenario } = data;

  const current = scenarioMode && scenario ? scenario : baseline;

  // Key cashflow figures
  const usable = current.combinedUsableMonthly || 0;
  const expenses = current.totalExpensesMonthly || 0;
  const superMonthly = current.totalSuperMonthly || 0;
  const buffer = current.netCashflowMonthly || 0;
  const target = savingsTargetMonthly || 1500;
  const freeAfterSavings = Math.max(0, buffer - target);

  // Proportions for segmented bar
  const fixedExpensesVal = 4450; // default estimated fixed
  const flexibleExpensesVal = Math.max(0, expenses - fixedExpensesVal);
  
  const fixedPct = usable > 0 ? Math.min(100, Math.round((fixedExpensesVal / usable) * 100)) : 34;
  const flexPct = usable > 0 ? Math.min(100, Math.round((flexibleExpensesVal / usable) * 100)) : 18.5;
  const savingsPct = usable > 0 ? Math.min(100, Math.round((target / usable) * 100)) : 11.5;
  const freePct = Math.max(0, 100 - (fixedPct + flexPct + savingsPct));

  // Progress ring
  const targetPct = target > 0 ? Math.min(100, Math.round((buffer / target) * 100)) : 100;
  const ringOffset = 339 - (339 * (targetPct / 100));

  const p1Initials = current.p1?.initials || 'AL';
  const p2Initials = current.p2?.initials || 'SM';
  const p1Name = current.p1?.name || 'Alex';
  const p2Name = current.p2?.name || 'Sam';

  const p1Usable = current.p1?.spendableIncomeMonthly || 0;
  const p2Usable = current.p2?.spendableIncomeMonthly || 0;

  return (
    <section className="hero-dashboard-section" aria-label="Monthly Household Overview">
      {/* Month & Partner Avatar Pill Header */}
      <div className="hero-top-row">
        <div className="month-pill-label">August</div>
        <div className="avatar-cluster">
          <div className="avatar-circle avatar-primary" title={p1Name}>{p1Initials}</div>
          <div className="avatar-circle avatar-secondary" title={p2Name}>{p2Initials}</div>
        </div>
      </div>

      {/* Main Ring & Hero Surplus Display */}
      <div className="hero-main-banner">
        <div className="ring-container">
          <svg width="118" height="118" viewBox="0 0 118 118" className="progress-ring-svg">
            <circle cx="59" cy="59" r="54" className="ring-bg" />
            <circle
              cx="59"
              cy="59"
              r="54"
              className="ring-bar"
              strokeDasharray="339"
              strokeDashoffset={ringOffset}
            />
          </svg>
          <div className="ring-inner-text">
            <div className="ring-pct-number">{targetPct}%</div>
            <div className="ring-pct-label">of target</div>
          </div>
        </div>

        <div className="hero-number-col">
          <div className="hero-hero-number text-surplus">
            {formatMoney(buffer)}
          </div>
          <div className="hero-free-subtext">
            left over. <span className="text-mint">{formatMoney(freeAfterSavings)}</span> free after savings.
          </div>
        </div>
      </div>

      {/* Segmented Cashflow Proportion Bar */}
      <div className="segmented-bar-container">
        <div className="segmented-flow-bar">
          <div className="flow-segment segment-fixed" style={{ width: `${fixedPct}%` }} title={`Fixed Commitments: ${fixedPct}%`} />
          <div className="flow-segment segment-flexible" style={{ width: `${flexPct}%` }} title={`Flexible Outgoings: ${flexPct}%`} />
          <div className="flow-segment segment-savings" style={{ width: `${savingsPct}%` }} title={`Savings Target: ${savingsPct}%`} />
          <div className="flow-segment segment-unspoken" style={{ width: `${freePct}%` }} title={`Unspoken For: ${freePct}%`} />
        </div>
        <div className="segmented-bar-labels">
          <span>Fixed {formatMoney(fixedExpensesVal)}</span>
          <span>Flexible {formatMoney(flexibleExpensesVal)}</span>
          <span className="text-mint">Yours {formatMoney(freeAfterSavings)}</span>
        </div>
      </div>

      {/* Hairline Cashflow Flow Breakdown */}
      <div className="cashflow-flow-list">
        <div className="flow-row">
          <div className="flow-row-info">
            <div className="flow-row-title">Coming in</div>
            <div className="flow-row-sub">{p1Name} {formatMoney(p1Usable)} · {p2Name} {formatMoney(p2Usable)}</div>
          </div>
          <div className="flow-row-amount text-mint">{formatMoney(usable)}</div>
        </div>

        <div className="flow-row">
          <div className="flow-row-info">
            <div className="flow-row-title">Going out</div>
            <div className="flow-row-sub">{current.expenses?.length || 6} regular outgoings</div>
          </div>
          <div className="flow-row-amount text-slate">{formatMoney(expenses)}</div>
        </div>

        <div className="flow-row">
          <div className="flow-row-info">
            <div className="flow-row-title">Super building</div>
            <div className="flow-row-sub">{formatMoney(superMonthly * 12)} a year employer SG</div>
          </div>
          <div className="flow-row-amount text-slate">{formatMoney(superMonthly)}</div>
        </div>
      </div>

      {/* Contextual Intelligence Banner */}
      <div className="context-intel-card">
        <div className="intel-accent-bar" />
        <div className="intel-content">
          <div className="intel-text">
            Rent is 55% of your spending. A $500 rise still clears your savings target.
          </div>
          <div className="intel-link">Model it →</div>
        </div>
      </div>

      {/* Household Intelligence Copilot */}
      <FinancialCopilot
        data={data}
        savingsTargetMonthly={savingsTargetMonthly}
        partners={[current.p1, current.p2]}
        expenses={[]}
      />

      {/* Close Out Month Action Button */}
      <button
        type="button"
        className="btn-close-month"
        onClick={() => setIsMonthClosed(true)}
      >
        Close out August
      </button>

      {/* Rewarding Month Closed Modal Overlay */}
      {isMonthClosed && (
        <div className="month-closed-overlay" onClick={() => setIsMonthClosed(false)}>
          <div className="month-closed-card" onClick={e => e.stopPropagation()}>
            <div className="celebrate-ring-wrapper">
              <svg width="132" height="132" viewBox="0 0 132 132" className="celebrate-svg">
                <circle cx="66" cy="66" r="54" className="celebrate-bg" />
                <circle cx="66" cy="66" r="54" className="celebrate-bar" strokeDasharray="339" />
              </svg>
              <div className="celebrate-check">✓</div>
            </div>

            <div className="celebrate-text-group">
              <div className="celebrate-title">August closed out</div>
              <div className="celebrate-desc">
                You put away {formatMoney(target)} and still finished {formatMoney(freeAfterSavings)} ahead.
              </div>
            </div>

            <div className="celebrate-stats-row">
              <div className="celebrate-stat">
                <div className="stat-number">7</div>
                <div className="stat-label">months on target</div>
              </div>
              <div className="stat-divider" />
              <div className="celebrate-stat">
                <div className="stat-number">$10,500</div>
                <div className="stat-label">saved this year</div>
              </div>
            </div>

            <button
              type="button"
              className="btn-start-next"
              onClick={() => setIsMonthClosed(false)}
            >
              Start September
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
